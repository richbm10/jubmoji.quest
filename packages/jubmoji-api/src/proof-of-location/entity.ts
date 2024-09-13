import { buildPoseidon } from "circomlibjs";

// Async function to initialize Poseidon hash function
let poseidon: any;

async function initializePoseidon() {
    if (!poseidon) {
        poseidon = await buildPoseidon();
    }
}

// Function to hash an element using Poseidon
export async function poseidonHash(data: string): Promise<string> {
    await initializePoseidon();

    // Convert string to BigInt for Poseidon hash input
    const input = BigInt("0x" + Buffer.from(data).toString('hex'));
    const hash = poseidon([input]);

    // Convert Poseidon hash output to a hex string
    return poseidon.F.toString(hash, 16);
}

// Merkle Tree Node
export class MerkleNode {
    public hash: string;
    public left: MerkleNode | null;
    public right: MerkleNode | null;
    public element: string | null;

    constructor(hash: string, left: MerkleNode | null = null, right: MerkleNode | null = null, element: string | null = null) {
        this.left = left;
        this.right = right;
        this.element = element;
        this.hash = hash;
    }

    // Static async method to create a node and handle the async Poseidon hash
    public static async create(left: MerkleNode | null = null, right: MerkleNode | null = null, element: string | null = null): Promise<MerkleNode> {
        let hash: string;

        if (element) {
            // If it's a leaf, hash the element using Poseidon
            hash = await poseidonHash(element);
        } else if (left && right) {
            // If it's an internal node, hash the concatenated child hashes
            hash = await poseidonHash(left.hash + right.hash);
        } else {
            throw new Error("No data to create the node");
        }

        return new MerkleNode(hash, left, right, element);
    }
}

// Builder for the Merkle Tree
export class MerkleTreeBuilder {
    private leaves: MerkleNode[] = [];

    // Add a leaf (element) to the tree
    async addLeaf(element: string): Promise<void> {
        const node = await MerkleNode.create(null, null, element);
        this.leaves.push(node);
    }

    // Build the Merkle tree and return the root
    async build(): Promise<MerkleNode> {
        if (this.leaves.length === 0) {
            throw new Error("No leaves to build the Merkle Tree");
        }

        let nodes = this.leaves.slice();

        // If the number of nodes is odd, duplicate the last leaf
        if (nodes.length % 2 !== 0) {
            nodes.push(nodes[nodes.length - 1]);
        }

        // Combine nodes two by two until we get the root
        while (nodes.length > 1) {
            const newLevel: MerkleNode[] = [];

            for (let i = 0; i < nodes.length; i += 2) {
                const left = nodes[i];
                const right = nodes[i + 1];
                const newNode = await MerkleNode.create(left, right);
                newLevel.push(newNode);
            }

            // If the new level has an odd number of nodes, duplicate the last one
            if (newLevel.length % 2 !== 0) {
                newLevel.push(newLevel[newLevel.length - 1]);
            }

            nodes = newLevel;
        }

        // The last remaining node is the root
        return nodes[0];
    }
}

// Main class that manages the Merkle Tree
export class MerkleTree {
    private merkleRoot: string | null = null;
    private builder: MerkleTreeBuilder;

    constructor() {
        this.builder = new MerkleTreeBuilder();
    }

    // Add a leaf to the tree via the builder
    async addLeaf(element: string): Promise<void> {
        await this.builder.addLeaf(element);
    }

    // Build the tree and get the Merkle root
    async build(): Promise<string> {
        const root = await this.builder.build();
        this.merkleRoot = root.hash;
        return this.merkleRoot;
    }

    // Check if a hash is present in the tree (query)
    async query(element: string): Promise<boolean> {
        const elementHash = await poseidonHash(element);

        // Traverse the tree from the root to verify if the hash is present
        const search = async (node: MerkleNode | null): Promise<boolean> => {
            if (!node) return false;
            if (node.hash === elementHash) return true;
            return await search(node.left) || await search(node.right);
        };

        return await search(await this.builder.build());
    }
}

// Example usage
async function runMerkleTreeExample() {
    const merkleTree = new MerkleTree();
    await merkleTree.addLeaf("leaf1");
    await merkleTree.addLeaf("leaf2");
    await merkleTree.addLeaf("leaf3");
    await merkleTree.addLeaf("leaf4");

    const merkleRoot = await merkleTree.build();
    console.log(`Merkle Root: ${merkleRoot}`);

    // Query if an element is in the tree
    console.log(`Query leaf2: ${await merkleTree.query('leaf2')}`); // true
    console.log(`Query leaf5: ${await merkleTree.query('leaf5')}`); // false
}

runMerkleTreeExample();