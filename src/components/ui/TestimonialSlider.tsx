"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import TestimonialCard from "./testimonial-card";
import person from "@/assets/images/Human.png"

const testimonials = [
  {
    id: 1,
    rating: 4,
    review:
      "Renting a car from nova ride was a great decision. Not only did I get a reliable and comfortable vehicle, but the prices were also very competitive.",
    userName: "Alis White",
    userTitle: "Project Manager",
    userImage: person,
  },
  {
    id: 2,
    rating: 5,
    review:
      "Excellent service and amazing customer support. The booking process was seamless and the car was in perfect condition. Highly recommended!",
    userName: "Sarah Johnson",
    userTitle: "Marketing Director",
    userImage: person,
  },
  {
    id: 3,
    rating: 5,
    review:
      "I've used nova ride multiple times and they never disappoint. Great fleet of vehicles and competitive pricing. Will definitely use again.",
    userName: "Michael Chen",
    userTitle: "Software Engineer",
    userImage: person,
  },
  {
    id: 3,
    rating: 5,
    review:
      "I've used nova ride multiple times and they never disappoint. Great fleet of vehicles and competitive pricing. Will definitely use again.",
    userName: "Michael Chen",
    userTitle: "Software Engineer",
    userImage: person,
  },
  {
    id: 3,
    rating: 5,
    review:
      "I've used nova ride multiple times and they never disappoint. Great fleet of vehicles and competitive pricing. Will definitely use again.",
    userName: "Michael Chen",
    userTitle: "Software Engineer",
    userImage: person,
  },
];



import type { StaticImageData } from "next/image";

interface TestimonialCardProps {
  rating: number;
  maxRating?: number;
  review: string;
  userName: string;
  userTitle: string;
  userImage: StaticImageData;
  className?: string;
}

export default function TestimonialSlider() {
  return (
    <div className="w-full  mx-auto py-8">
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
          {testimonials.map((testimonial: TestimonialCardProps, i: number) => (
            <SwiperSlide key={i} className="mb-2">
              <TestimonialCard {...testimonial} />
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
