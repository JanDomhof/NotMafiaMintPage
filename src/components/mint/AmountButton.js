import { Button } from "@chakra-ui/react";

export default ({ onClick, text }) => {
  return (
    <Button
      id="hoverable"
      bg="black"
      textColor={"white"}
      borderRadius={"50%"}
      height={"35px"}
      width={"35px"}
      onClick={onClick}
      cursor="pointer"
      fontSize={30}
    >
      {text}
    </Button>
  );
};
