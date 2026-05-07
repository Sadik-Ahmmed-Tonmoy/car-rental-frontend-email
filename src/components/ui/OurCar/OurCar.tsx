"use client";
import React, { useState } from "react";
import ReusableCard from "../ReusableCard/ReusableCard";
import { useGetAllVehicleQuery } from "@/redux/features/vehicle/vehicleApi";
import { SkeletonCard } from "../SkeletonCard";
import { IVehicle } from "@/types/types";
import Link from "next/link";

const OurCar = () => {
  const [objectQuery] = useState<{ name: string; value: string | number }[]>([
    { name: "page", value: 1 },
    { name: "limit", value: 8 },
  ]);
  const { data: carData, isLoading } = useGetAllVehicleQuery(objectQuery);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="my-8 md:my-24">
      <p className="text-blue-primary text-lg font-semibold text-center ">
        Our Car
      </p>
      <h4 className="font-bold text-xl md:text-[44px] text-center">
        Click, Contact and Drive
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {carData?.data?.vehicles && carData?.data?.vehicles?.length > 0 ? (
          carData?.data?.vehicles?.map((car: IVehicle) => (
            <ReusableCard
              key={car.id}
              id={car.id}
              vehicleId={car.id}
              title={`${car.make} ${car.model}`}
              subtitle={`${car.model}, ${car.engineCapacityLitres}L, ${car.engineCapacityCc}cc, ${car.currentMilage} km`}
              tags={[car.engineSize]}
              price={`${car.minPrice} - ${car.maxPrice} €`}
              imageUrl={car.images[0] || "/placeholder.svg"}
              imageCount={car.images.length}
              currentImage={1}
              location={car?.user?.address || ""}
              distance="N/A"
              rating={0}
            />
          ))
        ) : (
          <div className="col-span-4 text-center text-gray-500">
            No vehicles found.
          </div>
        )}
      </div>

      <div className="flex items-center justify-center mt-6 md:mt-12">
        <Link href={"/vehicle/Car"}>
          <button className="border border-blue-primary text-blue-primary text-sm font-semibold px-6 py-2 rounded-4xl hover:bg-blue-primary hover:text-white transition-colors cursor-pointer">
            See More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OurCar;
