const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

window.Buffer = window.Buffer || require("buffer").Buffer;

const addresses = [
  "0x0B76F2E7083c4FA0844d712A6018b42013Dc8Af7",
  "0xad3EA2A02B83a492f9e512401851E158f614FAC9",
  "0xDE8D5aE4c54e4De86AFeF3B9FE35B40D88194d61",
];
const leaves = addresses.map((x) => keccak256(x));
const whiteListTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

console.log(`WhiteList root: ${whiteListTree.getHexRoot()}`);

export default whiteListTree;
