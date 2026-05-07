"use client";

import { cn } from "@/lib/utils";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { Check, Zap } from "lucide-react";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface PricingCardProps {
  pricePaid?: number; // Optional pricePaid prop
  packageId?: string; // Optional packageId prop
  priceId?: string; // Optional priceId prop
  name: string;
  duration: string;
  price: number;
  features?: string[];
  carValue?: string;
  sellerType?: string;
  vehicleType?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  packageId,
  priceId,
  name,
  duration,
  price,
  features = [],
  carValue = "",
  sellerType = "",
  vehicleType = "",
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const token = useAppSelector(selectCurrentToken);
  const { data: userData, isSuccess } = useGetMeQuery(undefined, {
    skip: !token,
  });

  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");
  const handleCheckout = async (
    price: number,
    name: string,
    duration: string,
    carValue: string,
    sellerType: string,
    vehicleType: string
  ) => {
    if (token && isSuccess) {
      setLoading(true);
      const weekCount = duration.includes("2")
        ? 2
        : duration.includes("6")
        ? 6
        : duration.includes("8")
        ? 8
        : 0;
      const startDate = moment().toDate();
      const endDate = moment(startDate).add(weekCount, "weeks").toDate();
      const formattedStartDate = moment(startDate).format("DD-MM-YYYY");
      const formattedEndDate = moment(endDate).format("DD-MM-YYYY");
   

      try {
        const convertedPrice = Math.round(price * 100);
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: convertedPrice,
            name,
            currency: "GBP",

            userId: userData?.data?.id,
            pricePaid: price,
            packageId,
            priceId,
            duration,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            selectedSellingPriceRange: carValue || "",
            sellerType: sellerType || "",
            vehicleType: vehicleType || "",
            vehicleId: vehicleId || "",
          }),
        });

        if (!res.ok) {
          console.error("API error:", await res.text());
          alert("Payment failed — check console");
          return;
        }

        const data = await res.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("No URL returned:", data);
          alert("Payment failed — no URL");
        }
      } catch (err) {
        console.error("Client error:", err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    } else {
      router.push("/auth/login");
      toast.error("Please login to create an ad");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16 max-w-lg mx-auto text-center">
      {/* Plan Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center">
          <div className="w-10 h-10 bg-cyan-200 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-primary" />
          </div>
        </div>
      </div>

      {/* Plan Name */}
      <h3 className="text-lg font-medium text-blue-primary mb-6">{name}</h3>

      {/* Price */}
      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900">
          £{price?.toFixed(2)}
        </span>
        <span className="text-gray-600 ml-1">/ {duration}</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-8 leading-relaxed">
        {/* Our {name?.toLowerCase()} ad gets you more prominence than the basic ad. */}
        Promote your vehicle with an ad displayed across desktop and mobile
        platforms. Being an advanced pack will ensure your ad features longer
        than the majority of other sellers.
      </p>

      {/* What's Included */}
      <div className="text-left mb-8">
        {/* <h4 className="text-blue-primary font-semibold mb-4 text-center">
        20 super high quality photos to capture buyer interest.
        </h4> */}
        <h4 className="text-blue-primary font-medium mb-4 text-center">
          What&apos;s included
        </h4>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-primary mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Create Ad Button */}
      <button
        type="button"
        disabled={price === 0 || !price ? true : false || loading}
        onClick={() =>
          handleCheckout(
            price,
            name,
            duration,
            carValue,
            sellerType,
            vehicleType
          )
        }
        className={cn(
          "w-full bg-blue-primary hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-md transition-colors text-sm cursor-pointer",

          price === 0 || !price ? "opacity-50 cursor-not-allowed" : ""
        )}
      >
        {loading ? "Redirecting..." : "Create your Ad"}
      </button>
      {price == 0 || !price ? (
        <p className="text-red-500 text-sm mt-2">
          Please select a valid price to create an ad.
        </p>
      ) : null}
    </div>
  );
};

export default PricingCard;
