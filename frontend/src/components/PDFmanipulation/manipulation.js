import react from "react";
import array from "../../array";
import { withRouter } from "react-router-dom";
import { DropzoneArea } from "material-ui-dropzone";
import "./manipulation.css";
import axios from "axios";

class Manipulation extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      link: "",
      password: "",
    };
  }

  static getDerivedStateFromProps(props, state) {
    const index = props.location.state.index;
    const data = array[index];
    return {
      ...data,
    };
  }

  onRequest = (url, formData) => {
    // const config = {
    //   responseType: "arraybuffer",
    // };
    return axios.post(url, formData);
  };

  onFileUpload = (event) => {
    if (event.length) {
      console.log("event", event[0]);
      if (this.state.url === "http://localhost:3000/convert") {
        const formData = new FormData();
        formData.append("avatar", event[0], event[0].name);

        this.onRequest(this.state.url, formData)
          .then((response) => {
            console.log("response:", response);
            const link = response.data.File_Download_Link;
            this.setState({
              message: "Click Here To Download PDF",
              link: link,
            });
          })
          .catch((error) => {
            console.log("error:", error);
          });
      } else if (this.state.url === "http://localhost:3000/merge") {
        const formData = new FormData();
        formData.append("avatar", event[0], event[0].name);
        formData.append("avatar", event[1], event[1].name);

        this.onRequest(this.state.url, formData)
          .then((response) => {
            console.log("response:", response);
            const message = response.data.Message;
            this.setState({
              message: `${message} Check Public Folder for File`,
            });
          })
          .catch((error) => {
            console.log("error:", error);
          });
      } else if (this.state.url === "http://localhost:3000/upload") {
        const formData = new FormData();
        formData.append("photo", event[0], event[0].name);
        this.onRequest(this.state.url, formData)
          .then((response) => {
            console.log("response:", response);
            const message = response.data.text;
            this.setState({
              message: message,
            });
          })
          .catch((error) => {
            console.log("error:", error);
          });
      } else if (
        this.state.url === "http://localhost:3000/encrypt" ||
        this.state.url === "http://localhost:3000/decrypt"
      ) {
        if (this.state.password !== "") {
          const formData = new FormData();
          formData.append("avatar", event[0], event[0].name);
          formData.append("password", this.state.password);
          this.onRequest(this.state.url, formData)
            .then((response) => {
              console.log("response:", response);
              const message = response.data.Message;
              this.setState({
                message: `${message} Check Public Folder for File`,
              });
            })
            .catch((error) => {
              console.log("error:", error);
            });
        }
      } else {
        const formData = new FormData();
        formData.append("avatar", event[0], event[0].name);

        this.onRequest(this.state.url, formData)
          .then((response) => {
            console.log("response:", response);
            console.log("data:", response.data);
            const message = response.data.Message;
            this.setState({
              message: `${message} Check Public Folder for File`,
            });
          })
          .catch((error) => {
            console.log("error:", error);
          });
      }

      // axios
      //   .post(this.state.url, formData)
      //   .then((response) => {
      //     console.log("response:", response);
      //     const message = response.data.Message;
      //     this.setState({
      //       message: `${message} Check Public Folder for File`,
      //     });
      //   })
      //   .catch((error) => {
      //     console.log("error:", error);
      //   });
    }
  };

  onPasswordChange = (event) => {
    const value = event.target.value;
    this.setState({
      password: value,
    });
  };
  handleClose = () => {
    this.setState({
      message: null,
      link: "",
      password: "",
    });
  };

  render() {
    console.log("data in state", this.state);
    return (
      <div className="main-div">
        <h2>{this.state.Title}</h2>
        <p>{this.state.Details}</p>

        {this.state.temp ? (
          <div>
            <h4>Please Enter Password First And Then Upload File</h4>
            <label>New Password For PDF:</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={this.state.password}
              onChange={this.onPasswordChange}
              required
            />
            <br></br>
          </div>
        ) : null}

        <DropzoneArea
          onChange={this.onFileUpload}
          filesLimit={Number(this.state.requiredFile)}
          showFileNames={true}
          showPreviewsInDropzone={true}
          clearOnUnmount={true}
          onDelete={this.handleClose}
        />
        <br></br>
        <p>{this.state.message}</p>
        {this.state.link ? (
          <a href={this.state.link}>{this.state.link}</a>
        ) : null}
      </div>
    );
  }
}

export default withRouter(Manipulation);
