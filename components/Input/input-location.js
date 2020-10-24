import React from "react";
import { Col, FormGroup, Input } from "reactstrap";

export default class InputLocationComponent extends React.PureComponent {
  render() {
    const { title, id } = this.props;
    return (
      <Col lg="6">
        <FormGroup>
          <label className="form-control-label" htmlFor={id}>
            {title}
          </label>
          <Input
            className="form-control-alternative"
            // defaultValue="lucky.jesse"
            // placeholder="Username"
            // type="text"
            {...this.props}
          />
        </FormGroup>
      </Col>
    );
  }
}
