import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../css/activityBar.css";
import home_icon from "../images/home.svg";
import control_icon from "../images/control.svg";
import alarm_icon from "../images/alarm.svg";
import cmd_icon from "../images/terminal.svg";
import threeD_icon from "../images/3d.svg";

class ActivityBar extends Component {
  state = {
    links: [
      { id: 1, href: "/", exact: true, title: "Home", icon: home_icon },
      { id: 2, href: "/control", exact: false, title: "Control", icon: control_icon },
      { id: 3, href: "/alarms", exact: false, title: "Alarms", icon: alarm_icon },
      { id: 4, href: "/cmd", exact: false, title: "Send commands", icon: cmd_icon },
      { id: 5, href: "/3d", exact: false, title: "3D control", icon: threeD_icon },
    ],
  };

  render() {
    return (
      <ul className="Activity-bar">
        {this.state.links.map((link) => (
          <li key={link.id}>
            <NavLink exact={link.exact} to={link.href} activeClassName="Active-url">
              <img
                title={link.title}
                className="Bar-icon"
                src={link.icon}
                alt={link.href}
              />
            </NavLink>
          </li>
        ))}
      </ul>
    );
  }
}

export default ActivityBar;
