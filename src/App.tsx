import "./App.css";
import Redux from "./redux-version";
import Rtq from "./rtq-version";

const App = () => {
  return (
    <div className="container">
      <Rtq />
      <Redux />
    </div>
  );
};

export default App;
