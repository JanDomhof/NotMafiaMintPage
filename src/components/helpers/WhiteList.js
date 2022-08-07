const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

window.Buffer = window.Buffer || require("buffer").Buffer;

const addresses = [
  "0x0B76F2E7083c4FA0844d712A6018b42013Dc8Af7",
  "0x6BE934Af097bEA8Df1f63e58ca0552Cda5890E17",
  "0x82e3ceA43daF04CB9F55106955f815c2089C9645",
];
const leaves = addresses.map((x) => keccak256(x));
const whiteListTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

console.log(`WhiteList root: ${whiteListTree.getHexRoot()}`);

export default whiteListTree;
