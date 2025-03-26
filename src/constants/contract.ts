import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";

export const contractAddress = "0xd12c5a06568e3d880c73166f011c87f644d8ca2f";
export const tokenAddress = "0x99019DC00929941e4d0fd4f1d556D1fF9F08b0A4";

export const contract = getContract({
    client: client,
    chain: sepolia,
    address: contractAddress
});

export const tokenContract = getContract({
    client: client,
    chain: sepolia,
    address: tokenAddress
});