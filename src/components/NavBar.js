import { Flex, HStack, Spacer, VStack } from "@chakra-ui/react";
import IconStack from "./IconStack";
import Connect from "./Connect";
import useWindowDimensions from "./helpers/WindowDimensions";

const NavBar = ({ accounts, setAccounts }) => {
  const { width, height } = useWindowDimensions();
  return (
    <>
      {width > height ? (
        <HStack padding={"30px"}>
          <IconStack />
          <Spacer />
          <Connect accounts={accounts} setAccounts={setAccounts} />
        </HStack>
      ) : (
        <VStack padding={"30px"}>
          <IconStack />
          <Spacer />
          <Connect accounts={accounts} setAccounts={setAccounts} />
        </VStack>
      )}
    </>
  );
};

export default NavBar;
