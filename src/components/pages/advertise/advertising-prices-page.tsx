/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PricingCard from "@/components/ui/PricingCard/PricingCard";
import { cn } from "@/lib/utils";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { Modal, Select } from "antd";
import { useState } from "react";

export default function AdvertisingPricesPage() {
  const { data: packages } = useGetAllPackagesQuery(undefined);
  const [sellerType, setSellerType] = useState("Trade");
  const [vehicleType, setVehicleType] = useState("Car");
  const [carValue, setCarValue] = useState("£0000");
  const [isModalOpen, setIsModalOpen] = useState(true);

  const onChangeForVehicleType = (value: string) => {
    setVehicleType(value);
  };
  const onChangeForValue = (value: string) => {
    setCarValue(value);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // Find Standard Pack from API data
  const standardPack = packages?.data?.find(
    (pack: any) => pack.name === "Standard Pack"
  );

  return (
    <div className="  py-12">
      <Modal
        title=""
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="OK"
        width={600}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <h1 className="text-center text-red-500 text-3xl">Attention </h1>
        <p
          className="
            text-center text-gray-700 mt-4 mb-6  text-lg 
        "
        >
          Please buy an advertisement pack to add your vehicle listing
        </p>
      </Modal>
      <div className=" px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-blue-primary">
            Advertising prices
          </h1>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 max-w-4xl mx-auto sm:bg-[#F9F9F9] sm:py-4 sm:px-5 rounded-md">
          {/* Vehicle Type */}
          <div>
            <label
              htmlFor="vehicleType"
              className="block text-base font-medium text-[#010D16] mb-2"
            >
              Vehicle type
            </label>
            <div className="w-full">
              <Select
                placeholder="Select a vehicle type"
                className="w-full"
                optionFilterProp="label"
                value={vehicleType}
                onChange={onChangeForVehicleType}
                options={[
                  {
                    value: "car",
                    label: "Car",
                  },
                  {
                    value: "van",
                    label: "Van",
                  },
                  {
                    value: "salvage",
                    label: "Salvage",
                  },
                  {
                    value: "motorcycle",
                    label: "Motorcycle",
                  },
                  {
                    value: "leisure",
                    label: "Leisure",
                  },
                  {
                    value: "farm-plant",
                    label: "Farm/Plant",
                  },
                ]}
              />
            </div>
          </div>

          {/* Seller Type */}
          <div>
            <label
              htmlFor="sellerType"
              className="block text-base font-medium text-[#010D16] mb-2"
            >
              Seller type
            </label>
            {/* <select
              id="sellerType"
              name="sellerType"
              value={formData.sellerType}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-sm"
            >
              <option value="Trade">Trade</option>
              <option value="Private">Private</option>
            </select> */}
            <div className="cursor-pointer flex items-center border border-gray-300 rounded-md overflow-hidden focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-sm">
              <div
                onClick={() => setSellerType("Trade")}
                className={cn(
                  `w-full  text-center py-[5px] border-r border-gray-300`,
                  sellerType === "Trade" ? "bg-blue-primary text-white " : ""
                )}
              >
                Trade
              </div>
              <div
                onClick={() => setSellerType("Private")}
                className={cn(
                  `w-full text-center py-[5px]`,
                  sellerType === "Private" ? "bg-blue-primary text-white" : ""
                )}
              >
                Private
              </div>
            </div>
          </div>

          {/* Car Value */}
          <div>
            <label
              htmlFor="carValue"
              className="block text-base font-medium text-[#010D16] mb-2"
            >
              How much is your vehicle worth?
            </label>
            <Select
              placeholder="Select a value"
              value={carValue}
              className="w-full"
              optionFilterProp="label"
              onChange={onChangeForValue}
              options={[
                {
                  value: "Up to £1000",
                  label: "Up to £1000",
                },
                {
                  value: "£1001 - £2000",
                  label: "£1001 - £2000",
                },
                {
                  value: "£2001 - £3000",
                  label: "£2001 - £3000",
                },
                {
                  value: "£3001 - £4000",
                  label: "£3001 - £4000",
                },
                {
                  value: "£4001 - £5000",
                  label: "£4001 - £5000",
                },
                {
                  value: "£5001 - £7000",
                  label: "£5001 - £7000",
                },
                {
                  value: "£7001 - £10000",
                  label: "£7001 - £10000",
                },
                {
                  value: "£10001 - £17000",
                  label: "£10001 - £17000",
                },
                {
                  value: "Over £17000",
                  label: "Over £17000",
                },
              ]}
            />
          </div>
        </div>

        {sellerType === "Trade" ? (
          <>
            {/* Pricing Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-16 mx-auto">
              {packages?.data?.map((pack: any) => {
                // Get the right price based on selected car value
                const matchedPrice = pack.pricingTiers.find(
                  (tier: any) => tier.valueRange === carValue
                );

                return (
                  <PricingCard
                    key={pack.id}
                    packageId={pack.id}
                    priceId={matchedPrice?.id}
                    name={pack.name}
                    duration={pack.duration}
                    price={matchedPrice?.price || 0}
                    features={pack.features}
                    carValue={carValue}
                    sellerType={sellerType}
                    vehicleType={vehicleType}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* show only standard */}
            <div className="max-w-2xl mx-auto mb-16">
              {standardPack &&
                (() => {
                  const matchedPrice = standardPack.pricingTiers.find(
                    (tier: any) => tier.valueRange === carValue
                  )?.price;

                  return (
                    <PricingCard
                      key={standardPack.id}
                      packageId={standardPack.id}
                      priceId={standardPack.pricingTiers[0].id}
                      name={standardPack.name}
                      duration={standardPack.duration}
                      price={matchedPrice || 0}
                      features={standardPack.features}
                      carValue={carValue}
                      sellerType={sellerType}
                      vehicleType={vehicleType}
                    />
                  );
                })()}
            </div>
          </>
        )}

        {/* Quick Create Section */}
        {/* <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-8">
            Ready to sell? Quickly create your ad
          </h2>

          <div className="flex flex-col md:flex-row gap-4 items-end w-full">
         
            <div className="w-full">
              <label
                htmlFor="registration"
                className="block text-base font-medium text-[#010D16] mb-2"
              >
                Registration
              </label>
              <input
                type="text"
                id="registration"
                name="registration"
        
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
              />
            </div>

    
            <div className="w-full">
              <label
                htmlFor="mileage"
                className="block text-base font-medium text-[#010D16] mb-2"
              >
                Current mileage
              </label>
              <input
                type="text"
                id="mileage"
                name="mileage"
         
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
              />
            </div>


            <div className="flex-shrink-0">
              <button
                onClick={handleQuickCreateAd}
                className="bg-blue-primary hover:bg-cyan-600 text-white font-medium py-2.5 px-6 rounded-md transition-colors text-sm whitespace-nowrap cursor-pointer"
              >
                Create Your Ad
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
