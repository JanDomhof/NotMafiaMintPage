import { Link, Image, HStack, Spacer } from "@chakra-ui/react";
import Etherscan from "./icons/etherscan-icon.png";
import Twitter from "./icons/twitter-icon.png";
import OpenSea from "./icons/opensea-icon.png";

const IconStack = ({ isMobile }) => {
  return (
    <HStack width="305px" height="60px">
      <Link href="https://twitter.com/notmafianft" borderRadius="50%">
        <Image src={Twitter} boxSize="60px" borderRadius="50%"></Image>
      </Link>
      <Spacer />
      <Link
        href="https://rinkeby.etherscan.io/address/0xa5426Fb60F38a3De3FfB4e38246504465631834e"
        borderRadius="50%"
      >
        <Image src={Etherscan} boxSize="60px" borderRadius="50%"></Image>
      </Link>
      <Spacer />
      <Link href="https://opensea.io/" borderRadius="50%">
        <Image src={OpenSea} boxSize="60px" borderRadius="50%"></Image>
      </Link>
    </HStack>
  );
};

export default IconStack;
