"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Filter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-12 flex justify-between flex-wrap gap-4">
      <div className="flex gap-4 flex-wrap">
        <select
          name="type"
          id=""
          className="py-2 px-4 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:outline-none transition-colors"
          onChange={handleFilterChange}
        >
          <option>Type</option>
          <option value="physical">Physical</option>
          <option value="digital">Digital</option>
        </select>
        <input
          type="text"
          name="min"
          placeholder="Min price"
          className="text-sm rounded-lg px-3 py-2 w-28 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none transition-colors"
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="max"
          placeholder="Max price"
          className="text-sm rounded-lg px-3 py-2 w-28 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none transition-colors"
          onChange={handleFilterChange}
        />
        {/* TODO: Filter Categories */}
        <select
          name="cat"
          className="py-2 px-4 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:outline-none transition-colors"
          onChange={handleFilterChange}
        >
          <option>Category</option>
          <option value="">New Arrival</option>
          <option value="">Popular</option>
        </select>
        <select
          name=""
          id=""
          className="py-2 px-4 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:outline-none transition-colors"
        >
          <option>All Filters</option>
        </select>
      </div>
      <div className="">
        <select
          name="sort"
          id=""
          className="py-2 px-4 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none transition-colors min-w-40"
          onChange={handleFilterChange}
        >
          <option>Sort By</option>
          <option value="asc price">Price (low to high)</option>
          <option value="desc price">Price (high to low)</option>
          <option value="asc lastUpdated">Newest</option>
          <option value="desc lastUpdated">Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
