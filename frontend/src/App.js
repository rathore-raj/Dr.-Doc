import react from "react";
import Footer from "./components/footer/footer";
import FunBody from "./components/funtionality/funBody";
import Header from "./components/header/header";
import Heading from "./components/heading/heading";
import data from "./array";
import "./App.css";

class App extends react.Component {
  render() {
    const functionality = data.map((x, index) => {
      return <FunBody data={x} key={index} />;
    });
    return (
      <div className="main-body">
        <Header />
        <Heading />
        <div className="func-div">{functionality} </div>
        <Footer />
      </div>
    );
  }
}

export default App;
