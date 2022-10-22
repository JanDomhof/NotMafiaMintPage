const { Text, VStack } = require("@chakra-ui/react");

const MintingClosed = () => {
  return (
    <VStack paddingBottom="15px">
      <Text fontSize={30} zIndex={10}>
        Minting is closed!
      </Text>
      <Text fontSize={20} zIndex={10}>
        We will start soon.
      </Text>
    </VStack>
  );
};

export default MintingClosed;
