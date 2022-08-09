import { useState } from "react";
import { ethers } from "ethers";
import { Text, Image, Flex } from "@chakra-ui/react";
import { keccak256 } from "ethers/lib/utils";
import compiledContract from "../helpers/NotMafiaCompiled.json";
import whiteListTree from "../helpers/WhiteList";
import MintButton from "../icons/mint-normal.svg";

const WhiteListMint = ({ accounts, address }) => {
  const [buttonStyle, setButtonStyle] = useState({});
  const [mintTimedOut, setMintTimedOut] = useState(false);

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

  return (
    <Flex justify={"center"} align={"center"} direction="column">
      <Text fontSize={40} zIndex={10} top={15}>
        Mint your whitelist.
      </Text>

      {isWhiteListed() ? (
        <Flex
          justify={"center"}
          align={"center"}
          bottom={"15%"}
          style={buttonStyle}
        >
          <Image
            id={"mint-button"}
            src={MintButton}
            onClick={handleMint}
            zIndex={10}
            position={"absolute"}
            borderRadius={"30%"}
            width={"150px"}
            cursor={"pointer"}
          />
          <Text
            id={"mint-text"}
            textColor={"white"}
            fontSize={30}
            zIndex={11}
            textAlign={"center"}
            pointerEvents="none"
          >
            Mint
          </Text>
        </Flex>
      ) : (
        <Text
          fontSize={30}
          zIndex={11}
          position={"absolute"}
          maxWidth={400}
          textAlign={"center"}
        >
          You are not on the whitelist. Free mint starts soon!
        </Text>
      )}
    </Flex>
  );
};

export default WhiteListMint;
