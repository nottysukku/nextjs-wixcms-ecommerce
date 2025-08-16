"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Pagination = ({
  currentPage,
  hasPrev,
  hasNext,
}: {
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-12 flex justify-between w-full">
      <button
        className="rounded-lg bg-primary-600 text-white px-6 py-2 text-sm font-medium cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 hover:bg-primary-700 dark:hover:bg-primary-500 transition-colors duration-200"
        disabled={!hasPrev}
        onClick={() => createPageUrl(currentPage - 1)}
      >
        Previous
      </button>
      <button
        className="rounded-lg bg-primary-600 text-white px-6 py-2 text-sm font-medium cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 hover:bg-primary-700 dark:hover:bg-primary-500 transition-colors duration-200"
        disabled={!hasNext}
        onClick={() => createPageUrl(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
