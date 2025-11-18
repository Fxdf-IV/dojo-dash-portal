import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const LoadingCard = () => (
  <Card className="border-primary/20">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-32 w-full mb-4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mt-2" />
    </CardContent>
  </Card>
);

export const LoadingGrid = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
);

export const LoadingList = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12" role="status" aria-label="Carregando">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
  </div>
);
