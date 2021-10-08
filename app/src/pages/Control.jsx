import React, { Component } from "react";
import "../css/Control.css";

class ControlPage extends Component {
  state = {};

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
        <h1
          style={{
            color:
              !this.props.websocket || this.props.websocket.readyState > 1
                ? "salmon"
                : "cornflowerblue",
          }}
        >
          Direct control
        </h1>
        <table>
          <tbody>
            <tr>
              <th colSpan="2">433 MHz</th>
            </tr>
            <tr>
              <td>
                <button onClick={() => this.sendDirectCommand("on 1;")}>
                  ON 1
                </button>
              </td>
              <td>
                <button onClick={() => this.sendDirectCommand("off 1;")}>
                  OFF 1
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button onClick={() => this.sendDirectCommand("on 2;")}>
                  ON 2
                </button>
              </td>
              <td>
                <button onClick={() => this.sendDirectCommand("off 2;")}>
                  OFF 2
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button onClick={() => this.sendDirectCommand("on 3;")}>
                  ON 3
                </button>
              </td>
              <td>
                <button onClick={() => this.sendDirectCommand("off 3;")}>
                  OFF 3
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  onClick={() => this.sendDirectCommand("sendIR:FFE01F:32;")}
                >
                  ON PC
                </button>
              </td>
              <td>
                <button
                  onClick={() => this.sendDirectCommand("sendIR:FF609F:32;")}
                >
                  OFF PC
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <table>
          <tbody>
            <tr>
              <th colSpan="3">IR Z-906</th>
            </tr>
            <tr>
              <td>
                <button
                  onClick={() => this.sendDirectCommand("sendIR:400501FE:32;")}
                >
                  Power
                </button>
              </td>
              <td>
                <button
                  onClick={() => this.sendDirectCommand("sendIR:400510EF:32;")}
                >
                  Input
                </button>
              </td>
              <td>
                <button
                  onClick={() => this.sendDirectCommand("sendIR:400557A8:32;")}
                >
                  Mute
                </button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <button
                  onClick={() => this.sendDirectCommand("sendIR:400550AF:32;")}
                >
                  Level
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  onClick={() => this.sendDirectCommand("sendIR:400556A9:32;")}
                >
                  Vol -
                </button>
              </td>
              <td></td>
              <td>
                <button
                  onClick={() => this.sendDirectCommand("sendIR:400555AA:32;")}
                >
                  Vol +
                </button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <button
                  onClick={() => this.sendDirectCommand("sendIR:4005708F:32;")}
                >
                  Effect
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default ControlPage;
