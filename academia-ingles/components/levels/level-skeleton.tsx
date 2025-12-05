import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LevelSkeleton() {
  return (
    <Card className="overflow-hidden border-none shadow-md h-full flex flex-col">
      <div className="h-3 w-full bg-gray-200" />
      <div className="p-6 flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="flex justify-center py-4">
           <Skeleton className="h-40 w-32 rounded-md" />
        </div>

        <div className="space-y-2 mt-auto">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </Card>
  );
}
