import { Flex } from "@chakra-ui/react";
import IconStack from "./IconStack";
import Connect from "./Connect";

const NavBar = ({ accounts, setAccounts }) => {
  return (
    <Flex justify="space-between" align="center" height="150px" width={"100%"}>
      <IconStack />
      <Connect accounts={accounts} setAccounts={setAccounts} />
    </Flex>
  );
};

export default NavBar;
