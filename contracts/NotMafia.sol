//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

error MintingClosed();
error AmountNotAvailable();
error WouldExceedMaxPerWallet();
error OnlyUserMint();
error NotWhiteListed();
error ValueNotEqualToPrice();
error NotEnoughBalance();
error AlreadyMintedMaxInPhase();
error NotAllowListed();
error WrongMintFunction();

// A simple token contract
contract NotMafia is ERC721A, Ownable, ReentrancyGuard {
    enum Status {
        CLOSED, // 0
        WHITELIST, // 1
        FREE, // 2
        SALE // 3
    }

    Status public status;
    string public baseURI;
    string public provenance;
    uint256 private tokenId;

    bytes32 public whiteListRoot;
    bytes32 public allowListRoot;

    uint256 private constant TOTAL_SUPPLY = 4444;
    uint256 private constant TOTAL_FREE_SUPPLY = 2222;
    uint256 private constant MAX_PER_WALLET = 3;
    uint256 private constant PRICE = 0.01312 ether;

    mapping(address => bool) private hasMintedWhiteList;
    mapping(address => bool) private hasMintedFree;
    mapping(address => uint256) private hasMintedSale;

    event ChangedPrice(uint256 price);
    event ChangedStatus(uint256 newStatus);
    event ChangedBaseURI(string newURI);
    event ChangedMerkleRoot(bytes32 newMerkleRoot);
    event ChangedTeamWalletAddress(address newAddress);
    event WithdrawnAmount(uint256 amount, address to);

    // Constructor
    constructor(
        string memory __name,
        string memory __symbol,
        string memory __baseURI
    ) ERC721A(__name, __symbol) {
        baseURI = __baseURI;
        status = Status.CLOSED;
        provenance = "";
    }

    // Public
    function ownerMint(uint256 __amount) external nonReentrant onlyOwner {
        if (tokenId + __amount > TOTAL_SUPPLY) revert AmountNotAvailable();

        unchecked {
            tokenId += __amount;
        }
        _safeMint(msg.sender, __amount);
    }

    function whiteListMint(bytes32[] calldata __proof) external nonReentrant {
        if (tx.origin != msg.sender) revert OnlyUserMint();
        if (status != Status.WHITELIST) revert WrongMintFunction();
        if (!verifyAddress(__proof, whiteListRoot)) revert NotWhiteListed();
        if (hasMintedWhiteList[msg.sender]) revert AlreadyMintedMaxInPhase();

        unchecked {
            tokenId++;
        }
        hasMintedWhiteList[msg.sender] = true;
        _safeMint(msg.sender, 1);
    }

    function freeMint(bytes32[] calldata __proof) external nonReentrant {
        if (tx.origin != msg.sender) revert OnlyUserMint();
        if (status != Status.FREE) revert WrongMintFunction();
        if (hasMintedFree[msg.sender]) revert AlreadyMintedMaxInPhase();
        if (!verifyAddress(__proof, allowListRoot)) revert NotAllowListed();
        uint256 current = tokenId;
        if (current >= TOTAL_FREE_SUPPLY) revert AmountNotAvailable();

        unchecked {
            tokenId = current + 1;
        }
        hasMintedFree[msg.sender] = true;
        _safeMint(msg.sender, 1);
    }

    function saleMint(bytes32[] calldata __proof, uint256 __amount)
        external
        payable
        nonReentrant
    {
        if (status != Status.SALE) revert WrongMintFunction();
        if (tx.origin != msg.sender) revert OnlyUserMint();
        if (msg.value != __amount * PRICE) revert ValueNotEqualToPrice();
        uint256 amountMinted = hasMintedSale[msg.sender];
        if (amountMinted + __amount > MAX_PER_WALLET)
            revert WouldExceedMaxPerWallet();
        uint256 current = tokenId;
        if (current + __amount > TOTAL_SUPPLY) revert AmountNotAvailable();
        if (!verifyAddress(__proof, allowListRoot)) revert NotAllowListed();

        unchecked {
            tokenId = current + __amount;
            hasMintedSale[msg.sender] = amountMinted + __amount;
        }
        _safeMint(msg.sender, __amount);
    }

    // Override
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // Internal
    function verifyAddress(bytes32[] calldata __proof, bytes32 __root)
        internal
        view
        returns (bool)
    {
        return
            MerkleProof.verify(
                __proof,
                __root,
                keccak256(abi.encodePacked(msg.sender))
            );
    }

    // Getters
    function getCurrentTokenId() external view returns (uint256) {
        return tokenId;
    }

    function getHasMintedWhiteList(address __address)
        external
        view
        returns (bool)
    {
        return hasMintedWhiteList[__address];
    }

    function getHasMintedFree(address __address) external view returns (bool) {
        return hasMintedFree[__address];
    }

    function getHasMintedSale(address __address)
        external
        view
        returns (uint256)
    {
        return hasMintedSale[__address];
    }

    // Setters
    function setStatus(uint256 __status) external onlyOwner {
        status = Status(__status);
        emit ChangedStatus(__status);
    }

    function setBaseURI(string memory __newURI) external onlyOwner {
        baseURI = __newURI;
        emit ChangedBaseURI(__newURI);
    }

    function setAllowListRoot(bytes32 __root) external onlyOwner {
        allowListRoot = __root;
        emit ChangedMerkleRoot(__root);
    }

    function setWhiteListRoot(bytes32 __root) external onlyOwner {
        whiteListRoot = __root;
        emit ChangedMerkleRoot(__root);
    }

    function setProvenanceHash(string memory __hash) external onlyOwner {
        provenance = __hash;
    }

    // Withdraw Funds From Contract
    function withdraw() external nonReentrant onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
        emit WithdrawnAmount(address(this).balance, msg.sender);
    }
}
