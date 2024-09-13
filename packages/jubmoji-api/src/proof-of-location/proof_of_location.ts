import { ZKP, ZKPInputs } from "babyjubjub-ecdsa";
const snarkjs = require("snarkjs");

/**
 * Generate a location ZKP
 * @param proofInputs - The inputs to the location proof circuit
 * @param pathToCircuits - The path to the circuits directory. Only required for server side proving
 * @returns - The location ZKP
 */
export const GenerateLocationProof = async (
    proofInputs: ZKPInputs,
    pathToLocationCircuits: string
): Promise<ZKP> => {
    const wasmPath = pathToLocationCircuits + "proof_of_location.wasm"
    const zkeyPath = pathToLocationCircuits + "proof_of_location.zkey"

    const proof = await snarkjs.groth16.fullProve(
        proofInputs,
        wasmPath,
        zkeyPath
    );
    
      return proof;
};

/**
 * Verifies a location ZKP
 * @param vkey - The verification key for the location proof
 * @param proof - The ZKP to verify
 * @param publicInputs - The public inputs to the zero knowledge proof
 * @returns - A boolean indicating whether or not the proof is valid
 */
export const verifyLocationZKP = async (
    pathToLocationCircuits: string,
    { proof, publicSignals }: ZKP
  ): Promise<boolean> => {
    const vkeyPath = pathToLocationCircuits + "verification_key.json"
    return await snarkjs.groth16.verify(vkeyPath, publicSignals, proof);
  };