import { useState } from "react";
import { ethers } from "ethers";
import { Text, Image, Flex, VStack } from "@chakra-ui/react";
import { keccak256 } from "ethers/lib/utils";
import compiledContract from "../helpers/NotMafiaCompiled.json";
import whiteListTree from "../helpers/WhiteList";
import MintButton from "../icons/mint-normal.svg";
import useWindowDimensions from "../helpers/WindowDimensions";

const WhiteListMint = ({ accounts, address }) => {
  const [buttonStyle, setButtonStyle] = useState({});
  const [mintTimedOut, setMintTimedOut] = useState(false);
  const { width, height } = useWindowDimensions();
  const isMobile = width < height;

  const isWhiteListed = () => {
    const root = whiteListTree.getHexRoot();
    const leaf = keccak256(accounts[0]);
    const proof = whiteListTree.getHexProof(leaf);
    return whiteListTree.verify(proof, leaf, root);
  };

  const handleMint = async () => {
    const mintOk = !mintTimedOut;

    // set mint time out to true (prevents people/bots spamming mint the button)
    setMintTimedOut(true);

    // set mint buttons to indicate mint is ongoing
    setButtonStyle({
      pointerEvents: "none",
      opacity: "50%",
    });

    // set timeout of 10 seconds to reactivate minting
    setTimeout(() => {
      setButtonStyle({});
      setMintTimedOut(false);
    }, 10000);

    // mint
    if (window.ethereum && mintOk) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        address,
        compiledContract.abi,
        signer
      );
      try {
        const response = await contract.whiteListMint(
          whiteListTree.getHexProof(keccak256(accounts[0]))
        );
        console.log(`mint successfull, response: ${response}`);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return isWhiteListed() ? (
    <VStack>
      <Text fontSize={isMobile ? 20 : 40} zIndex={10}>
        Mint your whitelist.
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
      You are not on the whitelist.
    </Text>
  );
};

export default WhiteListMint;
