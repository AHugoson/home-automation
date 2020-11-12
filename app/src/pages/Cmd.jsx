import React, { Component } from "react";
import Header from "../components/header";
import "../css/Cmd.css";

class CmdPage extends Component {
  state = {
    pathname: this.props.location.pathname,
  };

  sendDirectCommand = (cmd) => {
    const { websocket } = this.props;
    if (websocket) {
      try {
        cmd = `{"direct-command":"${cmd}"}`;
        websocket.send(cmd);
      } catch (error) {
        console.error(error);
      }
    }
  };

  render() {
    return (
      <div className="content">
        <code id="cmd-output">
          <p>AiS-AC CMD [Version 0.1]</p>
          <p>Commands are sent directly to Arduino</p>
          <br />
        </code>
        <code id="cmd-input">
          <span id="prompt">{">"}</span>
          <span
            id="command"
            autoCapitalize="off"
            contentEditable={true}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                var prompt = document.getElementById("prompt").innerHTML;
                var cmd = document.getElementById("command").innerHTML;
                this.sendDirectCommand(cmd + ";");
                document.getElementById("command").innerHTML = "";
                var tag = document.createElement("p");
                var text = document.createTextNode(
                  prompt.replace("&gt;", ">") + cmd
                );
                tag.appendChild(text);
                document.getElementById("cmd-output").appendChild(tag);
              }
            }}
          ></span>
        </code>
      </div>
    );
  }
}

export default CmdPage;
