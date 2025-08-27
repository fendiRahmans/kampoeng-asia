import { Button } from "@/components/ui/button";
import { Inertia } from "@inertiajs/inertia";

interface PaginationProps {
  data: {
    current_page: number;
    data: any[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  showInfo?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export default function Pagination({
  data,
  showInfo = true,
  className = "",
  size = "sm"
}: PaginationProps) {
  if (!data || data.last_page <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between mt-4 ${className}`}>
      {showInfo && (
        <div className="text-sm text-gray-700">
          Showing {data.from} to {data.to} of {data.total} results
        </div>
      )}

      <div className="flex space-x-1">
        {/* Previous Button */}
        {data.prev_page_url && (
          <Button
            variant="outline"
            size={size}
            onClick={() => Inertia.visit(data.prev_page_url!)}
          >
            Previous
          </Button>
        )}

        {/* Page Numbers */}
        {data.links.slice(1, -1).map((link, index) => (
          <Button
            key={index}
            variant={link.active ? "default" : "outline"}
            size={size}
            onClick={() => link.url && Inertia.visit(link.url)}
            disabled={!link.url}
          >
            {link.label.replace('&laquo;', '').replace('&raquo;', '')}
          </Button>
        ))}

        {/* Next Button */}
        {data.next_page_url && (
          <Button
            variant="outline"
            size={size}
            onClick={() => Inertia.visit(data.next_page_url!)}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
