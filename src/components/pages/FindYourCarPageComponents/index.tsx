/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MyFormInput from "@/components/ui/MyForm/MyFormInput/MyFormInput";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import { useGetSingleAdvertisementBySessionIdQuery } from "@/redux/features/advertisements/advertisementsApi";
import { useGetSinglePriceDataQuery } from "@/redux/features/package/packageApi";
import { useCreateVehicleMutation, useGetSingleVehicleQuery } from "@/redux/features/vehicle/vehicleApi";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

const validationSchema = z.object({
  registrationNumber: z
    .string({
      required_error: "Registration number is required",
    })
    .min(1, "Registration number is required"),
  currentMilage: z
    .string({
      required_error: "Current mileage is required",
    })
    .min(1, "Current mileage is required"),
});

const FindYourCar = () => {
  const router = useRouter();
  const [createVehicleMutation] = useCreateVehicleMutation();

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const priceId = searchParams.get("priceId");
  const sellerType = searchParams.get("sellerType");
  const vehicleType = searchParams.get("vehicleType");

  const { data: priceData } = useGetSinglePriceDataQuery(priceId);

  const { data: advertisementData } = useGetSingleAdvertisementBySessionIdQuery(
    sessionId,
    {
      skip: !sessionId,
    }
  );

  const handleSubmit = async (
    formData: {
      registrationNumber: string;
      currentMilage: string;
    },
    reset: any
  ) => {
    if (!sessionId) {
      return;
    }
    const carMinPrice =
      priceData?.data?.valueRange?.split(" - ")[0]?.slice(1) || "0000";
    const carMaxPrice =
      priceData?.data?.valueRange
        ?.split(" - ")[1]
        ?.split("£")[1]
        ?.replace(/,/g, "") || "0000";
    const data = {
      registrationNumber: formData.registrationNumber,
      currentMilage: formData.currentMilage,
      minPrice: carMinPrice,
      maxPrice: carMaxPrice,
      priceRange: priceData?.data?.valueRange,
      sellerType: sellerType,
      vehicleType: vehicleType,
      advertisementId: advertisementData?.data?.advertisement?.id,
    };
    const response = await handleAsyncWithToast(async () => {
      return createVehicleMutation(data);
    });
    if (response?.data?.success) {
      reset();
      // const res= await handleAsyncWithToast(async () => {
      //   return updateAdvertisementBySessionIdMutation({
      //     sessionId: sessionId,
      //   });
      // })
      router.push(`/sell-form?id=${response.data.data.id}`);
    }
  };

 
    const vehicleId = searchParams.get("vehicleId");
    const { isLoading, data: getSingleVehicleQuery } = useGetSingleVehicleQuery(
      vehicleId,
      {
        skip: !vehicleId,
      }
    );
  
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      );
    }

  return (
    <div className="max-w-2xl mx-auto my-10 ">
      <h3 className="font-semibold text-3xl mb-8">Find your vehicle</h3>
      <MyFormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(validationSchema)}
        className="space-y-6"
      >
        <div className="  space-y-6 text-sm">
          <div className="w-full">
            <MyFormInput
              value={getSingleVehicleQuery?.data?.registrationNumber ? getSingleVehicleQuery.data.registrationNumber : ""}
              name="registrationNumber"
              type="text"
              label="Registration Number"
              placeHolder="Enter your vehicle registration number"
              labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
            />
          </div>
          <div className="w-full">
            <MyFormInput
              value={getSingleVehicleQuery?.data?.currentMilage ? getSingleVehicleQuery.data.currentMilage : ""}
              name="currentMilage"
              type="text"
              label="Current Mileage"
              placeHolder="Enter your vehicle's current mileage"
              labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
            />
          </div>

          {/* Sign in button */}
          <button className="w-full bg-blue-primary hover:bg-cyan-600 text-white! py-3 px-4 rounded-md font-medium cursor-pointer">
            Find my vehicle
          </button>
        </div>
      </MyFormWrapper>
    </div>
  );
};

export default FindYourCar;
