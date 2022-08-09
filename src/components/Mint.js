import { useState } from "react";
import { ethers } from "ethers";
import { Flex, Button, Text, Box, Image } from "@chakra-ui/react";
import { keccak256 } from "ethers/lib/utils";
import notMafia from "./helpers/NotMafiaCompiled.json";
import MintField from "./icons/mint-field.svg";
import MintingClosed from "./mint/MintingClosed";
import WhiteListMint from "./mint/WhiteListMint";
import allowListTree from "./helpers/AllowList";

const Mint = ({ accounts, address, status }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const [disableButtons, setDisableButtons] = useState(false);

  const isConnected = Boolean(accounts[0]);

  // const handleMint = async () => {
  //   setDisableButtons(true);
  //   setMinting(true);
  //   if (window.ethereum) {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(address, notMafia.abi, signer);
  //     try {
  //       const response = await mint(contract);
  //       console.log(`mint successfull, response: ${response}`);
  //     } catch (e) {
  //       if (e.code !== 4001) {
  //         let errorMsg = "Transaction reverted.";
  //         if (status === 1) {
  //           if (await contract.getHasMintedWhiteList(accounts[0])) {
  //             errorMsg = "You already minted during the whitelist phase.";
  //             setDisableButtons(true);
  //           }
  //         } else if (status === 2) {
  //           if (await contract.getHasMintedFree(accounts[0])) {
  //             errorMsg = "You already minted during the free phase.";
  //             setDisableButtons(true);
  //           }
  //         } else if (status === 3) {
  //           const amountMinted = await contract.getHasMintedSale(accounts[0]);

  //           if (amountMinted + mintAmount > 2) {
  //             errorMsg = `You already minted ${amountMinted}/2 during the sale phase.`;
  //             if (amountMinted === 2) {
  //               setDisableButtons(true);
  //             }
  //           }
  //         }
  //         setText(errorMsg);
  //       } else {
  //         setText("You rejected the minting transaction :(");
  //       }
  //       console.log(e);
  //     } finally {
  //       setDisableButtons(false);
  //       setMinting(false);
  //     }
  //   }
  // };

  const mint = async (contract) => {
    let response;
    if (status === 2) {
      response = await contract.freeMint(
        allowListTree.getHexProof(keccak256(accounts[0]), {
          value: "0.00",
        })
      );
    } else if (status === 3) {
      response = await contract.saleMint(
        allowListTree.getHexProof(keccak256(accounts[0])),
        mintAmount,
        {
          value: ethers.utils.parseEther((mintAmount * 0.01312).toString()),
        }
      );
    }
    return response;
  };

  const handleIncrement = () => {
    if (mintAmount < 2) {
      setMintAmount(mintAmount + 1);
    }
  };

  const handleDecrement = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };

  const renderSelectAmount = () => {
    return (
      <Flex direction="column" justify="center" align="center">
        <Flex justify="center" align="center">
          <Button
            onClick={handleDecrement}
            padding="10px 15px"
            cursor="pointer"
            height={50}
            width={50}
            fontFamily="sans-serif"
            disabled={disableButtons}
          >
            -
          </Button>
          <Box width="100px" textAlign="center" fontSize={50}>
            {mintAmount}
          </Box>
          <Button
            onClick={handleIncrement}
            padding="10px 15px"
            cursor="pointer"
            height={50}
            width={50}
            fontFamily="sans-serif"
            disabled={disableButtons}
          >
            +
          </Button>
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
      width={"100%"}
      position={"relative"}
    >
      <Text fontSize={50} textAlign={"center"} height="50px" marginTop={-20}>
        Picciotto,
      </Text>
      <Flex position={"relative"} justify={"center"} align={"center"}>
        <Image src={MintField} height={"300px"} position="absolute"></Image>
        {!isConnected ? (
          <Text fontSize={30} zIndex={10}>
            Please connect your wallet.
          </Text>
        ) : (
          [
            <MintingClosed accounts={accounts} address={address} />,
            <WhiteListMint accounts={accounts} address={address} />,
          ][status]
        )}
      </Flex>
    </Flex>
  );
};

export default Mint;
