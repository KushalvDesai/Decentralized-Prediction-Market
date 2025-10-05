"use client";

import { useState, useEffect } from "react";
import { useReadContract, useActiveAccount } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract } from "@/constants/contract";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Calendar, Users, TrendingUp, Settings, Shield, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminDashboard() {
  const { toast } = useToast();
  const { mutate: sendTransaction } = useSendTransaction();
  const router = useRouter();
  const account = useActiveAccount();

  // State for form inputs
  const [selectedMarketId, setSelectedMarketId] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [createMarketForm, setCreateMarketForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    duration: "",
  });
  const [resolveForm, setResolveForm] = useState({
    marketId: "",
    outcome: "",
  });

  // Owner check hook
  const { data: contractOwner, isPending: isOwnerPending } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  // Contract read hooks
  const { data: marketCount, isPending: isMarketCountPending } = useReadContract({
    contract,
    method: "function marketCount() view returns (uint256)",
    params: [],
  });

  const { data: marketInfo, isPending: isMarketInfoPending } = useReadContract({
    contract,
    method:
      "function getMarketInfo(uint256 _marketid) view returns (string _question, string _optionA, string _optionB, uint256 endTime, uint8 outcome, uint256 totalOptionAShares, uint256 totalOptionBShares, bool resolved)",
    params: selectedMarketId ? [BigInt(selectedMarketId)] : undefined,
  });

  const { data: sharesBalance, isPending: isSharesBalancePending } = useReadContract({
    contract,
    method:
      "function getSharesBalance(uint256 _marketId, address _user) view returns (uint256 optionA, uint256 optionB)",
    params: selectedMarketId && userAddress ? [BigInt(selectedMarketId), userAddress] : undefined,
  });

  const { data: marketDetails, isPending: isMarketDetailsPending } = useReadContract({
    contract,
    method:
      "function markets(uint256) view returns (string question, uint256 endTime, uint8 outcome, string Option_A, string Option_B, uint256 totaloptionAshares, uint256 totaloptionBshares, bool resolved)",
    params: selectedMarketId ? [BigInt(selectedMarketId)] : undefined,
  });

  // Access control check
  useEffect(() => {
    if (!isOwnerPending && contractOwner && account?.address) {
      if (contractOwner.toLowerCase() !== account.address.toLowerCase()) {
        toast({
          title: "Access Denied",
          description: "Only the contract owner can access the admin dashboard",
          variant: "destructive",
        });
        router.push("/");
      }
    }
  }, [contractOwner, account?.address, isOwnerPending, router, toast]);

  // Show loading while checking owner
  if (isOwnerPending || !account) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-lg font-medium">Verifying admin access...</p>
            <p className="text-sm text-muted-foreground text-center">
              Please ensure you're connected with the contract owner account
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show unauthorized message if not owner
  if (contractOwner && account?.address && contractOwner.toLowerCase() !== account.address.toLowerCase()) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 pt-6">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Access Denied</h3>
              <p className="text-sm text-muted-foreground">
                Only the contract owner can access the admin dashboard
              </p>
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-xs font-mono break-all">
                  <strong>Contract Owner:</strong><br />
                  {contractOwner}
                </p>
                <p className="text-xs font-mono break-all mt-2">
                  <strong>Your Address:</strong><br />
                  {account.address}
                </p>
              </div>
            </div>
            <Button 
              onClick={() => router.push("/")}
              className="w-full"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create Market function
  const handleCreateMarket = () => {
    if (!createMarketForm.question || !createMarketForm.optionA || !createMarketForm.optionB || !createMarketForm.duration) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const transaction = prepareContractCall({
      contract,
      method:
        "function createMarket(string _question, string _Option_A, string _Option_B, uint256 _duration) returns (uint256)",
      params: [
        createMarketForm.question,
        createMarketForm.optionA,
        createMarketForm.optionB,
        BigInt(createMarketForm.duration),
      ],
    });

    sendTransaction(transaction, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Market created successfully!",
        });
        setCreateMarketForm({
          question: "",
          optionA: "",
          optionB: "",
          duration: "",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to create market",
          variant: "destructive",
        });
        console.error(error);
      },
    });
  };

  // Resolve Market function
  const handleResolveMarket = () => {
    if (!resolveForm.marketId || !resolveForm.outcome) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const transaction = prepareContractCall({
      contract,
      method: "function resolveMarket(uint256 _marketId, uint8 _outcome)",
      params: [BigInt(resolveForm.marketId), parseInt(resolveForm.outcome)],
    });

    sendTransaction(transaction, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Market resolved successfully!",
        });
        setResolveForm({
          marketId: "",
          outcome: "",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to resolve market",
          variant: "destructive",
        });
        console.error(error);
      },
    });
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const getOutcomeText = (outcome: number) => {
    switch (outcome) {
      case 0:
        return "Pending";
      case 1:
        return "Option A Wins";
      case 2:
        return "Option B Wins";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Contract Owner
          </Badge>
        </div>
      </div>

      {/* Market Count Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isMarketCountPending ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              `${marketCount?.toString() || "0"} Total Markets`
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="view" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="view">View Markets</TabsTrigger>
          <TabsTrigger value="create">Create Market</TabsTrigger>
          <TabsTrigger value="resolve">Resolve Market</TabsTrigger>
          <TabsTrigger value="shares">Check Shares</TabsTrigger>
        </TabsList>

        {/* View Market Information */}
        <TabsContent value="view" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Market ID</label>
                <Input
                  type="number"
                  placeholder="Enter market ID"
                  value={selectedMarketId}
                  onChange={(e) => setSelectedMarketId(e.target.value)}
                />
              </div>

              {selectedMarketId && (
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Market Info from getMarketInfo */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Market Details (getMarketInfo)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isMarketInfoPending ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : marketInfo ? (
                        <div className="space-y-2">
                          <p><strong>Question:</strong> {marketInfo[0]}</p>
                          <p><strong>Option A:</strong> {marketInfo[1]}</p>
                          <p><strong>Option B:</strong> {marketInfo[2]}</p>
                          <p><strong>End Time:</strong> {formatDate(marketInfo[3])}</p>
                          <p><strong>Outcome:</strong> 
                            <Badge className="ml-2">{getOutcomeText(marketInfo[4])}</Badge>
                          </p>
                          <p><strong>Option A Shares:</strong> {marketInfo[5]?.toString()}</p>
                          <p><strong>Option B Shares:</strong> {marketInfo[6]?.toString()}</p>
                          <p><strong>Resolved:</strong> 
                            <Badge variant={marketInfo[7] ? "default" : "secondary"} className="ml-2">
                              {marketInfo[7] ? "Yes" : "No"}
                            </Badge>
                          </p>
                        </div>
                      ) : (
                        <p>Market not found or invalid ID</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Market Details from markets mapping */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Market Details (markets mapping)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isMarketDetailsPending ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : marketDetails ? (
                        <div className="space-y-2">
                          <p><strong>Question:</strong> {marketDetails[0]}</p>
                          <p><strong>End Time:</strong> {formatDate(marketDetails[1])}</p>
                          <p><strong>Outcome:</strong> 
                            <Badge className="ml-2">{getOutcomeText(marketDetails[2])}</Badge>
                          </p>
                          <p><strong>Option A:</strong> {marketDetails[3]}</p>
                          <p><strong>Option B:</strong> {marketDetails[4]}</p>
                          <p><strong>Option A Shares:</strong> {marketDetails[5]?.toString()}</p>
                          <p><strong>Option B Shares:</strong> {marketDetails[6]?.toString()}</p>
                          <p><strong>Resolved:</strong> 
                            <Badge variant={marketDetails[7] ? "default" : "secondary"} className="ml-2">
                              {marketDetails[7] ? "Yes" : "No"}
                            </Badge>
                          </p>
                        </div>
                      ) : (
                        <p>Market not found or invalid ID</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Market */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Create New Market
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Question</label>
                <Input
                  placeholder="Enter market question"
                  value={createMarketForm.question}
                  onChange={(e) =>
                    setCreateMarketForm({ ...createMarketForm, question: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Option A</label>
                  <Input
                    placeholder="Enter option A"
                    value={createMarketForm.optionA}
                    onChange={(e) =>
                      setCreateMarketForm({ ...createMarketForm, optionA: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Option B</label>
                  <Input
                    placeholder="Enter option B"
                    value={createMarketForm.optionB}
                    onChange={(e) =>
                      setCreateMarketForm({ ...createMarketForm, optionB: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration (in seconds)</label>
                <Input
                  type="number"
                  placeholder="Enter duration in seconds"
                  value={createMarketForm.duration}
                  onChange={(e) =>
                    setCreateMarketForm({ ...createMarketForm, duration: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleCreateMarket} className="w-full">
                Create Market
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resolve Market */}
        <TabsContent value="resolve">
          <Card>
            <CardHeader>
              <CardTitle>Resolve Market</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Market ID</label>
                <Input
                  type="number"
                  placeholder="Enter market ID to resolve"
                  value={resolveForm.marketId}
                  onChange={(e) =>
                    setResolveForm({ ...resolveForm, marketId: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Outcome</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={resolveForm.outcome}
                  onChange={(e) =>
                    setResolveForm({ ...resolveForm, outcome: e.target.value })
                  }
                >
                  <option value="">Select outcome</option>
                  <option value="1">Option A Wins</option>
                  <option value="2">Option B Wins</option>
                </select>
              </div>
              <Button onClick={handleResolveMarket} className="w-full">
                Resolve Market
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Check Shares Balance */}
        <TabsContent value="shares">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Check User Shares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Market ID</label>
                <Input
                  type="number"
                  placeholder="Enter market ID"
                  value={selectedMarketId}
                  onChange={(e) => setSelectedMarketId(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">User Address</label>
                <Input
                  placeholder="Enter user address"
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                />
              </div>

              {selectedMarketId && userAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Shares Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSharesBalancePending ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : sharesBalance ? (
                      <div className="space-y-2">
                        <p><strong>Option A Shares:</strong> {sharesBalance[0]?.toString()}</p>
                        <p><strong>Option B Shares:</strong> {sharesBalance[1]?.toString()}</p>
                      </div>
                    ) : (
                      <p>No shares found or invalid parameters</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}