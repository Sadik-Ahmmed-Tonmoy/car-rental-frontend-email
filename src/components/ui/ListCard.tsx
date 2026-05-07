/* eslint-disable @typescript-eslint/no-explicit-any */
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import {
  useAddToWishlistMutation,
  useGetAllWishlistItemsQuery,
  useRemoveFromWishlistMutation,
} from "@/redux/features/wishlist/wishlistApi";
import { useAppSelector } from "@/redux/hooks";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { Heart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
interface CarListingCardProps {
  id: string;
  vehicleId?: string; // Optional, if vehicleId is different from id
  title: string;
  subtitle: string;
  features?: string;
  price: string;
  imageUrl: string;
  imageCount: number;
  currentImage: number;
  tags: string[];
  location: string;
  distance: string;
  rating: number;
  mileage: string | number;
  transmission?: string;
  fuelType?: string;
  bodyStyle?: string;
  engineSize?: string;
  doors?: number;
  seller?: string; // Added seller property
}
const ListCard = ({
  id,
  vehicleId,
  title,
  subtitle,
  // features,
  price,
  imageUrl,
  imageCount,
  // currentImage,
  // tags,
  location,
  // distance,
  // rating,
  mileage,
  transmission,
  fuelType,
  bodyStyle,
  // engineSize,
  doors,
  seller, // Added seller to destructuring
}: CarListingCardProps) => {
  const token = useAppSelector(selectCurrentToken);
  const { data: wishlistItems } = useGetAllWishlistItemsQuery(undefined, {
    skip: !token, // Skip if token is not available
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isLiked = wishlistItems?.data?.some(
    (item: any) => item?.vehicle?.id === vehicleId
  );

  const handleWishlist = async (id: string) => {
    if (isLiked) {
      await handleAsyncWithToast(async () => {
        return await removeFromWishlist(id);
      });
    } else {
      await handleAsyncWithToast(async () => {
        return await addToWishlist({ vehicleId: id });
      });
    }
  };

  return (
    <div
      key={id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Car Image */}
        <div className="relative w-full lg:w-72 xl:w-80 object-fill flex-shrink-0">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="object-cover w-full h-full object-fill"
          />

          {/* Heart Icon - Mobile positioned differently */}
          {token ? (
            <button
              className={`absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer ${
                isLiked
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-400 hover:bg-gray-100"
              }`}
              onClick={() => vehicleId && handleWishlist(vehicleId)}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
          ) : (
            <button
              className={`absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer bg-white text-gray-400 hover:bg-gray-100`}
              onClick={() => toast("Please login first to add to wishlist")}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs sm:text-sm px-2 py-1 rounded flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <span>{imageCount}</span>
          </div>
        </div>

        {/* Car Details */}
        <div className="flex-1 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between h-full">
            {/* Left Side - Car Info */}
            <div className="flex-1 lg:pr-6">
              {/* Title and Subtitle */}
              <div className="mb-4">
                <h3 className="text-lg sm:text-xl lg:text-lg xl:text-xl font-semibold text-blue-primary mb-1 line-clamp-2">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base lg:text-sm font-medium line-clamp-1">
                  {subtitle}
                </p>
              </div>

              {/* Mobile Price Display - Show on mobile/tablet only */}
              <div className="lg:hidden mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      {price}
                    </div>
                    {/* <div className="text-sm text-gray-600">O.N.O</div> */}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900 font-medium">
                      {location || "Unknown Location"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-2 text-sm">
                <div className="flex justify-between sm:flex-col sm:justify-start">
                  <span className="text-gray-600">Mileage</span>
                  <span className="text-gray-900 font-medium sm:mt-1">
                    {mileage}
                  </span>
                </div>
                <div className="flex justify-between sm:flex-col sm:justify-start">
                  <span className="text-gray-600">Transmission</span>
                  <span className="text-gray-900 font-medium sm:mt-1">
                    {transmission}
                  </span>
                </div>
                <div className="flex justify-between sm:flex-col sm:justify-start">
                  <span className="text-gray-600">Fuel Type</span>
                  <span className="text-gray-900 font-medium sm:mt-1">
                    {fuelType}
                  </span>
                </div>
                <div className="flex justify-between sm:flex-col sm:justify-start">
                  <span className="text-gray-600">Body Style</span>
                  <span className="text-gray-900 font-medium sm:mt-1">
                    {bodyStyle}
                  </span>
                </div>
                {/* <div className="flex justify-between sm:flex-col sm:justify-start">
                  <span className="text-gray-600">Engine Size</span>
                  <span className="text-gray-900 font-medium sm:mt-1">
                    {engineSize}
                  </span>
                </div> */}
                <div className="flex justify-between sm:flex-col sm:justify-start">
                  <span className="text-gray-600">Doors</span>
                  <span className="text-gray-900 font-medium sm:mt-1">
                    {doors}
                  </span>
                </div>
                {/* <div className="flex justify-between sm:flex-col sm:justify-start sm:col-span-2 xl:col-span-1">
                  <span className="text-gray-600">Location</span>
                  <span className="text-gray-900 font-medium sm:mt-1">
                    {location}
                  </span>
                </div> */}
              </div>

              {/* Mobile More Details Button */}
              <div className="lg:hidden mt-6">
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition-colors text-sm sm:text-base">
                  More Details
                </button>
              </div>
            </div>

            {/* Right Side - Price and Actions (Desktop Only) */}
            <div className="hidden lg:flex flex-col justify-between items-end lg:w-40 xl:w-48">
              {/* Price */}
              <div className="text-right mb-4">
                <div className="text-xl xl:text-2xl font-bold text-gray-900">
                  {price}
                </div>
                {/* <div className="text-sm text-gray-600">O.N.O</div> */}
              </div>

              {/* Seller */}
              <div className="text-right mb-6 flex flex-col items-end">
                <div className="text-sm text-gray-600">Seller</div>
                <div className="text-sm text-gray-900 font-medium">
                  {seller}
                </div>
              </div>

              {/* More Details Button */}
           <Link
          href={`/vehicle-details/${vehicleId}`}
          className="block mb-2 hover:underline"
        >
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 xl:py-3 px-4 xl:px-6 rounded-lg transition-colors text-sm whitespace-nowrap cursor-pointer">
                  More Details
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
