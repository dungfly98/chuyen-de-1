import Header from "components/Headers/Header.js";
import Admin from "layouts/Admin.js";
import React from "react";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
  InfoWindow,
  DirectionsRenderer,
} from "react-google-maps";
import { Card, Container, Row } from "reactstrap";
import { URL_PATH } from "../../config/url-path";
import ApiHelper from "../../networking/api-helper";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { withRouter } from "next/router";

const LOCATION_DEFAULT = {
  lat: 21.072398,
  lng: 105.7718817,
};

const MapWrapper = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap
      center={props.currentLocation}
      defaultZoom={12}
      defaultCenter={props.currentLocation}
      defaultOptions={{
        scrollwheel: false,
      }}
    >
      {props.children}
    </GoogleMap>
  ))
);

const KEY_MAP = "AIzaSyDrIFlkOZVH2yqPyVthQfxyiTl8TmPfY7c";

const CONFIG_MAP = `https://maps.googleapis.com/maps/api/js?key=${KEY_MAP}`;

class Maps extends React.Component {
  state = {
    locations: [],
    currentLocation: LOCATION_DEFAULT,
    indexShowInfo: -1,
    directions: undefined,
    indexDirection: -1,
    isShowMarket: true,
  };

  componentDidMount() {
    this.onFetchLocation();
    this.onGetCurrentLocation();
  }

  onMapDriections = (e, indexDirection) => () => {
    const { currentLocation } = this.state;
    const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route(
      {
        origin: new google.maps.LatLng(
          currentLocation.lat,
          currentLocation.lng
        ),
        destination: new google.maps.LatLng(e.lat, e.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        console.log("result, status: ", result, status);
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result,
            indexDirection,
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  onGetCurrentLocation = () => {
    const that = this;
    navigator.geolocation.getCurrentPosition(function (res) {
      if (res.coords.latitude) {
        that.setState({
          currentLocation: {
            lat: res.coords.latitude,
            lng: res.coords.longitude,
          },
        });
      }
    });
  };

  onFetchLocation = async () => {
    try {
      const res = await ApiHelper.fetch(URL_PATH.LOCATION);
      this.setState({ locations: res?.data || [] });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  onChangeStatusMarker = () => {
    let newStatus = !this.state.isShowMarket;
    this.setState({
      isShowMarket: newStatus,
      directions: newStatus ? this.state.directions : undefined,
    });
  };

  onClickMarker = (e, i, status) => () => {
    let newIndex = status ? i : -1;
    this.setState({
      indexShowInfo: newIndex,
      directions: status ? this.state.directions : undefined,
      indexDirection: undefined,
    });
  };

  onGetLatLng = (search) => {
    try {
      geocodeByAddress(search)
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          this.setState({ currentLocation: { lat, lng } });
        });
    } catch (error) {}
  };

  render() {
    const {
      locations,
      currentLocation,
      indexShowInfo,
      directions,
      indexDirection,
      isShowMarket,
      defaultZoom,
    } = this.state;
    return (
      <>
        <Header />

        {/* Page content */}
        <Container className="mt--8" fluid>
          <Row>
            <div className="col">
              <Card className="shadow border-0">
                <div>
                  <div style={{ width: "90%", float: "left" }}>
                    <GooglePlacesAutocomplete
                      apiKey={KEY_MAP}
                      autocompletionRequest={{
                        componentRestrictions: {
                          country: ["vn"],
                        },
                      }}
                      selectProps={{
                        onChange: (e) => {
                          this.onGetLatLng(e.label);
                        },
                      }}
                    />
                  </div>
                  <a
                    style={{ float: "right", marginRight: 10, marginTop: 5 }}
                    href="#"
                    onClick={this.onChangeStatusMarker}
                  >
                    {isShowMarket ? "Hide Marker" : "Show Marker"}
                  </a>
                </div>

                <MapWrapper
                  currentLocation={currentLocation}
                  googleMapURL={CONFIG_MAP}
                  loadingElement={<div style={{ height: `100%` }} />}
                  containerElement={
                    <div
                      style={{ height: `800px` }}
                      className="map-canvas"
                      id="map-canvas"
                    />
                  }
                  mapElement={
                    <div style={{ height: `100%`, borderRadius: "inherit" }} />
                  }
                  defaultZoom={defaultZoom}
                >
                  {/* <Marker position={currentLocation} /> */}

                  {directions ? (
                    <DirectionsRenderer directions={directions} />
                  ) : null}
                  {locations.map((e, i) => {
                    if ((directions && i !== indexDirection) || !isShowMarket)
                      return null;

                    return (
                      <Marker
                        key={e.id.toString()}
                        position={{ lat: e.lat, lng: e.lng }}
                        onClick={this.onClickMarker(e, i, true)}
                        icon={{ url: require("./ic_ball.png") }}
                      >
                        {indexShowInfo === i && (
                          <InfoWindow onCloseClick={this.onClickMarker(e, i)}>
                            <div>
                              <span
                                style={{
                                  fontSize: 15,
                                  color: "black",
                                  fontWeight: "500",
                                }}
                              >
                                {e.name}
                              </span>
                              <div style={{ marginTop: 5 }}>{e.address}</div>

                              <img
                                src="https://lh3.googleusercontent.com/proxy/CFadnDP-CAUTQUBhM8o8gQKgx5k7Re-RD6xpReuKOmKjj8RGrgcJWpxlUtjdWOtnLjVyT8CdEfh-xUR-ebwiHzH65qQARzjdvQh8GHF9JuKJKNF_HtpKL8CjQhpbfF8Q3rUIvx9u8cM"
                                style={{
                                  width: 100,
                                  height: 80,
                                  marginTop: 15,
                                }}
                              />

                              <img
                                src="https://yousport.vn/Media/Blog/san-bong-ro-tp-hcm/san-bong-ro-hcm-17.jpg"
                                style={{
                                  width: 100,
                                  height: 80,
                                  marginTop: 15,
                                  marginLeft: 10,
                                }}
                              />
                              <br />
                              <a
                                style={{
                                  float: "right",
                                  color: "red",
                                  marginTop: 10,
                                }}
                                href="#"
                                onClick={this.onMapDriections(e, i)}
                              >
                                Chỉ đường
                              </a>
                            </div>
                          </InfoWindow>
                        )}
                      </Marker>
                    );
                  })}

                  <a
                    style={{
                      backgroundColor: "white",
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      position: "absolute",
                      right: 65,
                      bottom: 25,
                    }}
                    href="#"
                    onClick={this.onGetCurrentLocation}
                  >
                    <img
                      src={require("./ic_current_location.png")}
                      style={{
                        width: 30,
                        height: 30,
                        marginTop: 10,
                        marginLeft: 10,
                      }}
                    />
                  </a>
                </MapWrapper>
              </Card>
            </div>
          </Row>
          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${KEY_MAP}&libraries=places`}
          ></script>
        </Container>
      </>
    );
  }
}

Maps.layout = Admin;

export default Maps;
