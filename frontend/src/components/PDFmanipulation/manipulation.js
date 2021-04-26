import react from "react";
import array from "../../array";
import { withRouter } from "react-router-dom";
import { DropzoneArea } from "material-ui-dropzone";
import "./manipulation.css";
import axios from "axios";
import FileSaver from "file-saver";
import CircularIndeterminate from "../progressBar/progressBar";

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

class Manipulation extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      progressBar: false,
      message: null,
      link: "",
      password: "",
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.location.state) {
      const index = props.location.state.index;
      const data = array[index];
      return {
        ...data,
      };
    } else {
      props.history.push("/");
    }
  }

  onRequest = (url, formData) => {
    let options = {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      cancelToken: source.token,
    };
    return axios.post(url, formData, options);
  };

  onFileUpload = (event) => {
    if (event.length) {
      console.log("event", event[0]);
      this.setState({
        progressBar: true,
      });
      if (this.state.url === "http://localhost:3050/convert") {
        const formData = new FormData();
        formData.append("avatar", event[0], event[0].name);

        axios
          .post(this.state.url, formData, { cancelToken: source.token })
          .then((response) => {
            console.log("response:", response);

            const link = response.data.File_Download_Link;
            this.setState({
              message: "Click Here To Download PDF",
              link: link,
              progressBar: false,
            });
          })
          .catch((error) => {
            console.log("error:", error);
            this.setState({
              message: error.message,
              progressBar: false,
            });
          });
      } else if (this.state.url === "http://localhost:3050/merge") {
        if (event.length > 1) {
          const formData = new FormData();
          formData.append("avatar", event[0], event[0].name);
          formData.append("avatar", event[1], event[1].name);

          this.onRequest(this.state.url, formData)
            .then((response) => {
              console.log("response:", response);
              FileSaver.saveAs(
                new Blob([response.data], { type: "application/pdf" }),
                `merged-${event[0].name}`
              );
              // const message = response.data.Message;
              this.setState({
                message: "Check Download Folder",
                progressBar: false,
              });
            })
            .catch((error) => {
              console.log("error:", error);
              this.setState({
                message: error.message,
                progressBar: false,
              });
            });
        } else {
          this.setState({
            message: "Upload more Than 1 File",
            progressBar: false,
          });
        }
      } else if (this.state.url === "http://localhost:3050/upload") {
        const formData = new FormData();
        formData.append("photo", event[0], event[0].name);
        axios
          .post(this.state.url, formData, { cancelToken: source.token })
          .then((response) => {
            console.log("response:", response);
            const message = response.data.text;
            this.setState({
              message: message,
              progressBar: false,
            });
          })
          .catch((error) => {
            console.log("error:", error.response);
            this.setState({
              message: error.message,
              progressBar: false,
            });
          });
      } else if (
        this.state.url === "http://localhost:3050/encrypt" ||
        this.state.url === "http://localhost:3050/decrypt"
      ) {
        if (this.state.password !== "") {
          const formData = new FormData();
          formData.append("avatar", event[0], event[0].name);
          formData.append("password", this.state.password);
          this.onRequest(this.state.url, formData)
            .then((response) => {
              console.log("response:", response);
              FileSaver.saveAs(
                new Blob([response.data], { type: "application/pdf" }),
                event[0].name
              );
              // const message = response.data.Message;
              this.setState({
                message: "Check Download Folder",
                progressBar: false,
              });
            })
            .catch((error) => {
              console.log("error:", error);
              this.setState({
                message: error.message,
                progressBar: false,
              });
            });
        }
      } else {
        const formData = new FormData();
        formData.append("avatar", event[0], event[0].name);

        this.onRequest(this.state.url, formData)
          .then((response) => {
            console.log("response:", response);

            FileSaver.saveAs(
              new Blob([response.data], { type: "application/pdf" }),
              event[0].name
            );

            this.setState({
              message: "Check Download Folder",
              progressBar: false,
            });
          })
          .catch((error) => {
            console.log("error1:", error.response);
            this.setState({
              message: error.message,
              progressBar: false,
            });
          });
      }
    }
  };

  onPasswordChange = (event) => {
    const value = event.target.value;
    this.setState({
      password: value,
    });
  };

  handleClose = () => {
    if (this.state.progressBar) {
      source.cancel();
      window.location.reload();
    }

    this.setState({
      message: null,
      link: "",
      password: "",
      progressBar: false,
    });
  };

  render() {
    console.log("data in state", this.state);
    return (
      <div className="main-div">
        <div className="home-btn">
          <a href="/">Back To Home</a>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {this.state.Icon}
          <h1 style={{ margin: "0", marginLeft: "5px" }}>{this.state.Title}</h1>
        </div>
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
          acceptedFiles={this.state.fileType}
        />
        <br></br>
        <p>{this.state.message}</p>
        {this.state.link ? (
          <a href={this.state.link}>{this.state.link}</a>
        ) : null}
        {this.state.progressBar ? <CircularIndeterminate /> : false}
      </div>
    );
  }
}

export default withRouter(Manipulation);
