import { useState } from "react";
import { Flex, Image, Text } from "@chakra-ui/react";
import TextField from "./icons/text-field.svg";

const Connect = ({ accounts, setAccounts }) => {
  const isConnected = Boolean(accounts[0]);

  async function connectAccount() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccounts(accounts);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Flex
      justify="center"
      align="center"
      minWidth="300px"
      onClick={connectAccount}
      cursor={"pointer"}
      pointerEvents={isConnected ? "none" : "all"}
    >
      <Image src={TextField} width={"90%"}></Image>
      <Text position={"absolute"} fontSize={"1.75em"}>
        {isConnected
          ? `${accounts[0].slice(0, 6)}...${accounts[0].slice(
              accounts[0].length - 5,
              accounts[0].length
            )}`
          : "Connect Wallet"}
      </Text>
    </Flex>
  );
};

export default Connect;
