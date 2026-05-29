"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "Summer Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "/summer.png",
    url: "/",
    bg: "bg-gradient-to-r from-primary-50 to-amber-50 dark:from-primary-950 dark:to-amber-950",
  },
  {
    id: 2,
    title: "Winter Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "/winter.png",
    url: "/",
    bg: "bg-gradient-to-r from-primary-50 to-slate-50 dark:from-primary-950 dark:to-slate-950",
  },
  {
    id: 3,
    title: "Spring Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "/spring.png",
    url: "/",
    bg: "bg-gradient-to-r from-emerald-50 to-primary-50 dark:from-emerald-950 dark:to-primary-950",
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[300px] sm:h-[400px] md:h-[550px] lg:h-[calc(100vh-80px)] overflow-hidden relative">
      <div
        className="w-max h-full flex transition-all ease-in-out duration-1000"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => (
          <div
            className={`${slide.bg} w-screen h-full flex flex-col xl:flex-row`}
            key={slide.id}
          >
            {/* TEXT CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-2 sm:gap-6 lg:gap-8 text-center px-4 sm:px-8 py-3 xl:py-0">
              <h2 className="text-xs sm:text-lg lg:text-3xl 2xl:text-5xl text-primary-700 dark:text-primary-300 font-medium">
                {slide.description}
              </h2>
              <h1 className="text-lg sm:text-3xl lg:text-6xl 2xl:text-8xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {slide.title}
              </h1>
              <Link href={slide.url}>
                <button className="rounded-lg bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 text-white py-1.5 px-4 sm:py-3 sm:px-6 lg:py-4 lg:px-8 text-[10px] sm:text-sm lg:text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-md">
                  SHOP NOW
                </button>
              </Link>
            </div>
            {/* IMAGE CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full relative">
              <Image
                src={slide.img}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute m-auto left-1/2 bottom-2 sm:bottom-8 flex gap-3 transform -translate-x-1/2">
        {slides.map((slide, index) => (
          <div
            className={`w-2.5 h-2.5 rounded-full border border-primary-600 dark:border-primary-400 cursor-pointer flex items-center justify-center transition-all duration-300 ${
              current === index ? "scale-110 bg-primary-600 dark:bg-primary-400" : "bg-white dark:bg-gray-800 hover:scale-105"
            }`}
            key={slide.id}
            onClick={() => setCurrent(index)}
          >
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
