import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Flex, Button, Text, Box } from "@chakra-ui/react";
import { keccak256 } from "ethers/lib/utils";
import whiteListTree from "./WhiteList";
import allowListTree from "./AllowList";
import notMafia from "./NotMafiaCompiled.json";
import "./App.css";

const notMafiaAddress = "0xBAB9b565218d8B7517eFE2Cc35dB41EFfFbe0b9E";

const Mint = ({ accounts, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const [status, setStatus] = useState(0);
  const [text, setText] = useState("Minting Closed.");
  const [minting, setMinting] = useState(false);
  const [tokenId, setTokenId] = useState(0);
  const [disableButtons, setDisableButtons] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      notMafiaAddress,
      notMafia.abi,
      provider
    );
    contract.on("ChangedStatus", (newStatus) => {
      setStatus(newStatus);
    });
    contract.on("Transfer", (from, to, amount) => {
      setTokenId(tokenId + amount);
    });
    async function fetchFromContract() {
      const currentStatus = await contract.status();
      setStatus(currentStatus);

      const currentTokenId = await contract.getCurrentTokenId();
      setTokenId(currentTokenId);
    }
    fetchFromContract();
  }, []);

  useEffect(() => {
    setDisableButtons(false);
    if (status == 0) {
      setText("Minting is closed!");
    } else if (status == 1) {
      setText("WhiteList Mint!");
    } else if (status == 2) {
      setText("Free Mint!");
    } else if (status == 3) {
      setText("Paid Mint!");
    }
  }, [status]);

  const handleMint = async () => {
    setDisableButtons(true);
    setMinting(true);
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        notMafiaAddress,
        notMafia.abi,
        signer
      );
      try {
        const response = await mint(contract);
        console.log(`mint successfull, response: ${response}`);
      } catch (e) {
        if (e.code != 4001) {
          let errorMsg = "Transaction reverted.";
          if (status == 1) {
            if (await contract.getHasMintedWhiteList(accounts[0])) {
              errorMsg = "You already minted during the whitelist phase.";
              setDisableButtons(true);
            }
          } else if (status == 2) {
            if (await contract.getHasMintedFree(accounts[0])) {
              errorMsg = "You already minted during the free phase.";
              setDisableButtons(true);
            }
          } else if (status == 3) {
            const amountMinted = await contract.getHasMintedSale(accounts[0]);

            if (amountMinted + mintAmount > 2) {
              errorMsg = `You already minted ${amountMinted}/2 during the sale phase.`;
              if (amountMinted == 2) {
                setDisableButtons(true);
              }
            }
          }
          setText(errorMsg);
        } else {
          setText("You rejected the minting transaction :(");
        }
        console.log(e);
      } finally {
        setDisableButtons(false);
        setMinting(false);
      }
    }
  };

  const mint = async (contract) => {
    let response;
    if (status == 1) {
      response = await contract.whiteListMint(
        whiteListTree.getHexProof(keccak256(accounts[0]))
      );
    } else if (status == 2) {
      response = await contract.freeMint(
        allowListTree.getHexProof(keccak256(accounts[0]), {
          value: "0.00",
        })
      );
    } else if (status == 3) {
      response = await contract.saleMint(
        allowListTree.getHexProof(keccak256(accounts[0])),
        mintAmount,
        {
          value: ethers.utils.parseEther((mintAmount * 0.01312).toString()),
        }
      );
    }
    return response;
  };

  const handleIncrement = () => {
    if (mintAmount < 2) {
      setMintAmount(mintAmount + 1);
    }
  };

  const handleDecrement = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };

  const isAllowedToMint = () => {
    let tree;
    if (status == 1) {
      tree = whiteListTree;
    } else if (status == 2 || status == 3) {
      tree = allowListTree;
    }
    if (tree) {
      const root = tree.getHexRoot();
      const leaf = keccak256(accounts[0]);
      const proof = tree.getHexProof(leaf);
      return tree.verify(proof, leaf, root);
    }
    return false;
  };

  const renderSelectAmount = () => {
    return (
      <Flex direction="column" justify="center" align="center">
        <Flex justify="center" align="center">
          <Button
            onClick={handleDecrement}
            padding="10px 15px"
            cursor="pointer"
            height={50}
            width={50}
            fontFamily="sans-serif"
            disabled={disableButtons}
          >
            -
          </Button>
          <Box width="100px" textAlign="center" fontSize={50}>
            {mintAmount}
          </Box>
          <Button
            onClick={handleIncrement}
            padding="10px 15px"
            cursor="pointer"
            height={50}
            width={50}
            fontFamily="sans-serif"
            disabled={disableButtons}
          >
            +
          </Button>
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex justify="center" align="center" direction="column">
      <Text fontSize="100" textShadow="inner">
        NotMafia
      </Text>
      {!Boolean(accounts[0]) ? (
        "Please connect your wallet."
      ) : (
        <>
          {status == 0 ? (
            <Text>Minting is closed.</Text>
          ) : (
            <>
              {!isAllowedToMint() ? (
                <>
                  {status == 1 ? (
                    <Text>Your address is not on the whitelist.</Text>
                  ) : (
                    <Text>Your address is not on the allowlist.</Text>
                  )}
                </>
              ) : (
                <>
                  <Text fontSize={30}>{text}</Text>
                  <Text fontSize={20}>{`Supply left: ${4444 - tokenId}`}</Text>
                  {status == 3 ? renderSelectAmount() : <></>}
                  <Flex>
                    <Button
                      onClick={handleMint}
                      isLoading={minting}
                      loadingText="Minting..."
                      margin="30px"
                      padding="20px"
                      cursor="pointer"
                      height="50px"
                      disabled={disableButtons}
                    >
                      <Text fontSize="50">Mint</Text>
                    </Button>
                  </Flex>
                </>
              )}
            </>
          )}
        </>
      )}
    </Flex>
  );
};

export default Mint;
