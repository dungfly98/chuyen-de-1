// layout for this page
import Auth from "layouts/Auth.js";
import Link from "next/link";
import Router from "next/router";
import React from "react";
// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import commons from "../../config/commons";
import { URL_PATH } from "../../config/url-path";
import ApiHelper from "../../networking/api-helper";

class Login extends React.Component {
  state = {
    email: "",
    password: "",
    message: "",
  };

  onSignIn = async () => {
    const { email, password } = this.state;
    if (!email || !password) {
      this.setState(
        { message: "Vui lòng nhập đầy đủ thông tin" },
        this.onClearAler
      );
      return;
    }
    try {
      const res = await ApiHelper.post(URL_PATH.LOGIN, { ...this.state });
      if (res.code === 200) {
        commons.user = res.data || undefined;
        Router.push("/admin/maps");
        return;
      }
      this.setState({ message: res.message }, this.onClearAler);
    } catch (error) {
      console.log("error: ", error);
    }
  };


  onClearAler = () => {
    setTimeout(() => {
      this.setState({ message: "" });
    }, 2000);
  };

  render() {
    const { email, password, message } = this.state;
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form">
                <h3>Login</h3>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
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
                <div className="text-center">
                  <Button
                    className="my-4"
                    color="primary"
                    type="button"
                    onClick={this.onSignIn}
                  >
                    Sign in
                  </Button>
                </div>

                {message ? <Alert color="warning">{message}</Alert> : null}
              </Form>
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6" />
            <Col className="text-right" xs="6">
              <Link href="/auth/register">
                <a className="text-light">
                  <small>Create new account</small>
                </a>
              </Link>
            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

Login.layout = Auth;

export default Login;
