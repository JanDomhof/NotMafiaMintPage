const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { constants } = require("@openzeppelin/test-helpers");

describe("whiteListMint", () => {
  let mafiaFactory, mafia, signers, addresses, leaves;
  beforeEach(async function () {
    // Deploy mafia
    mafiaFactory = await ethers.getContractFactory("NotMafia");
    mafia = await mafiaFactory.deploy("MAFIA", "MAF", "");

    // Get signers and their addresses
    signers = await ethers.getSigners();

    // Get addresses
    addresses = signers.map((x) => x.address);

    // Create leaf with the first 3 addresses
    leaves = [addresses[1], addresses[2], addresses[3]].map((x) =>
      keccak256(x)
    );

    // Create tree with 1 leaf
    tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    // Set root
    await mafia.setWhiteListRoot(tree.getHexRoot());

    // Set status to WHITELIST
    await mafia.setStatus(1);
  });

  it("Does not allow not WL's to mint", async () => {
    for (let i = leaves.length + 1; i < addresses.length; i++) {
      await expect(
        mafia
          .connect(signers[i])
          .whiteListMint(tree.getHexProof(keccak256(addresses[i])))
      ).to.be.revertedWithCustomError(mafia, "NotWhiteListed");
    }
    for (let i = leaves.length + 1; i < addresses.length; i++) {
      const tokenBalance = await mafia.balanceOf(addresses[i]);
      assert.equal(tokenBalance, 0);
    }
  });

  it("Allow WL to mint", async () => {
    // Mint WL
    await expect(
      mafia
        .connect(signers[1])
        .whiteListMint(tree.getHexProof(keccak256(addresses[1])))
    )
      .to.emit(mafia, "Transfer")
      .withArgs(constants.ZERO_ADDRESS, addresses[1], 0);
    const tokenBalance = await mafia.balanceOf(addresses[1]);
    const ownerOf = await mafia.ownerOf(0);
    assert.equal(tokenBalance, 1);
    assert.equal(ownerOf, addresses[1]);
  });

  it("Does not allow WL to mint again", async () => {
    // Mint WL
    await expect(
      mafia
        .connect(signers[1])
        .whiteListMint(tree.getHexProof(keccak256(addresses[1])))
    )
      .to.emit(mafia, "Transfer")
      .withArgs(constants.ZERO_ADDRESS, addresses[1], 0);
    await expect(
      mafia
        .connect(signers[1])
        .whiteListMint(tree.getHexProof(keccak256(addresses[1])))
    ).to.be.revertedWithCustomError(mafia, "AlreadyMintedMaxInPhase");
    const tokenBalance = await mafia.balanceOf(addresses[1]);
    const ownerOf = await mafia.ownerOf(0);
    assert.equal(tokenBalance, 1);
    assert.equal(ownerOf, addresses[1]);
  });
});

describe("freeMint", () => {
  let mafia, signers, addresses;
  beforeEach(async function () {
    // Deploy mafia
    mafiaFactory = await ethers.getContractFactory("NotMafia");
    mafia = await mafiaFactory.deploy("MAFIA", "MAF", "");

    // Get signers and their addresses
    signers = await ethers.getSigners();
    addresses = signers.map((x) => x.address);

    // Create leaf with the first 2 addresses
    leaves = [addresses[1], addresses[2]].map((x) => keccak256(x));

    // Create tree
    tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    // Set root
    await mafia.setAllowListRoot(tree.getHexRoot());

    // Set status to FREE
    await mafia.setStatus(2);
  });

  it("Has FREE status", async function () {
    const status = await mafia.status();
    assert.equal(status, 2);
  });

  it("Reverts when already minted before", async function () {
    await expect(
      mafia
        .connect(signers[1])
        .freeMint(tree.getHexProof(keccak256(addresses[1])))
    )
      .to.emit(mafia, "Transfer")
      .withArgs(constants.ZERO_ADDRESS, addresses[1], 0);
    await expect(
      mafia
        .connect(signers[1])
        .freeMint(tree.getHexProof(keccak256(addresses[1])))
    ).to.be.revertedWithCustomError(mafia, "AlreadyMintedMaxInPhase");
    const tokenBalance = await mafia.balanceOf(addresses[1]);
    const ownerOf = await mafia.ownerOf(0);
    assert.equal(tokenBalance, 1);
    assert.equal(ownerOf, addresses[1]);
  });

  it("Reverts when not allowlisted", async function () {
    await expect(
      mafia
        .connect(signers[3])
        .freeMint(tree.getHexProof(keccak256(addresses[3])))
    ).to.be.revertedWithCustomError(mafia, "NotAllowListed");
    const tokenBalance = await mafia.balanceOf(addresses[3]);
    assert.equal(tokenBalance, 0);
  });

  it("Reverts when amount not available", async function () {
    await mafia.ownerMint(2222);
    await expect(
      mafia
        .connect(signers[1])
        .freeMint(tree.getHexProof(keccak256(addresses[1])))
    ).to.be.revertedWithCustomError(mafia, "AmountNotAvailable");
    const tokenBalance = await mafia.balanceOf(addresses[1]);
    const ownerOf = await mafia.ownerOf(0);
    assert.equal(tokenBalance, 0);
    assert.notEqual(ownerOf, addresses[1]);
  });

  it("Succeeds when all the requirements are met", async function () {
    await expect(
      mafia
        .connect(signers[1])
        .freeMint(tree.getHexProof(keccak256(addresses[1])))
    )
      .to.emit(mafia, "Transfer")
      .withArgs(constants.ZERO_ADDRESS, addresses[1], 0);
    const tokenBalance = await mafia.balanceOf(addresses[1]);
    const ownerOf = await mafia.ownerOf(0);
    assert.equal(tokenBalance, 1);
    assert.equal(ownerOf, addresses[1]);
  });
});

describe("saleMint", () => {
  let mafia, signers, addresses;
  beforeEach(async function () {
    // Deploy mafia
    mafiaFactory = await ethers.getContractFactory("NotMafia");
    mafia = await mafiaFactory.deploy("MAFIA", "MAF", "");

    // Get signers and their addresses
    signers = await ethers.getSigners();
    addresses = signers.map((x) => x.address);

    // Create leaf with the first 2 addresses
    leaves = [addresses[1], addresses[2]].map((x) => keccak256(x));

    // Create tree
    tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    // Set root for allowlist
    await mafia.setAllowListRoot(tree.getHexRoot());

    // Set status to PAID
    await mafia.setStatus(3);
  });

  it("Reverts when value not equal to price: 0.01312", async () => {
    await expect(
      mafia
        .connect(signers[1])
        .saleMint(tree.getHexProof(keccak256(addresses[1])), 1, {
          value: ethers.utils.parseEther("0.01311"),
        })
    ).to.be.revertedWithCustomError(mafia, "ValueNotEqualToPrice");
    await expect(
      mafia
        .connect(signers[1])
        .saleMint(tree.getHexProof(keccak256(addresses[1])), 1, {
          value: ethers.utils.parseEther("0.01313"),
        })
    ).to.be.revertedWithCustomError(mafia, "ValueNotEqualToPrice");
  });

  it("Reverts when mint would exceed max per wallet", async () => {
    // Attempt to mint 4
    await expect(
      mafia
        .connect(signers[1])
        .saleMint(tree.getHexProof(keccak256(addresses[1])), 4, {
          value: ethers.utils.parseEther((4 * 0.01312).toString()),
        })
    ).to.be.revertedWithCustomError(mafia, "WouldExceedMaxPerWallet");

    // Mint 1 -> total: 1
    await mafia
      .connect(signers[1])
      .saleMint(tree.getHexProof(keccak256(addresses[1])), 1, {
        value: ethers.utils.parseEther("0.01312"),
      });

    // Attempt to mint another 3
    await expect(
      mafia
        .connect(signers[1])
        .saleMint(tree.getHexProof(keccak256(addresses[1])), 3, {
          value: ethers.utils.parseEther((3 * 0.01312).toString()),
        })
    ).to.be.revertedWithCustomError(mafia, "WouldExceedMaxPerWallet");

    // Mint another 1 -> total: 2
    await mafia
      .connect(signers[1])
      .saleMint(tree.getHexProof(keccak256(addresses[1])), 1, {
        value: ethers.utils.parseEther("0.01312"),
      });

    // Attempt to mint another 2
    await expect(
      mafia
        .connect(signers[1])
        .saleMint(tree.getHexProof(keccak256(addresses[1])), 2, {
          value: ethers.utils.parseEther((2 * 0.01312).toString()),
        })
    ).to.be.revertedWithCustomError(mafia, "WouldExceedMaxPerWallet");

    // Mint another 1 -> total: 3
    await mafia
      .connect(signers[1])
      .saleMint(tree.getHexProof(keccak256(addresses[1])), 1, {
        value: ethers.utils.parseEther("0.01312"),
      });

    // Attempt to mint another 1
    await expect(
      mafia
        .connect(signers[1])
        .saleMint(tree.getHexProof(keccak256(addresses[1])), 1, {
          value: ethers.utils.parseEther((1 * 0.01312).toString()),
        })
    ).to.be.revertedWithCustomError(mafia, "WouldExceedMaxPerWallet");

    // Assertions
    const tokenBalance = await mafia.balanceOf(addresses[1]);
    const ownerOfZero = await mafia.ownerOf(0);
    const ownerOfOne = await mafia.ownerOf(1);
    const ownerOfTwo = await mafia.ownerOf(2);
    assert.equal(tokenBalance, 3);
    assert.equal(ownerOfZero, addresses[1]);
    assert.equal(ownerOfOne, addresses[1]);
    assert.equal(ownerOfTwo, addresses[1]);
  });

  it("Reverts when amount not available", async () => {
    await mafia.ownerMint(4444);
    await expect(
      mafia
        .connect(signers[1])
        .saleMint(tree.getHexProof(keccak256(addresses[1])), 1, {
          value: ethers.utils.parseEther("0.01312"),
        })
    ).to.be.revertedWithCustomError(mafia, "AmountNotAvailable");
    const tokenBalance = await mafia.balanceOf(addresses[1]);
    assert.equal(tokenBalance, 0);
  });

  it("Reverts when not allowlisted", async function () {
    await expect(
      mafia
        .connect(signers[3])
        .saleMint(tree.getHexProof(keccak256(addresses[1])), 1, {
          value: ethers.utils.parseEther("0.01312"),
        })
    ).to.be.revertedWithCustomError(mafia, "NotAllowListed");
    const tokenBalance = await mafia.balanceOf(addresses[3]);
    assert.equal(tokenBalance, 0);
  });
});

describe("ownerMint", async () => {
  let mafia, signers, addresses;
  beforeEach(async function () {
    // Deploy mafia
    mafiaFactory = await ethers.getContractFactory("NotMafia");
    mafia = await mafiaFactory.deploy("MAFIA", "MAF", "");

    // Get signers and their addresses
    signers = await ethers.getSigners();

    // Get addresses
    addresses = signers.map((x) => x.address);
  });

  // it("Can mint 1", async function () {
  //   await mafia.connect(signers[0]).ownerMint(1)
  //   assert.equal(await mafia.balanceOf(addresses[0]), 1)
  // })

  it("Can mint 50", async function () {
    await mafia.connect(signers[0]).ownerMint(50);
    assert.equal(await mafia.balanceOf(addresses[0]), 50);
  });

  // it("Can mint 1000", async function () {
  //   await mafia.connect(signers[0]).ownerMint(1000)
  //   assert.equal(await mafia.balanceOf(addresses[0]), 1000)
  // })
});

// Withdraw
describe("withdraw", async () => {
  let mafia, signers, addresses, provider;
  beforeEach(async function () {
    // Deploy mafia
    mafiaFactory = await ethers.getContractFactory("NotMafia");
    mafia = await mafiaFactory.deploy("MAFIA", "MAF", "");

    // Get provider for checking balances
    provider = ethers.provider;

    // Get signers and their addresses
    signers = await ethers.getSigners();
    addresses = signers.map((x) => x.address);

    // Create leaf with the first 2 addresses
    leaves = [addresses[1], addresses[2]].map((x) => keccak256(x));

    // Create tree
    tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

    // Set root for allowlist
    await mafia.setAllowListRoot(tree.getHexRoot());

    // Set status to PAID
    await mafia.setStatus(3);

    // Mint 2 PAID with account 1
    await expect(
      mafia
        .connect(signers[1])
        .saleMint(tree.getHexProof(keccak256(addresses[1])), 2, {
          value: ethers.utils.parseEther("0.02624"),
        })
    )
      .to.emit(mafia, "Transfer")
      .withArgs(constants.ZERO_ADDRESS, addresses[1], 1);

    // Mint 1 PAID with account 2
    await expect(
      mafia
        .connect(signers[2])
        .saleMint(tree.getHexProof(keccak256(addresses[2])), 1, {
          value: ethers.utils.parseEther("0.01312"),
        })
    )
      .to.emit(mafia, "Transfer")
      .withArgs(constants.ZERO_ADDRESS, addresses[2], 2);

    // There should now be 3 * 0.0044 = 0.0132 eth on the contract
  });

  it("Does not allow others to withdraw", async () => {
    for (let i = 1; i < signers.length; i++) {
      await expect(mafia.connect(signers[i]).withdraw()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    }
  });

  it("Allows owner to withdraw: 3 * 0.01312 = 0.03936", async () => {
    const balanceBefore = ethers.utils.formatEther(
      await provider.getBalance(addresses[0])
    );
    await mafia.connect(signers[0]).withdraw();
    const balanceAfter = ethers.utils.formatEther(
      await provider.getBalance(addresses[0])
    );
    const diff = balanceAfter - balanceBefore;
    // Account for gas fee...
    assert.isTrue(diff > 0.03836 && diff < 0.03936);
  });
});
