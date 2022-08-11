import { Flex, HStack, Image, Text, Spacer, VStack } from "@chakra-ui/react";
import TextField from "./icons/text-field.svg";
import useWindowDimensions from "./helpers/WindowDimensions";

const FootBar = ({ tokenId }) => {
  const { width, height } = useWindowDimensions();
  const isMobile = width > height;
  return (
    <>
      {width > 1030 ? (
        <HStack margin={"0 150px 70px 150px"}>
          <Flex
            justify={"center"}
            align={"center"}
            width={"300px"}
            cursor={"pointer"}
            pointerEvents={"none"}
          >
            <Image src={TextField} height="50px" width={"600px"}></Image>
            <Text position={"absolute"} fontSize={"1.5em"}>
              {`${tokenId}/4444 minted`}
            </Text>
          </Flex>
          <Spacer />
          <Flex
            justify={"center"}
            align={"center"}
            cursor={"pointer"}
            pointerEvents={"none"}
            overflow={"hidden"}
          >
            <Image src={TextField} height="50px" width={"500px"}></Image>
            <Text position={"absolute"} fontSize={"1.5em"}>
              First 2222 free, then 0.01312
            </Text>
          </Flex>
        </HStack>
      ) : (
        <VStack padding={"0 70px 70px 70px"}>
          <Flex
            justify={"center"}
            align={"center"}
            width={"300px"}
            cursor={"pointer"}
            pointerEvents={"none"}
          >
            <Image src={TextField} height="50px" width={"200px"}></Image>
            <Text position={"absolute"} fontSize={"1.5em"}>
              {`${tokenId}/4444`}
            </Text>
          </Flex>
          <Spacer />
          <Flex
            justify={"center"}
            align={"center"}
            cursor={"pointer"}
            pointerEvents={"none"}
          >
            <Image src={TextField} height="50px" width={"380px"}></Image>
            <Text position={"absolute"} fontSize={"1.5em"}>
              2222 free {">"} 2222 0.01312
            </Text>
          </Flex>
        </VStack>
      )}
    </>
  );
};

export default FootBar;
