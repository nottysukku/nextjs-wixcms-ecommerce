"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoryListClient = ({ categories }: { categories: any[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    // Initial check for scroll buttons
    checkScrollButtons();
    
    // Add resize listener to recheck when window size changes
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [categories]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300); // Check after animation
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300); // Check after animation
    }
  };

  return (
    <div className="relative px-4">
      {/* Left Navigation Button */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Right Navigation Button */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      )}

      {/* Categories Container */}
      <div 
        ref={scrollRef}
        className="overflow-x-scroll scrollbar-hide"
        onScroll={checkScrollButtons}
      >
        <div className="flex gap-4 md:gap-8 pb-2">
          {categories.map((item) => (
            <Link
              href={`/list?cat=${item.slug}`}
              className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6 group"
              key={item._id}
            >
              <div className="relative bg-slate-100 w-full h-96 rounded-lg overflow-hidden">
                <Image
                  src={item.media?.mainMedia?.image?.url || "/category.png"}
                  alt={item.name || "Category"}
                  fill
                  sizes="20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
              <h1 className="mt-4 font-light text-xl tracking-wide text-center group-hover:text-gray-600 transition-colors">
                {item.name}
              </h1>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryListClient;
