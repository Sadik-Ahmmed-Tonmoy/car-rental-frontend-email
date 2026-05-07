"use client";

import { IVehicle } from "@/types/types";
import ListCard from "./ListCard";
import { SkeletonCard } from "./SkeletonCard";

interface GridViewProps {
  allVehicle: IVehicle[] | undefined;
  isLoading: boolean;
  isFetching?: boolean;
}

export default function CarListView({ allVehicle, isLoading, isFetching }: GridViewProps) {
  if (isLoading || isFetching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-4 lg:space-y-6 mt-5">
      {allVehicle &&
        allVehicle?.length > 0 &&
        allVehicle?.map((car) => (
          <ListCard
            key={car.id}
            id={car.id}
            vehicleId={car.id}
            title={`${car.make} ${car.model}`}
            subtitle={`${car.model}, ${car.engineCapacityLitres}L, ${car.engineCapacityCc}cc, ${car.currentMilage} km`}
            tags={[car.engineSize]}
            price={car.priceRange}
            imageUrl={car.images[0] || "/placeholder.svg"}
            imageCount={car.images.length}
            currentImage={1}
            location={car?.user?.address || ""}
            distance="N/A"
            rating={0}
            mileage={car.currentMilage}
            transmission={car.transmission || "N/A"}
            fuelType={car.fuelType}
            bodyStyle={car.bodyStyle}
            engineSize={`${car.engineCapacityLitres} L, ${car.engineCapacityCc} cc`}
            doors={car.doors || 0}
            seller={car?.user?.firstName || ""}
          />
        ))}
    </div>
  );
}
