import { Flex, Text, VStack } from "@chakra-ui/react";
import MintingClosed from "./mint/MintingClosed";
import SimpleMint from "./mint/SimpleMint";
import SaleMint from "./mint/SaleMint";
import { ethers } from "ethers";
import compiledContract from "./helpers/NotMafiaCompiled.json";
// import useWindowDimensions from "./helpers/WindowDimensions";

const Mint = ({ accounts, address, status }) => {
  // const { width, height } = useWindowDimensions();
  // const isMobile = width < height;

  const isConnected = Boolean(accounts[0]);

  const getAmountMinted = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, compiledContract.abi, signer);
    const tokenId = await contract.getCurrentTokenId();
    console.log(tokenId);
    return tokenId;
  };

  return (
    <VStack>
      <Text fontSize={50} margin="0" marginTop="-50px">
        Picciotto,
      </Text>
      <Flex
        bg={"white"}
        border={"5px solid"}
        borderRadius={"20px"}
        justify={"center"}
        align={"center"}
        padding={"0 30px 0 30px"}
      >
        {!isConnected ? (
          <Text fontSize={30} maxWidth={"100%"} maxHeight={"100%"} zIndex={10}>
            Please connect your wallet.
          </Text>
        ) : (
          [
            <MintingClosed accounts={accounts} address={address} />,
            <SimpleMint
              accounts={accounts}
              address={address}
              type={"WHITELIST"}
            />,
            getAmountMinted() > 2222 ? (
              <SaleMint accounts={accounts} address={address} />
            ) : (
              <SimpleMint accounts={accounts} address={address} type={"FREE"} />
            ),
          ][status]
        )}
      </Flex>
    </VStack>
  );
};

export default Mint;
