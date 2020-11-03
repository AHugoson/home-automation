import React, { Component } from "react";
import Header from "../components/header";
import "../css/Alarms.css";

class AlarmPage extends Component {
  state = {
    pathname: this.props.location.pathname,
  };
  render() {
    return (
      <div className="content">
        <Header />
      </div>
    );
  }
}

export default AlarmPage;
