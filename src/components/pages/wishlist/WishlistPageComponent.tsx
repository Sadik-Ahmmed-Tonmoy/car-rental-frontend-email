"use client";
import { Container } from "@/components/ui-library/container";
import ReusableCard from "@/components/ui/ReusableCard/ReusableCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { useGetAllWishlistItemsQuery } from "@/redux/features/wishlist/wishlistApi";
import { useAppSelector } from "@/redux/hooks";
import { IVehicle } from "@/types/types";

const WishlistPageComponent = () => {
  const token = useAppSelector((state) => state.auth.access_token);
  const { data: wishlistItems, isLoading } =
    useGetAllWishlistItemsQuery(undefined, {
      skip: !token,
    });
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
    <Container className="mb-10 sm:mb-16">
      <p className="text-center text-blue-primary text-xl my-10 sm:my-16 ">
        Your Personalized Wishlist Awaits
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {wishlistItems?.data && wishlistItems?.data?.length > 0 ? (
          wishlistItems?.data?.map((car: { vehicle: IVehicle }) => (
            <ReusableCard
              key={car?.vehicle?.id}
              id={car?.vehicle?.id}
              vehicleId={car?.vehicle?.id}
              title={`${car?.vehicle?.make} ${car?.vehicle?.model}`}
              subtitle={`${car?.vehicle?.model}, ${car?.vehicle?.engineCapacityLitres}L, ${car?.vehicle?.engineCapacityCc}cc, ${car?.vehicle?.currentMilage} km`}
              tags={[car?.vehicle?.engineSize]}
              price={`${car?.vehicle?.minPrice} - ${car?.vehicle?.maxPrice} €`}
              imageUrl={car?.vehicle?.images[0] || "/placeholder.svg"}
              imageCount={car?.vehicle?.images.length}
              currentImage={1}
              location={car?.vehicle?.address || ""}
              distance=""
              rating={0}
            />
          ))
        ) : (
          <div className="col-span-4 text-center text-gray-500">
            No items in your wishlist yet. Start adding your favorite cars!
          </div>
        )}
      </div>
    </Container>
  );
};

export default WishlistPageComponent;
