"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const SearchBar = () => {

  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    if(name){
      router.push(`/list?name=${name}`)
    }
  };

  return (
    <form
      className="flex items-center justify-between gap-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg flex-1 hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200"
      onSubmit={handleSearch}
    >
      <input
        type="text"
        name="name"
        placeholder="Search products..."
        className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <button className="cursor-pointer p-1 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-md transition-colors duration-200">
        <Image 
          src="/search.png" 
          alt="Search" 
          width={16} 
          height={16}
          className="dark:invert"
        />
      </button>
    </form>
  );
};

export default SearchBar;
