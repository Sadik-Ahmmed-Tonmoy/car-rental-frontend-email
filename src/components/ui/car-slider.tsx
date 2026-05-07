"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ReusableCard from "./ReusableCard/ReusableCard";

interface CarData {
  id: string;
  title: string;
  subtitle: string;
  features: string;
  price: string;
  imageUrl: string;
  imageCount: number;
  currentImage: number;
  tags: string[];
  location: string;
  distance: string;
  rating: number;
}

interface CarSliderProps {
  title?: string;
  cars: CarData[];
}

export default function CarSlider({
  title = "Your recently viewed items",
  cars,
}: CarSliderProps) {
  const [likedCars, setLikedCars] = useState<Set<string>>(new Set());

  const handleLike = (carId: string) => {
    setLikedCars((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(carId)) {
        newSet.delete(carId);
      } else {
        newSet.add(carId);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full  mx-auto py-8">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 text-wrap">{title}</h2>

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination-custom",
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          autoplay
          loop={true}
          className="pb-12"
        >
          {cars.map((car) => (
            <SwiperSlide key={car.id} className="mb-2">
              <ReusableCard
                {...car}
                isLiked={likedCars.has(car.id)}
                onLike={handleLike}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="flex justify-center items-center gap-4 md:gap-6 mt-6  w-min mx-auto">
          <button className="swiper-button-prev-custom w-10 h-10 bg-black hover:bg-blue-primary text-white rounded-full flex items-center justify-center cursor-pointer transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button className="swiper-button-next-custom w-10 h-10 bg-black hover:bg-blue-primary text-white rounded-full flex items-center justify-center cursor-pointer transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
