const { Text, VStack } = require("@chakra-ui/react");

const MintingClosed = () => {
  return (
    <VStack paddingBottom="15px">
      <Text fontSize={30} zIndex={10}>
        Minting is closed!
      </Text>
    </VStack>
  );
};

export default MintingClosed;
