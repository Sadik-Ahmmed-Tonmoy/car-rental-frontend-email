"use client";
import { IVehicle } from "@/types/types";
import ReusableCard from "./ReusableCard/ReusableCard";
import { SkeletonCard } from "./SkeletonCard";

interface GridViewProps {
  allVehicle: IVehicle[] | undefined;
  isLoading: boolean;
  isFetching?: boolean;
}

const GridView = ({ allVehicle, isLoading, isFetching }: GridViewProps) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {allVehicle && allVehicle.length > 0 ? (
        allVehicle.map((car: IVehicle) => (
          <ReusableCard
            key={car.id}
            id={car.id}
            vehicleId={car.id}
            title={`${car.make} ${car.model}`}
            subtitle={`${car.model}, ${car.engineCapacityLitres}L, ${car.engineCapacityCc}cc, ${car.currentMilage} km`}
            tags={[car.engineSize]}
            price={car?.priceRange}
            imageUrl={car.images[0] || "/placeholder.svg"}
            imageCount={car.images.length}
            currentImage={1}
            location={car?.address || car?.user?.address || ""}
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
  );
};

export default GridView;
