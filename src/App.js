import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import notMafia from "./components/helpers/NotMafiaCompiled.json";
import NavBar from "./components/NavBar";
import Mint from "./components/Mint";
import FootBar from "./components/FootBar";
import { Flex } from "@chakra-ui/react";
import useWindowDimensions from "./components/helpers/WindowDimensions";

const address = "0x7Ff195Ea150209257E209a1EeE0f822bd3F153d3";
const html = document.getElementById("html");

function App() {
  const [accounts, setAccounts] = useState([]);
  const [status, setStatus] = useState(0);
  const [tokenId, setTokenId] = useState(0);

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  if (!isMobile) {
    if (!html.classList.contains("computer")) {
      html.classList.add("computer");
      html.classList.remove("mobile");
    }
  } else {
    if (!html.classList.contains("mobile")) {
      html.classList.add("mobile");
      html.classList.remove("computer");
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(address, notMafia.abi, provider);
      contract.on("ChangedStatus", (newStatus) => {
        setStatus(newStatus);
      });
      contract.on("Transfer", (_from, _to, amount) => {
        setTokenId(tokenId + amount);
      });
      async function fetchFromContract() {
        const currentStatus = await contract.status();
        setStatus(currentStatus);

        const currentTokenId = await contract.getCurrentTokenId();
        setTokenId(currentTokenId);
      }
      fetchFromContract();
    }
  }, []);

  return (
    <Flex
      height="100%"
      direction="column"
      justify="space-between"
      padding="0 5% 0 5%"
    >
      <NavBar
        accounts={accounts}
        setAccounts={setAccounts}
        isMobile={isMobile}
      />
      <Mint
        accounts={accounts}
        address={address}
        status={status}
        isMobile={isMobile}
      />
      <FootBar address={address} tokenId={tokenId} isMobile={isMobile} />
    </Flex>
  );
}

export default App;
