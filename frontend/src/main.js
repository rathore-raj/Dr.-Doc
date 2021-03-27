import react from "react";
import App from "./App";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Manipulation from "./components/PDFmanipulation/manipulation";

class Main extends react.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <App />
          </Route>
          <Route exact path="/manpulation">
            <Manipulation />
          </Route>
          <Route path="/*">
            <App />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default Main;
