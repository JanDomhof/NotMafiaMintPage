import { Flex, Image, Text } from "@chakra-ui/react";
import TextField from "./icons/text-field.svg";

const FootBar = ({ tokenId }) => {
  return (
    <Flex justify={"space-between"} align={"center"} paddingBottom={"50px"}>
      <Flex
        justify={"center"}
        align={"center"}
        width={"300px"}
        cursor={"pointer"}
        pointerEvents={"none"}
        paddingLeft={"100px"}
      >
        <Image src={TextField} height="50px" width={"600px"}></Image>
        <Text position={"absolute"} fontSize={"1.5em"}>
          {`${tokenId}/4444 minted`}
        </Text>
      </Flex>
      <Flex
        justify={"center"}
        align={"center"}
        cursor={"pointer"}
        pointerEvents={"none"}
        paddingRight={"50px"}
        overflow={"hidden"}
      >
        <Image src={TextField} height="50px" width={"500px"}></Image>
        <Text position={"absolute"} fontSize={"1.5em"}>
          First 2222 free, then 0.01312
        </Text>
      </Flex>
    </Flex>
  );
};

export default FootBar;
