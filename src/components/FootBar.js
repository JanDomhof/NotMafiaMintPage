import { HStack, Spacer, VStack } from "@chakra-ui/react";
import TextField from "./TextField";
import TextFieldFixed from "./TextFieldFixed";

const FootBar = ({ tokenId, isMobile }) => {
  const inner = (
    <>
      <TextFieldFixed text={`${tokenId}/4444 minted`} width="275px" />
      <Spacer />
      <TextField text={"First 2222 free, then 0.00869"} />
    </>
  );

  const innerMobile = (
    <>
      <TextFieldFixed text={`${tokenId}/4444 minted`} width="90%" />
      <Spacer />
      <TextFieldFixed text={`2222 free, then 0.00869`} width="90%" />
    </>
  );

  return (
    <>
      {isMobile ? (
        <VStack marginBottom="30px">{innerMobile}</VStack>
      ) : (
        <HStack marginBottom="50px">{inner}</HStack>
      )}
    </>
  );
};

export default FootBar;
