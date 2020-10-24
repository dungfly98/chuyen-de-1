import React from "react";
import Link from "next/link";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Alert,
} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js";
import Router from "next/router";
import { URL_PATH } from "../../config/url-path";
import ApiHelper from "../../networking/api-helper";

class Register extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    message: "",
  };

  onClearAler = () => {
    setTimeout(() => {
      this.setState({ message: "" });
    }, 2000);
  };

  onCreate = async () => {
    const { name, email, password, message } = this.state;

    if (!name || !email || !password) {
      this.setState(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        this.onClearAler
      );
      return;
    }

    try {
      const res = await ApiHelper.post(URL_PATH.REGISTER, { ...this.state });
      if (res.code === 200) {
        this.setState({
          name: "",
          email: "",
          password: "",
        });
        confirmAlert({
          title: "Thông báo",
          message:
            "Bạn đã tạo tài khoản thành công, bạn có muốn đăng nhập luôn không?",
          buttons: [
            {
              label: "Có",
              onClick: () => Router.push("/auth/login"),
            },
            {
              label: "Không",
            },
          ],
        });

        return;
      }
      this.setState({ message: res.message }, this.onClearAler);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  render() {
    const { name, email, password, message } = this.state;

    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              {/* <div className="text-center text-muted mb-4">
                <small>Or sign up with credentials</small>
              </div> */}

              <h3>Register</h3>

              <Form role="form">
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        this.setState({ name: e.target.value });
                      }}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
                      value={email}
                      onChange={(e) => {
                        this.setState({ email: e.target.value });
                      }}
                    />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        this.setState({ password: e.target.value });
                      }}
                    />
                  </InputGroup>
                </FormGroup>
                {/* <div className="text-muted font-italic">
                  <small>
                    password strength:{" "}
                    <span className="text-success font-weight-700">strong</span>
                  </small>
                </div> */}
                {/* <Row className="my-4">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id="customCheckRegister"
                        type="checkbox"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="customCheckRegister"
                      >
                        <span className="text-muted">
                          I agree with the{" "}
                          <a href="#pablo" onClick={(e) => e.preventDefault()}>
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>
                  </Col>
                </Row> */}
                <div className="text-center">
                  <Button
                    className="mt-4"
                    color="primary"
                    type="button"
                    onClick={this.onCreate}
                  >
                    Create account
                  </Button>
                </div>
                {message ? <Alert color="warning">{message}</Alert> : null}
              </Form>
            </CardBody>
          </Card>

          <Row className="mt-3">
            <Col xs="6" />

            <Col className="text-right" xs="6">
              <Link href="/auth/login">
                <a className="text-light">
                  <small>Login</small>
                </a>
              </Link>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

Register.layout = Auth;

export default Register;
