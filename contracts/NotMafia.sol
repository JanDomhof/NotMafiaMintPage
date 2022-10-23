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

contract NotMafia is ERC721A, Ownable, ReentrancyGuard {
    // The different options of the status of the contract, this regulates which mint functions can be called
    enum Status {
        CLOSED, // 0
        WHITELIST, // 1
        FREE, // 2
        PAID // 3
    }

    Status public status;
    uint256 public price;
    string public provenance;

    bool public revealed;
    string public preRevealURI;
    string public baseURI;

    bytes32 public whiteListRoot;

    /**
     * Token id allocation:
     *
     * |  WHITELIST  |  |     FREE      |  |     PAID      |
     * |    1 pw     |  |     1 pw      |  |     3 pw      |
     * [0, ..., 1700 ]  [1701, ..., 2222]  [2223, ..., 4444]
     *
     */
    uint256 private tokenId;
    uint256 private constant TOTAL_WHITELIST_SUPPLY = 1700;
    uint256 private constant TOTAL_FREE_SUPPLY = 2222;
    uint256 private constant TOTAL_SUPPLY = 4444;
    uint256 private constant MAX_PER_WALLET_PUBLIC = 3;

    mapping(address => bool) private hasMintedWhiteList;
    mapping(address => bool) private hasMintedFree;
    mapping(address => uint256) private hasMintedSale;

    event ChangedStatus(uint256 newStatus);

    // Constructor
    constructor() ERC721A("Not Mafia", "NM") {
        status = Status.CLOSED;
        price = 0.01312 ether;
        baseURI = "";
        provenance = "";
    }

    // Public
    function ownerMint(uint256 __amount) external nonReentrant onlyOwner {
        // Order should not exceed the total supply
        if (tokenId + __amount > TOTAL_SUPPLY) revert AmountNotAvailable();

        // Increment counter
        unchecked {
            tokenId += __amount;
        }

        // Do the magic
        _safeMint(msg.sender, __amount);
    }

    function whiteListMint(bytes32[] calldata __proof) external nonReentrant {
        // Caller cannot be a contract
        if (tx.origin != msg.sender) revert OnlyUserMint();

        // Status should be WHITELIST
        if (status != Status.WHITELIST) revert WrongMintFunction();

        // Caller should be on the WHITELIST
        if (!verifyWhiteList(__proof, whiteListRoot)) revert NotWhiteListed();

        // Caller cannot mint more than one during the WHITELIST phase
        if (hasMintedWhiteList[msg.sender]) revert AlreadyMintedMaxInPhase();

        // Increment counter and update that the caller minted during WHITELIST
        unchecked {
            tokenId++;
            hasMintedWhiteList[msg.sender] = true;
        }

        // Do the magic
        _safeMint(msg.sender, 1);
    }

    function freeMint() external nonReentrant {
        // Caller cannot be a contract
        if (tx.origin != msg.sender) revert OnlyUserMint();

        // Status should be FREE
        if (status != Status.FREE) revert WrongMintFunction();

        // Caller is not allowed to mint more than one during the FREE phase
        if (hasMintedFree[msg.sender]) revert AlreadyMintedMaxInPhase();

        // Amount already minted by everyone + ordered amount must not be larger than the available supply
        uint256 current = tokenId;
        if (current > TOTAL_FREE_SUPPLY) revert AmountNotAvailable();

        // Increment counter and update that the caller has minted during the FREE phase
        unchecked {
            tokenId = current + 1;
            hasMintedFree[msg.sender] = true;
        }

        // Do the magic.
        _safeMint(msg.sender, 1);
    }

    function paidMint(uint256 __amount) external payable nonReentrant {
        // Caller cannot be a contract
        if (tx.origin != msg.sender) revert OnlyUserMint();

        // Status should be PAID
        if (status != Status.PAID) revert WrongMintFunction();

        // Msg value should be at least the cost of the amount of NFT's
        if (msg.value < __amount * price) revert ValueNotEqualToPrice();

        // Amount already minted by caller + ordered amount must not be larger than the allowed amount per wallet
        uint256 amountMinted = hasMintedSale[msg.sender];
        if (amountMinted + __amount > MAX_PER_WALLET_PUBLIC)
            revert WouldExceedMaxPerWallet();

        // Amount already minted by everyone + ordered amount must not be larger than the available supply
        uint256 current = tokenId;
        if (current + __amount > TOTAL_SUPPLY) revert AmountNotAvailable();

        // Increment counter and update the amount minted by user
        unchecked {
            tokenId = current + __amount;
            hasMintedSale[msg.sender] = amountMinted + __amount;
        }

        // Do the magic
        _safeMint(msg.sender, __amount);
    }

    // Override
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // Internal
    function verifyWhiteList(bytes32[] calldata __proof, bytes32 __root)
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

    // Getters - External
    function getCurrentTokenId() external view returns (uint256) {
        return tokenId;
    }

    function getHasMintedFree(address __address) external view returns (bool) {
        return hasMintedFree[__address];
    }

    function getHasMintedWhiteList(address __address)
        external
        view
        returns (bool)
    {
        return hasMintedWhiteList[__address];
    }

    function getHasMintedSale(address __address)
        external
        view
        returns (uint256)
    {
        return hasMintedSale[__address];
    }

    // Setters - Only Owner
    function setStatus(uint256 __status) external onlyOwner {
        status = Status(__status);
        emit ChangedStatus(__status);
    }

    function setRevealed(bool __revealed) external onlyOwner {
        revealed = __revealed;
    }

    function setBaseURI(string memory __newURI) external onlyOwner {
        baseURI = __newURI;
    }

    function setPreRevealURI(string memory __newURI) external onlyOwner {
        preRevealURI = __newURI;
    }

    function setWhiteListRoot(bytes32 __root) external onlyOwner {
        whiteListRoot = __root;
    }

    function setProvenanceHash(string memory __hash) external onlyOwner {
        provenance = __hash;
    }

    function setPrice(uint256 __price) external onlyOwner {
        price = __price;
    }

    // Withdraw Funds From Contract
    function withdraw() external nonReentrant onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
