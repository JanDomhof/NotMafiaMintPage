import { Link, Image, HStack } from "@chakra-ui/react";
import Etherscan from "./icons/etherscan-icon.png";
import Twitter from "./icons/twitter-icon.png";
import OpenSea from "./icons/opensea-icon.png";

const IconStack = () => {
  return (
    <HStack spacing="60px" height="60px">
      <Link href="https://twitter.com/" borderRadius="50%">
        <Image src={Twitter} boxSize="60px" borderRadius="50%"></Image>
      </Link>
      <Link
        href="https://rinkeby.etherscan.io/address/0xa5426Fb60F38a3De3FfB4e38246504465631834e"
        borderRadius="50%"
      >
        <Image src={Etherscan} boxSize="60px" borderRadius="50%"></Image>
      </Link>
      <Link href="https://opensea.io/" borderRadius="50%">
        <Image src={OpenSea} boxSize="60px" borderRadius="50%"></Image>
      </Link>
    </HStack>
  );
};

export default IconStack;
