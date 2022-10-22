const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

window.Buffer = window.Buffer || require("buffer").Buffer;

const addresses = [
  "0x0B76F2E7083c4FA0844d712A6018b42013Dc8Af7",
  "0xad3EA2A02B83a492f9e512401851E158f614FAC9",
  "0xDE8D5aE4c54e4De86AFeF3B9FE35B40D88194d61",
  "0x44479d182144Aeb39Da931c9Ef69F478538972ea",
];
const leaves = addresses.map((x) => keccak256(x));
const allowListTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

console.log(`AllowList root: ${allowListTree.getHexRoot()}`);

export default allowListTree;
