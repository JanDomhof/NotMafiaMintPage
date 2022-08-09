import { Link, Image, HStack } from "@chakra-ui/react";
import Etherscan from "./icons/etherscan-icon.png";
import Twitter from "./icons/twitter-icon.png";
import OpenSea from "./icons/opensea-icon.png";

const IconStack = () => {
  return (
    <HStack spacing="60px" height="60px">
      <Link href="https://twitter.com/">
        <Image src={Twitter} boxSize="60px"></Image>
      </Link>
      <Link href="https://rinkeby.etherscan.io/address/0xa5426Fb60F38a3De3FfB4e38246504465631834e">
        <Image src={Etherscan} boxSize="60px"></Image>
      </Link>
      <Link href="https://opensea.io/">
        <Image src={OpenSea} boxSize="60px"></Image>
      </Link>
    </HStack>
  );
};

export default IconStack;
