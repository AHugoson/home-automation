import React, { Component } from "react";
import Clock from './clock'

class Header extends Component {
  state = {
    pathname: window.location.pathname,
  };

  render() {
    return (
      <header>
        <p>
          This is the <code>{this.state.pathname}</code> page.
        </p>
        <Clock />
      </header>
    );
  }
}

export default Header;
