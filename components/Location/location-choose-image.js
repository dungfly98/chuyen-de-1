import React, { PureComponent } from "react";
import { Col, Row } from "reactstrap";
import ImageSys from "../../assets/images";

function getDataUrlImage(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default class LocationChooseImages extends PureComponent {
  state = {
    images: [],
  }; 

  componentDidMount() {}

  onChange = (e) => {
    e.preventDefault();
    let images = [];
    const lengthImages = e.target.files.length;
    Array.from(e.target.files).forEach(async (file) => {
      const imagePreviewUrl = await getDataUrlImage(file);
      images.push({
        file,
        imagePreviewUrl,
      });

      if (images.length === lengthImages) {
        this.setState({
          images: [...this.state.images, ...images],
        });
      }
    });
  };

  onRemove = (index) => () => {
    const images = [...this.state.images];
    images.splice(index, 1);
    this.setState({ images });
  };

  render() {
    const { images } = this.state;
    return (
      <>
        <label className="form-control-label">Images</label>
        <br />
        <input type="file" accept="image/*" multiple onChange={this.onChange} />
        <br />
        <br />

        <Row>
          {images.map((e, i) => {
            return (
              <Col lg="3" style={{ marginBottom: 20 }}>
                <img
                  key={i}
                  src={e.imagePreviewUrl}
                  width="100%"
                  style={{ borderRadius: 10 }}
                />

                <a onClick={this.onRemove(i)} href="#">
                  <img
                    src={ImageSys.ic_remove}
                    style={{ position: "absolute", top: 5, right: 20 }}
                    width={25}
                    alt="follow picture"
                  />
                </a>
              </Col>
            );
          })}
        </Row>
      </>
    );
  }
}
