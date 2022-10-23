import { useState } from "react";
import { ethers } from "ethers";
import useWindowDimensions from "../helpers/WindowDimensions";

import { Text, VStack } from "@chakra-ui/react";
import MintButton from "./MintButton";

import compiledContract from "../helpers/NotMafiaCompiled.json";
import whiteListTree from "../helpers/WhiteList";
import { keccak256 } from "ethers/lib/utils";

const SimpleMint = ({ accounts, address, type }) => {
  const [mintTimedOut, setMintTimedOut] = useState(false);

  const { width, height } = useWindowDimensions();
  const isMobile = width < height;

  const isAllowed = () => {
    if (type === "FREE") {
      return true;
    }
    const root = whiteListTree.getHexRoot();
    const leaf = keccak256(accounts[0]);
    const proof = whiteListTree.getHexProof(leaf);
    return whiteListTree.verify(proof, leaf, root);
  };

  const handleMint = async () => {
    // set mint time out to true (prevents people/bots spamming mint the button)
    setMintTimedOut(true);
    // set timeout of 10 seconds to reactivate minting
    setTimeout(() => {
      setMintTimedOut(false);
    }, 10000);

    // mint
    if (window.ethereum && !mintTimedOut) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        address,
        compiledContract.abi,
        signer
      );
      try {
        let response;
        if (type === "WHITELIST") {
          response = await contract.whiteListMint(
            whiteListTree.getHexProof(keccak256(accounts[0]))
          );
        } else {
          response = await contract.freeMint();
        }
        console.log(`mint successfull, response: ${response}`);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return isAllowed() ? (
    <VStack zIndex={10} paddingBottom="15px">
      <Text fontSize={isMobile ? 20 : 40}>
        {type === "WHITELIST" ? "Mint your whitelist." : "Mint one for free."}
      </Text>
      <MintButton handleMint={handleMint} />
    </VStack>
  ) : (
    <Text fontSize={30} zIndex={10}>
      {type === "WHITELIST"
        ? "You are not on the whitelist."
        : "You are not on the allowlist."}
    </Text>
  );
};

export default SimpleMint;
