import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export type LoadingUIProps = {
  title?: boolean;
  description?: boolean;
  cards?: number;
  type?: "dashboard" | "settings" | "form" | "table";
  className?: string;
};

export default function LoadingUI({
  title = true,
  description = true,
  cards = 1,
  type = "dashboard",
  className = "",
}: LoadingUIProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header section with title and description */}
      {title && (
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          {description && <Skeleton className="h-4 w-48" />}
        </div>
      )}

      {/* Dashboard type layout */}
      {type === "dashboard" && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 mb-4" />
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(cards).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full max-w-md" />
              <Skeleton className="h-4 w-full max-w-sm mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings/form type layout */}
      {type === "settings" && (
        <div className="space-y-4">
          {Array(cards).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-end gap-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      )}

      {/* Form type with just form fields */}
      {type === "form" && (
        <div className="space-y-4">
          <Card className="animate-pulse">
            <CardContent className="pt-6 space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table type loading */}
      {type === "table" && (
        <div className="space-y-4">
          <Card className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 