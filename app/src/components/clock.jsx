import React, { Component } from "react";

class Clock extends Component {
  state = {
    time: new Date(),
  };

  componentDidMount() {
    this.tickInterval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.tickInterval);
  }

  tick = () => {
    this.setState({ time: new Date() });
  };

  render() {
    return <code>{this.state.time.toLocaleTimeString()}</code>;
  }
}

export default Clock;
