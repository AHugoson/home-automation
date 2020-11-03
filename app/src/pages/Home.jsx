import React, { Component } from "react";
import logo from "../images/react_logo.svg";
import "../css/Home.css";
import Clock from "../components/clock";

class HomePage extends Component {
  state = {};
  render() {
    return (
      <div className="content">
        <img className="home-logo" src={logo} alt="logo" />
        <Clock />
      </div>
    );
  }
}

export default HomePage;
