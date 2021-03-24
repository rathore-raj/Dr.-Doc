import react from "react";
import Footer from "./components/footer/footer";
import FunBody from "./components/funtionality/funBody";
import Header from "./components/header/header";
import Heading from "./components/heading/heading";
import data from "./array";

const divStyle = {
  padding: "0 190px",
  display: "block",
  maxWidth: "1140px",
  position: "relative",
  marginBottom: " 40px",
};

class App extends react.Component {
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "space-between",
        }}
      >
        <Header />
        <Heading />
        <div style={divStyle}>
          {data.map((x, index) => {
            return <FunBody data={x} key={index} />;
          })}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
