import { useState } from "react";
import { ethers } from "ethers";
import useWindowDimensions from "../helpers/WindowDimensions";

import { Text, VStack, HStack, Spacer } from "@chakra-ui/react";
import AmountButton from "./AmountButton";
import MintButton from "./MintButton";

import compiledContract from "../helpers/NotMafiaCompiled.json";
import { keccak256 } from "ethers/lib/utils";

const SaleMint = ({ accounts, address }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const [mintTimedOut, setMintTimedOut] = useState(false);

  const { width, height } = useWindowDimensions();
  const isMobile = width < height;

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
        const response = await contract.publicMint(mintAmount, {
          value: ethers.utils.parseEther((mintAmount * 0.00869).toString()),
        });
        console.log(`mint successfull, response: ${response}`);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleIncrement = () => {
    if (mintAmount < 5) {
      setMintAmount(mintAmount + 1);
    }
  };

  const handleDecrement = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };

  return (
    <VStack paddingBottom="15px">
      <Text fontSize={isMobile ? 20 : 30} zIndex={10} width="300px" margin="0">
        How many do you want to mint?
      </Text>
      <HStack zIndex={10} width="60%">
        <AmountButton text="-" onClick={handleDecrement} />
        <Spacer />
        <Text fontSize={"20"}>{mintAmount}</Text>
        <Spacer />
        <AmountButton text="+" onClick={handleIncrement} />
      </HStack>
      <MintButton handleMint={handleMint} />
    </VStack>
  );
};

export default SaleMint;
