import react from "react";
import "./header.css";

class Header extends react.Component {
  render() {
    return (
      <header className="header">
        <div>
          <h1>Dr.Doc</h1>
        </div>
        <div>
          <a href="javascript;">Login</a>
        </div>
      </header>
    );
  }
}

export default Header;
