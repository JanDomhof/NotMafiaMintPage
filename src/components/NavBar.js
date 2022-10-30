import { HStack, Spacer, VStack } from "@chakra-ui/react";
import IconStack from "./IconStack";
import Connect from "./Connect";

const NavBar = ({ accounts, setAccounts, isMobile }) => {
  return (
    <>
      {isMobile ? (
        <VStack paddingTop="30px">
          <IconStack isMobile={isMobile} />
          <Spacer />
          <>
            {window.ethereum ? (
              <Connect
                accounts={accounts}
                setAccounts={setAccounts}
                isMobile={isMobile}
              />
            ) : (
              <></>
            )}
          </>
        </VStack>
      ) : (
        <HStack paddingTop={"50px"}>
          <IconStack isMobile={isMobile} />
          <Spacer />
          <Connect
            accounts={accounts}
            setAccounts={setAccounts}
            isMobile={isMobile}
          />
        </HStack>
      )}
    </>
  );
};

export default NavBar;
