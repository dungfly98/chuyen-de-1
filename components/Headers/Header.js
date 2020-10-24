import React from "react";
// reactstrap components
import { Container } from "reactstrap";
import commons from "../../config/commons";
import Router from "next/router";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

class Header extends React.Component {
  onLogout = () => {
    const isAuth = !!commons.user?.name;
    if (!isAuth) {
      Router.push("/auth/login");
      return;
    }

    confirmAlert({
      title: "Confirm logout",
      message: "Are you sure you want to log out?",
      buttons: [
        {
          label: "Logout",
          onClick: () => {
            commons.user = undefined;
            Router.push("/auth/login");
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  render() {
    const isAuth = !!commons.user?.name;
    return (
      <>
        <div className="header bg-gradient-dark pb-8 pt-5 pt-md-6">
          <Container fluid></Container>
        </div>
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 45,
            color: "white",
            fontWeight: "700",
            zIndex: 100,
          }}
        >
          <span
            style={{
              color: "white",
              fontWeight: "700",
            }}
          >
            {commons.user?.name}
            {commons.user?.email && ` - ${commons.user?.email}`}
          </span>

          <a
            style={{
              color: isAuth ? "red" : "white",
              fontWeight: "700",
              marginLeft: 20,
              width: 100,
            }}
            href="#"
            onClick={this.onLogout}
          >
            {isAuth ? "Logout" : "Login"}
          </a>
        </div>
      </>
    );
  }
}

export default Header;
