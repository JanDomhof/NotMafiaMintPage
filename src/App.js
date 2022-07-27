import { useState } from "react";
import "./App.css";
import Mint from "./Mint";
import NavBar from "./NavBar";
import { Flex } from "@chakra-ui/react";

function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    <Flex direction="column">
      <NavBar accounts={accounts} setAccounts={setAccounts}></NavBar>
      <Mint accounts={accounts} setAccounts={setAccounts}></Mint>
    </Flex>
  );
}

export default App;
