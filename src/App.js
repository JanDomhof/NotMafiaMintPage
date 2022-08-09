import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import notMafia from "./components/helpers/NotMafiaCompiled.json";
import NavBar from "./components/NavBar";
import Mint from "./components/Mint";
import FootBar from "./components/FootBar";
import { Flex, Text, VStack } from "@chakra-ui/react";
import useWindowDimensions from "./components/helpers/WindowDimensions";

const address = "0xBAB9b565218d8B7517eFE2Cc35dB41EFfFbe0b9E";
const html = document.getElementById("html");

function App() {
  // const [accounts, setAccounts] = useState([]);
  // const [status, setStatus] = useState(0);
  // const [tokenId, setTokenId] = useState(0);
  // const { width, height } = useWindowDimensions();

  // if (width > 640) {
  //   if (!html.classList.contains("computer")) {
  //     html.classList.add("computer");
  //     html.classList.remove("mobile");
  //   }
  // } else {
  //   if (!html.classList.contains("mobile")) {
  //     html.classList.add("mobile");
  //     html.classList.remove("computer");
  //   }
  // }

  // useEffect(() => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const contract = new ethers.Contract(address, notMafia.abi, provider);
  //   contract.on("ChangedStatus", (newStatus) => {
  //     setStatus(newStatus);
  //   });
  //   contract.on("Transfer", (_from, _to, amount) => {
  //     setTokenId(tokenId + amount);
  //   });
  //   async function fetchFromContract() {
  //     const currentStatus = await contract.status();
  //     setStatus(currentStatus);

  //     const currentTokenId = await contract.getCurrentTokenId();
  //     setTokenId(currentTokenId);
  //   }
  //   fetchFromContract();
  // }, []);

  return (
    <Text>THIS IS WITHIN APP.JS</Text>
    // <Flex height={"100%"} direction="column" justify={"space-between"}>
    //   <NavBar accounts={accounts} setAccounts={setAccounts} />
    //   <Mint accounts={accounts} address={address} status={status} />
    //   <FootBar address={address} tokenId={tokenId} />
    // </Flex>
  );
}

export default App;
