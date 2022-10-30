import { Flex } from "@chakra-ui/react";

export default ({ text }) => {
  return (
    <Flex
      padding="0 10px 0 10px"
      background="rgba(255, 255, 255, 0.65)"
      border="2px solid"
      borderRadius="20px"
      height="50px"
      fontSize="1.5em"
    >
      {text}
    </Flex>
  );
};
