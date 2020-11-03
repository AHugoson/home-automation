import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import HomePage from "./pages/Home";
import ControlPage from "./pages/Control";
import AlarmPage from "./pages/Alarms";
import CmdPage from "./pages/Cmd";
import ThreeDPage from "./pages/ThreeD";

class ContentManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ws: null,
    };
  }

  componentDidMount() {
    this.connect();
  }

  timeout = 500;

  // This function connects to the server and ensures constant reconnection if connection closes
  connect = () => {
    var ws = new WebSocket("ws://192.168.1.100:8080");
    var connectInterval;

    ws.onopen = () => {
      console.log(`WebSocket connection established: ${ws.url}`);

      this.setState({ ws: ws });

      clearTimeout(connectInterval);
    };

    ws.onclose = (e) => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${this.timeout} ms`,
        e.reason
      );

      this.setState({ ws: null });
      connectInterval = setTimeout(this.check, this.timeout);
    };

    ws.onerror = (err) => {
      console.log("Socket encountered error: ", err, "Closing socket");
      ws.close();
    };
  };

  check = () => {
    const { ws } = this.state;
    // Check if websocket instance is closed, if so call `connect` function
    if (!ws || ws.readyState === WebSocket.CLOSED) this.connect();
  };

  sendDirectCommand(cmd) {
    cmd = '{"direct-command":"' + cmd + '"}';
    this.ws.send(cmd);
    console.log("[SENT] Sent to server: " + cmd);
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route
          path="/control"
          render={(props) => (
            <ControlPage {...props} websocket={this.state.ws} />
          )}
        />
        <Route path="/alarms" component={AlarmPage} />
        <Route path="/cmd" component={CmdPage} />
        <Route path="/3d" component={ThreeDPage} />
        <Route render={() => <Redirect to={{ pathname: "/" }} />} />
      </Switch>
    );
  }
}

export default ContentManager;
