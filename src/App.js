import "./App.css";
import Home from "./page/Home";
import styled from "styled-components";

const BodyStyle = styled.div`
  padding: 2vw;
  margin: 0;
`;
function App() {
  return (
    <BodyStyle>
      <Home />
    </BodyStyle>
  );
}

export default App;
