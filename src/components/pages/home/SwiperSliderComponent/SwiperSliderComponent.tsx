import CarSlider from "@/components/ui/car-slider";
import { sampleCarsData } from "@/data/sampleCars";
import React from "react";


const SwiperSliderComponent = () => {
  return (
    <main className="">
      <CarSlider cars={sampleCarsData} />
    </main>
  );
};

export default SwiperSliderComponent;
