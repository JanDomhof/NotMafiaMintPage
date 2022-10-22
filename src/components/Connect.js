import { useState } from "react";
import { Flex, Image, Text } from "@chakra-ui/react";
import "../App.css";

const Connect = ({ accounts, setAccounts, isMobile }) => {
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
      className={isMobile ? "mobile-field" : ""}
      bg={"white"}
      border={"5px solid"}
      height={"50px"}
      borderRadius={"20px"}
      padding={"0 20px 0 20px"}
      justify={"center"}
      align={"center"}
      onClick={connectAccount}
      cursor={"pointer"}
      pointerEvents={isConnected ? "none" : "all"}
    >
      <Text fontSize={"1.75em"}>
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
