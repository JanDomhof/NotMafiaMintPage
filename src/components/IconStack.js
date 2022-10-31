import { Link, Image, HStack, Spacer } from "@chakra-ui/react";
import Etherscan from "./icons/etherscan-icon.png";
import Twitter from "./icons/twitter-icon.png";
import OpenSea from "./icons/opensea-icon.png";

const IconStack = ({ isMobile }) => {
  return (
    <HStack width={isMobile ? "80%" : "305px"} height="60px">
      <Link href="https://twitter.com/notmafianft" borderRadius="50%">
        <Image src={Twitter} boxSize="60px" borderRadius="50%"></Image>
      </Link>
      <Spacer />
      <Link
        href="https://etherscan.io/address/0x8b002086064A5F0525D81045EE99bd6f587Be80E"
        borderRadius="50%"
      >
        <Image src={Etherscan} boxSize="60px" borderRadius="50%"></Image>
      </Link>
      <Spacer />
      <Link href="https://opensea.io/collection/notmafia" borderRadius="50%">
        <Image src={OpenSea} boxSize="60px" borderRadius="50%"></Image>
      </Link>
    </HStack>
  );
};

export default IconStack;
