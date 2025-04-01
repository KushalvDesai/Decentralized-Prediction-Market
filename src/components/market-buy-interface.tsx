import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useRef, useEffect } from "react";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { prepareContractCall, readContract, toWei } from "thirdweb";
import { contract, tokenContract } from "@/constants/contract";
import { approve } from "thirdweb/extensions/erc20";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast"

// Types for the component props
interface MarketBuyInterfaceProps {
    marketId: number;
    market: {
        optionA: string;
        optionB: string;
        question: string;
    };
}

// Type aliases for better readability
type BuyingStep = 'initial' | 'allowance' | 'confirm';
type Option = 'A' | 'B' | null;

export function MarketBuyInterface({ marketId, market }: MarketBuyInterfaceProps) {
    // Blockchain interactions
    const account = useActiveAccount();
    const { mutateAsync: mutateTransaction } = useSendAndConfirmTransaction();
    const { toast } = useToast()

    // UI state management
    const [isBuying, setIsBuying] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [containerHeight, setContainerHeight] = useState('auto');
    const contentRef = useRef<HTMLDivElement>(null);

    // Transaction state
    const [selectedOption, setSelectedOption] = useState<Option>(null);
    const [amount, setAmount] = useState(0);
    const [buyingStep, setBuyingStep] = useState<BuyingStep>('initial');
    const [isApproving, setIsApproving] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    // Add to state variables
    const [error, setError] = useState<string | null>(null);

    // Update container height when content changes
    useEffect(() => {
        if (contentRef.current) {
            setTimeout(() => {
                setContainerHeight(`${contentRef.current?.offsetHeight || 0}px`);
            }, 0);
        }
    }, [isBuying, buyingStep, isVisible, error]);

    // Handlers for user interactions
    const handleBuy = (option: 'A' | 'B') => {
        setIsVisible(false);
        setTimeout(() => {
            setIsBuying(true);
            setSelectedOption(option);
            setIsVisible(true);
        }, 200); // Match transition duration
    };

    const handleCancel = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsBuying(false);
            setBuyingStep('initial');
            setSelectedOption(null);
            setAmount(0);
            setError(null);
            setIsVisible(true);
        }, 200);
    };

    // Check if user needs to approve token spending
    const checkApproval = async () => {
        if (amount <= 0) {
            setError("Amount must be greater than 0");
            return;
        }
        setError(null);

        try {
            const userAllowance = await readContract({
                contract: tokenContract,
                method: "function allowance(address owner, address spender) view returns (uint256)",
                params: [account?.address as string, contract.address]
            });

            setBuyingStep(userAllowance < BigInt(toWei(amount.toString())) ? 'allowance' : 'confirm');
        } catch (error) {
            console.error(error);
        }
    };

    // Handle token approval transaction
    const handleSetApproval = async () => {
        setIsApproving(true);
        try {
            const tx = await approve({
                contract: tokenContract,
                spender: contract.address,
                amount: amount
            });
            await mutateTransaction(tx);
            setBuyingStep('confirm');
        } catch (error) {
            console.error(error);
        } finally {
            setIsApproving(false);
        }
    };

    // Handle share purchase transaction
    const handleConfirm = async () => {
        if (!selectedOption || amount <= 0) {
            setError("Must select an option and enter an amount greater than 0");
            return;
        }

        setIsConfirming(true);
        try {
            const tx = await prepareContractCall({
                contract,
                method: "function buyShares(uint256 _marketId, bool _isOptionA, uint256 _amount)",
                params: [BigInt(marketId), selectedOption === 'A', BigInt(toWei(amount.toString()))]
            });
            await mutateTransaction(tx);
            
            // Show success toast
            toast({
                title: "Purchase Successful!",
                description: `You bought ${amount} ${selectedOption === 'A' ? market.optionA : market.optionB} shares`,
                duration: 5000, // 5 seconds
            })
            
            handleCancel();
        } catch (error) {
            console.error(error);
            // Optionally show error toast
            toast({
                title: "Purchase Failed",
                description: "There was an error processing your purchase",
                variant: "destructive",
            })
        } finally {
            setIsConfirming(false);
        }
    };

    // Render the component
    return (
        <div 
            className="relative transition-[height] duration-200 ease-in-out overflow-hidden" 
            style={{ height: containerHeight }}
        >
            <div 
                ref={contentRef}
                className={cn(
                    "w-full transition-all duration-200 ease-in-out",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
            >
                {!isBuying ? (
                    // Initial option selection buttons
                    <div className="flex justify-between gap-4 mb-4">
                        <Button 
                            className="flex-1" 
                            onClick={() => handleBuy('A')}
                            aria-label={`Vote ${market.optionA} for "${market.question}"`}
                            disabled={!account}
                        >
                            {market.optionA}
                        </Button>
                        <Button 
                            className="flex-1"
                            onClick={() => handleBuy('B')}
                            aria-label={`Vote ${market.optionB} for "${market.question}"`}
                            disabled={!account}
                        >
                            {market.optionB}
                        </Button>
                    </div>
                ) : (
                    // Buy interface with different steps
                    <div className="flex flex-col mb-4">
                        {buyingStep === 'allowance' ? (
                            // Approval step
                            <div className="flex flex-col border-2 border-border rounded-lg p-4">
                                <h2 className="text-lg font-bold mb-4 text-foreground">Approval Needed</h2>
                                <p className="mb-4 text-muted-foreground">You need to approve the transaction before proceeding.</p>
                                <div className="flex justify-end">
                                    <Button 
                                        onClick={handleSetApproval} 
                                        className="mb-2"
                                        disabled={isApproving}
                                    >
                                        {isApproving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Approving...
                                            </>
                                        ) : (
                                            'Set Approval'
                                        )}
                                    </Button>
                                    <Button 
                                        onClick={handleCancel} 
                                        className="ml-2" 
                                        variant="outline"
                                        disabled={isApproving}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : buyingStep === 'confirm' ? (
                            // Confirmation step
                            <div className="flex flex-col border-2 border-border rounded-lg p-4">
                                <h2 className="text-lg font-bold mb-4 text-foreground">Confirm Transaction</h2>
                                <p className="mb-4 text-muted-foreground">
                                    You are about to buy <span className="font-bold text-foreground">
                                        {amount} {selectedOption === 'A' ? market.optionA : market.optionB}
                                    </span> share(s).
                                </p>
                                <div className="flex justify-end">
                                    <Button 
                                        onClick={handleConfirm} 
                                        className="mb-2"
                                        disabled={isConfirming}
                                    >
                                        {isConfirming ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Confirming...
                                            </>
                                        ) : (
                                            'Confirm'
                                        )}
                                    </Button>
                                    <Button 
                                        onClick={handleCancel} 
                                        className="ml-2" 
                                        variant="outline"
                                        disabled={isConfirming}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Initial buy step
                            <div className="flex flex-col border-2 border-border rounded-lg p-4">
                                <h2 className="text-lg font-bold mb-4 text-foreground">
                                    Buy {selectedOption === 'A' ? market.optionA : market.optionB} Shares
                                </h2>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label htmlFor="amount" className="block text-sm font-medium text-muted-foreground mb-1">
                                            Amount
                                        </label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                            className="w-full"
                                            min="0"
                                        />
                                    </div>
                                    {error && (
                                        <p className="text-sm text-destructive">{error}</p>
                                    )}
                                    <div className="flex justify-end">
                                        <Button 
                                            onClick={checkApproval}
                                            className="mb-2"
                                            disabled={amount <= 0}
                                        >
                                            Next
                                        </Button>
                                        <Button 
                                            onClick={handleCancel} 
                                            className="ml-2" 
                                            variant="outline"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
