import { Flex, Text, VStack } from "@chakra-ui/react";
import MintingClosed from "./mint/MintingClosed";
import SimpleMint from "./mint/SimpleMint";
import SaleMint from "./mint/SaleMint";
import { isCommunityResourcable } from "@ethersproject/providers";
// import useWindowDimensions from "./helpers/WindowDimensions";

const Mint = ({ accounts, address, status, tokenId, isMobile }) => {
  // const { width, height } = useWindowDimensions();
  // const isMobile = width < height;

  const isConnected = Boolean(accounts[0]);

  return (
    <VStack>
      <Text fontSize={50} margin="0" marginTop="-50px">
        Picciotto,
      </Text>
      <Flex
        bg={"rgba(255,255,255, 0.65)"}
        width={isMobile ? "80%" : "400px"}
        border={"2px solid"}
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
            tokenId > 2222 ? (
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
