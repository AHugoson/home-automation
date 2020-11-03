import React, { Component } from "react";
import Header from "../components/header";
import "../css/Cmd.css";

class CmdPage extends Component {
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

export default CmdPage;
