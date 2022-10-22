import { Button } from "@chakra-ui/react";

export default ({ handleMint }) => {
  return (
    <Button
      id="hoverable"
      bg="black"
      textColor="white"
      borderRadius="50px"
      cursor="pointer"
      height="50px"
      padding="0 15px 0 15px"
      onClick={handleMint}
      fontSize={30}
    >
      Mint
    </Button>
  );
};
