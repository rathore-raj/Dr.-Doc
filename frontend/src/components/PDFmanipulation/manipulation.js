import react from "react";
import array from "../../array";
import { withRouter } from "react-router-dom";
import { DropzoneArea } from "material-ui-dropzone";
import "./manipulation.css";
import axios from "axios";

class Manipulation extends react.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props, state) {
    const index = props.location.state.index;
    const data = array[index];
    return {
      ...data,
    };
  }

  onFileUpload = (event) => {
    if (event.length) {
      console.log("event", event[0]);

      const formData = new FormData();
      formData.append("avatar", event[0], event[0].name);
      console.log("formData", formData);

      axios
        .post(this.state.url, formData)
        .then((response) => {
          console.log("response:", response);
        })
        .catch((error) => {
          console.log("error:", error);
        });
    }
  };

  render() {
    console.log("data in state", this.state);
    return (
      <div className="main-div">
        <h2>{this.state.Title}</h2>
        <p>{this.state.Details}</p>
        <DropzoneArea
          onChange={this.onFileUpload}
          filesLimit={Number(this.state.requiredFile)}
          showFileNames={true}
          showPreviewsInDropzone={true}
          clearOnUnmount={true}
        />
      </div>
    );
  }
}

export default withRouter(Manipulation);
