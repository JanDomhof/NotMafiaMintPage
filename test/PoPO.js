const { ethers } = require("hardhat");

describe("Test", () => {
  let popo;
  beforeEach(async () => {
    console.log("-------------------------------");
    const popoFactory = await ethers.getContractFactory("PoPO");
    console.log("halfway");
    popo = await popoFactory.deploy();
    console.log("-------------------------------");
  });

  it("tests something", async () => {
    console.log(
      await popo.claim(
        "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
        "0x935860e23c74580b9447F70cacB472E87D5c16ee"
      )
    );
  });
});
