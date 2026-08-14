import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const LoadingCard = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="mb-4 h-32 w-full rounded-lg" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </CardContent>
  </Card>
);

export const LoadingGrid = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <LoadingCard key={i} />
    ))}
  </div>
);

export const LoadingList = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 rounded-xl border border-border/70 p-4">
        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const LoadingSpinner = ({ label = "Carregando" }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-12" role="status" aria-label={label}>
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border-[3px] border-primary/15" />
      <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-primary" />
    </div>
    <span className="text-sm text-muted-foreground">{label}...</span>
  </div>
);

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ icon: Icon = Inbox, title, description, action, className }: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center",
      className,
    )}
  >
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-soft">
      <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
    </div>
    <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
    {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({
  title = "Algo deu errado",
  description = "Não foi possível carregar estas informações. Tente novamente.",
  onRetry,
  className,
}: ErrorStateProps) => (
  <div
    role="alert"
    className={cn(
      "flex flex-col items-center justify-center rounded-xl border border-destructive/25 bg-destructive/5 px-6 py-12 text-center",
      className,
    )}
  >
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
      <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
    </div>
    <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
    <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
    {onRetry && (
      <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        Tentar novamente
      </Button>
    )}
  </div>
);
