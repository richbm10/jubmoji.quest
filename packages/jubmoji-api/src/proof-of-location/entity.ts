import * as crypto from 'crypto';

// Function to hash an element using SHA-256
function sha256(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

// Node of the Merkle tree
class MerkleNode {
    public hash: string;
    public left: MerkleNode | null;
    public right: MerkleNode | null;
    public element: string | null;

    constructor(left: MerkleNode | null = null, right: MerkleNode | null = null, element: string | null = null) {
        this.left = left;
        this.right = right;
        this.element = element;

        // If it is a leaf, hash the element; otherwise, hash the hashes of the children
        if (element) {
            this.hash = sha256(element);
        } else if (left && right) {
            this.hash = sha256(left.hash + right.hash);
        } else {
            throw new Error("No data to create the node");
        }
    }
}

// Builder for the Merkle tree
class MerkleTreeBuilder {
    private leaves: MerkleNode[] = [];

    // Add a leaf (element) to the tree
    addLeaf(element: string): void {
        const node = new MerkleNode(null, null, element);
        this.leaves.push(node);
    }

    // Build the Merkle tree and return the root
    build(): MerkleNode {
        if (this.leaves.length === 0) {
            throw new Error("No leaves to build the Merkle tree");
        }

        let nodes = this.leaves.slice();

        // If the number of nodes is odd, duplicate the last leaf
        if (nodes.length % 2 !== 0) {
            nodes.push(nodes[nodes.length - 1]);
        }

        // Combine nodes in pairs until obtaining the root
        while (nodes.length > 1) {
            const newLevel: MerkleNode[] = [];

            for (let i = 0; i < nodes.length; i += 2) {
                const left = nodes[i];
                const right = nodes[i + 1];
                const newNode = new MerkleNode(left, right);
                newLevel.push(newNode);
            }

            // If the new level has an odd number of nodes, duplicate the last one
            if (newLevel.length % 2 !== 0) {
                newLevel.push(newLevel[newLevel.length - 1]);
            }

            nodes = newLevel;
        }

        // The last node remaining is the root
        return nodes[0];
    }
}

// Main class that manages the Merkle tree
class MerkleTree {
    private merkleRoot: string | null = null;
    private builder: MerkleTreeBuilder;

    constructor() {
        this.builder = new MerkleTreeBuilder();
    }

    // Add a leaf to the tree through the builder
    addLeaf(element: string): void {
        this.builder.addLeaf(element);
    }

    // Build the tree and get the Merkle root
    build(): string {
        const root = this.builder.build();
        this.merkleRoot = root.hash;
        return this.merkleRoot;
    }

    // Check if a hash is present in the tree (search)
    query(element: string): boolean {
        const elementHash = sha256(element);

        // Traverse the tree from the root to check if the hash is present
        const search = (node: MerkleNode | null): boolean => {
            if (!node) return false;
            if (node.hash === elementHash) return true;
            return search(node.left) || search(node.right);
        };

        return search(this.builder.build());
    }
}

// Example usage
const merkleTree = new MerkleTree();
merkleTree.addLeaf("leaf1");
merkleTree.addLeaf("leaf2");
merkleTree.addLeaf("leaf3");
merkleTree.addLeaf("leaf4");

const merkleRoot = merkleTree.build();
console.log(`Merkle Root: ${merkleRoot}`);

// Query if an element is in the tree
console.log(`Query leaf2: ${merkleTree.query('leaf2')}`); // true
console.log(`Query leaf5: ${merkleTree.query('leaf5')}`); // false