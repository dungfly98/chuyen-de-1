// core components
import Header from "components/Headers/Header.js";
// layout for this page
import Admin from "layouts/Admin.js";
import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import InputLocationComponent from "../../components/Input/input-location";
import LocationChooseImages from "../../components/Location/location-choose-image";
import { URL_PATH } from "../../config/url-path";
import ApiHelper from "../../networking/api-helper";

const KEY_MAP = "AIzaSyDrIFlkOZVH2yqPyVthQfxyiTl8TmPfY7c";

class Location extends Component {
  idLocationUpdate = undefined;
  state = {
    name: "",
    address: "",
    lat: "",
    lng: "",
    des: "",
    isUpdate: false,
    locations: [],
  };

  componentDidMount = () => {
    this.onFetchLocation();
  };

  onFetchLocation = async () => {
    try {
      const res = await ApiHelper.fetch(URL_PATH.LOCATION);
      this.setState({ locations: res?.data || [] });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  onDone = async () => {
    const { isUpdate } = this.state;
    try {
      if (this.idLocationUpdate) {
        const res = await ApiHelper.post(URL_PATH.UPDATE_LOCATION, {
          id: this.idLocationUpdate,
          ...this.state,
        });
        if (res.code === 200) {
          this.onFetchLocation();
          this.onBackAddLocation();
        }
        return;
      }
      const res = await ApiHelper.post(URL_PATH.ADD_LOCATION, {
        ...this.state,
      });

      if (res.code === 200) {
        this.onFetchLocation();
        this.onBackAddLocation();
      }
      // const images = this.refLocation.state.images || [];
      // const formData = new FormData();

      // formData.append("file", "1231321213");

      // // images.map((item, index) => {
      // //   console.log("item: ", item);
      // //   formData.append(`images[${index}]`, {
      // //     file: item.file,
      // //   });
      // // });

      // const res = await ApiHelper.postForm("/upload-images", formData);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  onGetLatLng = (search) => {
    try {
      geocodeByAddress(search)
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          this.setState({ lat, lng });
        });
    } catch (error) {}
  };

  onChange = (key) => (e) => {
    this.setState({ [key]: e.target.value });
  };

  onChooseImage = () => {};

  onEditLocation = (e) => () => {
    this.idLocationUpdate = e.id;
    this.setState({
      name: e.name || "",
      address: e.address || "",
      lat: e.lat || "",
      lng: e.lng || "",
      des: e.des || "",
      isUpdate: true,
    });
  };

  onRemove = (e) => () => {
    confirmAlert({
      title: "Confirm deletion",
      message: "Are you sure you want to delete this address?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.onPressRemove(e),
        },
        {
          label: "No",
        },
      ],
    });
  };

  onPressRemove = (e) => {
    let newData = [...this.state.locations];
    newData = newData.filter((item) => item.id !== e.id);
    this.setState({ locations: newData });
    ApiHelper.post(URL_PATH.REMOVE_LOCATION, { id: e.id });
  };

  onBackAddLocation = () => {
    this.idLocationUpdate = undefined;
    this.setState({
      name: "",
      address: "",
      lat: "",
      lng: "",
      des: "",
      isUpdate: false,
    });
  };

  renderImages = () => {
    return <LocationChooseImages ref={(ref) => (this.refLocation = ref)} />;
  };

  renderContent = () => {
    const { name, address, lat, lng, des, isUpdate, locations } = this.state;
    if (!isUpdate) {
      return (
        <CardBody>
          <div style={locationListStyle.container}>
            {locations.map((e) => {
              return (
                <ul style={locationListStyle.ul} key={e.name}>
                  <img
                    src={require("./ic_map.png")}
                    alt="..."
                    // className="rounded-circle"
                    width={80}
                    style={{ marginRight: 10 }}
                  />
                  <span
                    style={{
                      marginLeft: 15,
                      color: "#32325d",
                      fontWeight: "bold",
                      fontSize: 17,
                    }}
                  >
                    {e.name}
                  </span>

                  <a href="#" style={{ float: "right" }}>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        className="btn-icon-only text-light"
                        href="#pablo"
                        role="button"
                        size="sm"
                        color=""
                      >
                        <i className="fas fa-ellipsis-v" />
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-arrow" right>
                        <DropdownItem
                          href="#pablo"
                          onClick={this.onEditLocation(e)}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem href="#pablo" onClick={this.onRemove(e)}>
                          Remove
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </a>
                  <br />
                  <span
                    style={{
                      float: "left",
                      marginLeft: 105,
                      marginTop: -25,
                      fontSize: 15,
                    }}
                  >
                    {e.address}
                  </span>
                </ul>
              );
            })}
          </div>

          {/* <Form>
            <tbody>
              {locations.map((e) => {
                return (
                  <ul style={locationListStyle.ul} key={e.name}>
                    <img
                      src={require("assets/img/theme/team-2-800x800.jpg")}
                      alt="..."
                      className="rounded-circle"
                      width={100}
                    />
                    <a>{e.name}</a>
                  </ul>
                );
              })}
            </tbody>
          </Form> */}
        </CardBody>
      );
    }
    return (
      <CardBody>
        <Form>
          <h6 className="heading-small text-muted mb-4">
            Location information
          </h6>
          <div className="pl-lg-0">
            <div style={{ marginBottom: 10 }}>Search for address</div>
            <div style={{ marginBottom: 10 }}>
              <GooglePlacesAutocomplete
                apiKey={KEY_MAP}
                autocompletionRequest={{
                  componentRestrictions: {
                    country: ["vn"],
                  },
                }}
                selectProps={{
                  onChange: (e) => {
                    this.setState({ address: e.label });
                    this.onGetLatLng(e.label);
                  },
                }}
              />
            </div>

            <Row>
              <InputLocationComponent
                title="Name"
                placeholder="Name"
                type="text"
                value={name}
                onChange={this.onChange("name")}
              />

              <InputLocationComponent
                title="Address"
                placeholder="Address"
                type="text"
                value={address}
                onChange={this.onChange("address")}
              />
            </Row>

            <Row>
              <InputLocationComponent
                title="Latitude"
                placeholder="Latitude"
                type="number"
                value={lat}
                onChange={this.onChange("lat")}
              />
              <InputLocationComponent
                title="Longtitude"
                placeholder="Longtitude"
                type="number"
                value={lng}
                onChange={this.onChange("lng")}
              />
            </Row>
            <Row>
              <InputLocationComponent
                title="Description"
                placeholder="Description"
                value={des}
                onChange={this.onChange("des")}
              />
            </Row>
            {this.renderImages()}
          </div>
        </Form>
      </CardBody>
    );
  };

  renderButtonRight = () => {
    const { isUpdate } = this.state;

    return (
      <Col className="text-right" xs="4">
        {isUpdate && (
          <Button
            color="red"
            href="#pablo"
            onClick={this.onBackAddLocation}
            size="sm"
          >
            Back
          </Button>
        )}
        <Button
          color="primary"
          href="#pablo"
          onClick={() => {
            if (!isUpdate) {
              this.setState({ isUpdate: true });
              return;
            }
            this.onDone();
          }}
          size="sm"
        >
          {isUpdate ? "Save" : "Add"}
        </Button>
      </Col>
    );
  };

  render() {
    const { name, address, lat, lng, des } = this.state;
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--8" fluid>
          <Row>
            <Col className="order-xl-1">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Locations</h3>
                    </Col>
                    {this.renderButtonRight()}
                  </Row>
                </CardHeader>
                {this.renderContent()}
              </Card>
            </Col>
          </Row>
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${KEY_MAP}&libraries=places`}
          ></script>
        </Container>
      </>
    );
  }
}

Location.layout = Admin;

const locationListStyle = {
  container: {
    flex: 1,
    display: "float",
  },
  ul: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 3,
    boxShadow: "0 2px 3px 1px rgba(255, 105, 135, .2)",
    padding: 0,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  itemStyle: {
    width: "100%",
    display: "float",
  },
};
export default Location;
