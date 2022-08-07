const { Text } = require("@chakra-ui/react");

const MintingClosed = () => {
  return (
    <>
      <Text fontSize={50} zIndex={10} position="absolute" top={15}>
        Minting is closed!
      </Text>
      <Text fontSize={30} zIndex={10} position="absolute">
        Be patient, we will start soon.
      </Text>
    </>
  );
};

export default MintingClosed;
