import { useState } from "react";
import { Flex, Link, Image, Button, HStack } from "@chakra-ui/react";
import Discord from "./icons/discord.svg";
import Etherscan from "./icons/etherscan-logo-circle.svg";
import Twitter from "./icons/icons8-twitter-42.svg";
import OpenSea from "./icons/opensea.svg";

const NavBar = ({ accounts, setAccounts }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const isConnected = Boolean(accounts[0]);

  async function connectAccount() {
    setIsConnecting(true);
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(accounts);
      } catch (error) {
        console.log(error);
      } finally {
        setIsConnecting(false);
      }
    }
  }
  return (
    <Flex
      justify="space-between"
      align="center"
      height="150px"
      padding="0 30px"
    >
      <HStack spacing="-10px">
        <Link href="https://twitter.com/">
          <Image src={Twitter} boxSize="30px" margin="0 15px"></Image>
        </Link>
        <Link href="https://discord.gg/">
          <Image src={Discord} boxSize="40px" margin="0 15px"></Image>
        </Link>
        <Link href="https://rinkeby.etherscan.io/address/0xa5426Fb60F38a3De3FfB4e38246504465631834e">
          <Image src={Etherscan} boxSize="30px" margin="0 15px"></Image>
        </Link>
        <Link href="https://opensea.io/">
          <Image src={OpenSea} boxSize="30px" margin="0 15px"></Image>
        </Link>
      </HStack>
      <Flex width="40%" fontSize="30" direction="column" align="end">
        {isConnected ? (
          <p>
            Connected: {accounts[0].slice(0, 5)}...
            {accounts[0].slice(accounts[0].length - 4, accounts[0].length)}
          </p>
        ) : (
          <Button
            onClick={connectAccount}
            isLoading={isConnecting}
            loadingText="Connecting..."
            bg="none"
            border="none"
            cursor="pointer"
            fontSize="50"
            fontWeight="thin"
            _hover={{ fontcolor: "#ebedf0" }}
          >
            Connect Wallet
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default NavBar;
