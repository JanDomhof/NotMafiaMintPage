import { useState } from "react";
import { ethers } from "ethers";
import {
  Text,
  Image,
  Flex,
  VStack,
  HStack,
  Button,
  Spacer,
} from "@chakra-ui/react";

import MintButton from "../icons/mint-normal.svg";

import useWindowDimensions from "../helpers/WindowDimensions";
import compiledContract from "../helpers/NotMafiaCompiled.json";
import allowListTree from "../helpers/AllowList";
import { keccak256 } from "ethers/lib/utils";

const SaleMint = ({ accounts, address }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const [mintTimedOut, setMintTimedOut] = useState(false);

  const { width, height } = useWindowDimensions();
  const isMobile = width < height;

  const isAllowListed = () => {
    const root = allowListTree.getHexRoot();
    const leaf = keccak256(accounts[0]);
    const proof = allowListTree.getHexProof(leaf);
    return allowListTree.verify(proof, leaf, root);
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
        const response = await contract.saleMint(
          allowListTree.getHexProof(keccak256(accounts[0])),
          mintAmount,
          {
            value: ethers.utils.parseEther((mintAmount * 0.01312).toString()),
          }
        );
        console.log(`mint successfull, response: ${response}`);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleIncrement = () => {
    if (mintAmount < 3) {
      setMintAmount(mintAmount + 1);
    }
  };

  const handleDecrement = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };

  return isAllowListed() ? (
    <VStack>
      <Text fontSize={isMobile ? 20 : 30} zIndex={10} maxW={"70%"} margin={0}>
        How many do you want to mint?
      </Text>
      <HStack zIndex={10} width="35%">
        <Button
          bg="black"
          border="none"
          textColor={"white"}
          borderRadius={"50%"}
          height={"35px"}
          width={"35px"}
          onClick={handleDecrement}
          cursor="pointer"
          fontSize={30}
        >
          -
        </Button>
        <Spacer />
        <Text fontSize={"20"}>{mintAmount}</Text>
        <Spacer />
        <Button
          colorScheme={"red"}
          border="none"
          bg="black"
          textColor={"white"}
          borderRadius={"50%"}
          height={"35px"}
          width={"35px"}
          onClick={handleIncrement}
          cursor="pointer"
          fontSize={30}
        >
          +
        </Button>
      </HStack>
      <Flex zIndex={10} position="relative" justify={"center"} align={"center"}>
        <Image
          id={"mint-button"}
          src={MintButton}
          onClick={handleMint}
          borderRadius={"30%"}
          width={"120px"}
          cursor={"pointer"}
        />
        <Text
          id={"mint-text"}
          textColor={"white"}
          fontSize={25}
          pointerEvents="none"
          position={"absolute"}
        >
          Mint
        </Text>
      </Flex>
    </VStack>
  ) : (
    <Text fontSize={30} zIndex={10}>
      You are not on the allowlist.
    </Text>
  );
};

export default SaleMint;
