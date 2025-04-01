import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export function MarketCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <div className="animate-pulse">
                <CardHeader>
                    <Badge 
                        variant="secondary" 
                        className="mb-2 bg-muted h-4 w-full dark:bg-muted/50"
                    />
                    <CardTitle className="bg-muted h-6 w-1/3 dark:bg-muted/50" />
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="flex justify-between mb-2">
                            <span className="bg-muted h-4 w-1/4 dark:bg-muted/50" />
                            <span className="bg-muted h-4 w-1/4 dark:bg-muted/50" />
                        </div>
                        <Progress value={0} className="h-2 bg-muted dark:bg-muted/50" />
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}
