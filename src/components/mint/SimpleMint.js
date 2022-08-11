import { useState } from "react";
import { ethers } from "ethers";
import { Text, Image, Flex, VStack } from "@chakra-ui/react";

import MintButton from "../icons/mint-normal.svg";

import useWindowDimensions from "../helpers/WindowDimensions";
import compiledContract from "../helpers/NotMafiaCompiled.json";
import whiteListTree from "../helpers/WhiteList";
import allowListTree from "../helpers/AllowList";
import { keccak256 } from "ethers/lib/utils";

const SimpleMint = ({ accounts, address, type }) => {
  const [mintTimedOut, setMintTimedOut] = useState(false);

  const { width, height } = useWindowDimensions();
  const isMobile = width < height;

  const isWhiteListed = () => {
    let tree;
    if (type == "WHITELIST") {
      tree = whiteListTree;
    } else {
      tree = allowListTree;
    }
    const root = tree.getHexRoot();
    const leaf = keccak256(accounts[0]);
    const proof = tree.getHexProof(leaf);
    return tree.verify(proof, leaf, root);
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
        if (type == "WHITELIST") {
          response = await contract.whiteListMint(
            whiteListTree.getHexProof(keccak256(accounts[0]))
          );
        } else {
          response = await contract.freeMint(
            whiteListTree.getHexProof(keccak256(accounts[0]))
          );
        }
        console.log(`mint successfull, response: ${response}`);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return isWhiteListed() ? (
    <VStack>
      <Text fontSize={isMobile ? 20 : 40} zIndex={10}>
        {type == "WHITELIST" ? "Mint your whitelist." : "Mint one for free."}
      </Text>
      <Flex zIndex={10} position="relative" justify={"center"} align={"center"}>
        <Image
          id={"mint-button"}
          src={MintButton}
          onClick={handleMint}
          borderRadius={"30%"}
          width={"150px"}
          cursor={"pointer"}
        />
        <Text
          id={"mint-text"}
          textColor={"white"}
          fontSize={30}
          pointerEvents="none"
          position={"absolute"}
        >
          Mint
        </Text>
      </Flex>
    </VStack>
  ) : (
    <Text fontSize={30} zIndex={10}>
      {type == "WHITELIST"
        ? "You are not on the whitelist."
        : "You are not on the allowlist."}
    </Text>
  );
};

export default SimpleMint;
