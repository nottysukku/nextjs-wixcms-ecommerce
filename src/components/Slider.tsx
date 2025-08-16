"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    title: "Summer Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/",
    bg: "bg-gradient-to-r from-primary-50 to-amber-50 dark:from-primary-950 dark:to-amber-950",
  },
  {
    id: 2,
    title: "Winter Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
    url: "/",
    bg: "bg-gradient-to-r from-primary-50 to-slate-50 dark:from-primary-950 dark:to-slate-950",
  },
  {
    id: 3,
    title: "Spring Sale Collections",
    description: "Sale! Up to 50% off!",
    img: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800",
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
    <div className="h-[calc(100vh-80px)] overflow-hidden">
      <div
        className="w-max h-full flex transition-all ease-in-out duration-1000"
        style={{ transform: `translateX(-${current * 100}vw)` }}
      >
        {slides.map((slide) => (
          <div
            className={`${slide.bg} w-screen h-full flex flex-col gap-16 xl:flex-row`}
            key={slide.id}
          >
            {/* TEXT CONTAINER */}
            <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center px-8">
              <h2 className="text-xl lg:text-3xl 2xl:text-5xl text-primary-700 dark:text-primary-300 font-medium">
                {slide.description}
              </h2>
              <h1 className="text-5xl lg:text-6xl 2xl:text-8xl font-bold text-gray-900 dark:text-gray-100">
                {slide.title}
              </h1>
              <Link href={slide.url}>
                <button className="rounded-lg bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400 text-white py-4 px-8 text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
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
                sizes="100%"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute m-auto left-1/2 bottom-8 flex gap-4 transform -translate-x-1/2">
        {slides.map((slide, index) => (
          <div
            className={`w-3 h-3 rounded-full border-2 border-primary-600 dark:border-primary-400 cursor-pointer flex items-center justify-center transition-all duration-300 ${
              current === index ? "scale-125 bg-primary-600 dark:bg-primary-400" : "bg-white dark:bg-gray-800 hover:scale-110"
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
