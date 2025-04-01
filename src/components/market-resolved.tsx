import { Button } from "./ui/button";
import { prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { contract } from "@/constants/contract";
import { useToast } from "@/components/ui/use-toast";

interface MarketResolvedProps {
    marketId: number;
    outcome: number;
    optionA: string;
    optionB: string;
}

export function MarketResolved({ 
    marketId,
    outcome, 
    optionA, 
    optionB
}: MarketResolvedProps) {
    const { mutateAsync: mutateTransaction } = useSendAndConfirmTransaction();
    const { toast } = useToast();

    const handleClaimRewards = async () => {
        try {
            const tx = await prepareContractCall({
                contract,
                method: "function ClaimWinning(uint256 _marketId)",
                params: [BigInt(marketId)],
            });
    
            await mutateTransaction(tx);
            toast({
                title: "Claim successful! 🥳",
                description: "Your rewards have been claimed.",
            });
        } catch (error: any) {
            console.error("Claim failed:", error);
    
            // Extract a meaningful message from the error object
            const reason =
                error?.reason ||
                error?.message ||
                (error?.cause && error.cause.reason) ||
                "Execution reverted";
    
            // Display a friendly message
            toast({
                title: "Claim failed",
                description: reason,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="mb-2 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 p-2 rounded-md text-center text-xs text-emerald-700 dark:text-emerald-300">
                Resolved: {outcome === 0 ? optionA : optionB}
            </div>
            <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleClaimRewards}
            >
                Claim Rewards
            </Button>
        </div>
    );
}
