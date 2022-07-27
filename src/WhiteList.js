const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

window.Buffer = window.Buffer || require("buffer").Buffer;

const addresses = ["0x0B76F2E7083c4FA0844d712A6018b42013Dc8Af7"];
const leaves = addresses.map((x) => keccak256(x));
const whiteListTree = new MerkleTree(leaves, keccak256, { sortPairs: true });

console.log(`WhiteList root: ${whiteListTree.getHexRoot()}`);

export default whiteListTree;
