import { Flex } from "@chakra-ui/react";

export default ({ text, width }) => {
  return (
    <Flex
      padding="0 10px 0 10px"
      background="white"
      border="5px solid"
      borderRadius="20px"
      height="50px"
      width={width}
      fontSize="1.5em"
      justify="center"
      align="center"
    >
      {text}
    </Flex>
  );
};
