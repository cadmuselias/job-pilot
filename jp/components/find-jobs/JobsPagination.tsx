"use client";

interface JobsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function JobsPagination({
  currentPage,
  totalPages,
  totalResults,
  pageSize,
  onPageChange,
}: JobsPaginationProps) {
  const startItem = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalResults);

  // Generate page numbers with ellipsis matching design (1, 2, 3 ... 8)
  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (currentPage <= 3) {
      pages.push(1, 2, 3);
      if (totalPages > 4) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("ellipsis");
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1);
      pages.push("ellipsis");
      pages.push(currentPage);
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface">
      {/* Results counter text */}
      <div className="text-sm text-text-secondary">
        Showing{" "}
        <span className="font-semibold text-text-primary">{startItem}</span> to{" "}
        <span className="font-semibold text-text-primary">{endItem}</span> of{" "}
        <span className="font-semibold text-text-primary">{totalResults}</span>{" "}
        results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="border border-border bg-surface hover:bg-surface-secondary text-text-secondary disabled:text-text-muted disabled:hover:bg-surface text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shadow-2xs"
        >
          Previous
        </button>

        {/* Page Buttons */}
        <div className="flex items-center gap-1.5">
          {visiblePages.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="text-text-muted px-1.5 py-1.5 text-sm select-none"
                >
                  ...
                </span>
              );
            }

            const pageNumber = Number(page);
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={`text-sm rounded-lg px-3 py-1.5 transition-colors cursor-pointer shadow-2xs ${
                  isActive
                    ? "border border-accent text-accent bg-accent-muted/40 font-semibold"
                    : "border border-border bg-surface hover:bg-surface-secondary text-text-primary font-medium"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="border border-border bg-surface hover:bg-surface-secondary text-text-primary disabled:text-text-muted disabled:hover:bg-surface text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shadow-2xs"
        >
          Next
        </button>
      </div>
    </div>
  );
}
