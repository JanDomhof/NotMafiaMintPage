import { Flex } from "@chakra-ui/react";

export default ({ text, width }) => {
  return (
    <Flex
      padding="0 10px 0 10px"
      background="rgba(255, 255, 255, 0.65)"
      border="2px solid"
      borderRadius="20px"
      height="50px"
      width={width}
      fontSize="1.3em"
      justify="center"
      align="center"
    >
      {text}
    </Flex>
  );
};
