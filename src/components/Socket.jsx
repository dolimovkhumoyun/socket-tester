import React, { Component } from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

import io from "socket.io-client";

class Socket extends Component {
  state = {
    bu: "192.168.0.13:8080/api",
    event: "",
    msg: [],
    connection: false
  };

  componentDidMount() {
    this.checkConnection();
  }

  checkConnection = () => {
    var that = this;

    const socket = io(this.state.bu);
    this.setState({ connection: false });

    socket.on("connect", function(data) {
      that.setState({ connection: true });
    });
    socket.on("disconnect", function(data) {
      that.setState({ connection: false });
    });
    socket.on("error", function(data) {
      console.log("Error:  ", data);
    });
  };

  handleInputChange = e => {
    if (e.target.name === "bu") this.setState({ connection: false });
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const { bu, event, msg } = this.state;

    const socket = io(bu);

    socket.emit(event, msg);
    socket.on(event, function(data) {
      console.log(data);
    });
  };

  handleJsonChange = e => {
    this.setState({ msg: e.json });
  };

  render() {
    const { bu, event, msg, connection } = this.state;
    const isConnected = "form-control";

    return (
      <React.Fragment>
        <div className="container-fluid col-md-3 mt-4">
          <h1>Socket Testing</h1>
          <form onSubmit={this.onSubmit}>
            <div className="form-group ">
              <label htmlFor="bu">Base Url:</label>
              <div className="row">
                <div className="col-md-9">
                  <input
                    type="text"
                    name="bu"
                    id="bu"
                    className={
                      connection ? isConnected + " is-valid" : isConnected
                    }
                    onChange={this.handleInputChange}
                    value={bu}
                    required
                  />
                </div>
                <div className="col-md-2 ml-4">
                  <button
                    className="btn btn-success"
                    onClick={this.checkConnection}
                  >
                    Check
                  </button>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="event">Event:</label>
              <input
                type="text"
                name="event"
                id="event"
                className="form-control"
                onChange={this.handleInputChange}
                value={event}
                required
              />
            </div>
            <div
              className="form-group json-editor"
              style={{ border: "1px solid red" }}
            >
              <JSONInput
                id="a_unique_id"
                // placeholder="{}"
                theme="light_mitsuketa_tribute"
                locale={locale}
                width="100%"
                height="200px"
                style={{ border: "1px solid red" }}
                name="msg1"
                onChange={this.handleJsonChange}
              />
            </div>
            <button type="submit" className="btn btn-primary float-right">
              Submit
            </button>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Socket;
