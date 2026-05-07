/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/buttons/button";
import CarListView from "@/components/ui/car-list-view";
import FilterSection from "@/components/ui/FilterSection";
import GridView from "@/components/ui/GridView";
import MyFormSelect from "@/components/ui/MyForm/MyFormSelect/MyFormSelect";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import { sampleCarListings } from "@/data/sampleCars";
import {
  useGetAllBodyStyleQuery,
  useGetAllBrandsQuery,
  useGetAllColorsQuery,
  useGetAllDoorsQuery,
  useGetAllEngineQuery,
  useGetAllFuelTypeQuery,
  useGetAllMilageRangeQuery,
  useGetAllModelsQuery,
  useGetAllTransmissionQuery,
  useGetAllVariantsQuery,
  useGetAllVehicleBySearchQuery,
  useGetAllYearsQuery,
  useGetEngineCapacityLitresQuery,
} from "@/redux/features/vehicle/vehicleApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { z } from "zod";

const validationSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  modelVariant: z.string().optional(),
  engineSize: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  fuelType: z.string().optional(),
  yearFrom: z.string().optional(),
  sellerType: z.string().optional(),
  transmission: z.string().optional(),
  yearTo: z.string().optional(),
  maxMiles: z.string().optional(),
  bodyStyle: z.string().optional(),
  engineSizeAdv: z.string().optional(),
  doors: z.string().optional(),
  colour: z.string().optional(),
  locationRadius: z.string().optional(),
  postcode: z.string().optional(),
  PreviouslyWrittenOff: z.string().optional(),
});

export default function CarSearchFilter() {
  const [isGridView, setIsGridView] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedMinimumPrice, setSelectedMinimumPrice] = useState("");
  const [selectedYearFrom, setSelectedYearFrom] = useState("");
  const [locationOption, setLocationOption] = useState("within");
  const [formReset, setFormReset] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: string | number }[]
  >([
    { name: "page", value: page },
    { name: "limit", value: pageSize },
  ]);

  useEffect(() => {
    setObjectQuery([
      { name: "page", value: page },
      { name: "limit", value: pageSize },
    ]);
  }, [page, pageSize, formReset]);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const {
    data: getAllVehicleBySearchQuery,
    isLoading: getAllVehicleBySearchLoading,
    isFetching: getAllVehicleBySearchFetching,
  } = useGetAllVehicleBySearchQuery(objectQuery);

  // console.log(selectedMake, "Selected Make");
  const handleSubmit = async (formData: any, reset: any) => {
    const queryParams: { [key: string]: string | number } = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        queryParams[key] = formData[key];
      }
    });

    // Add pagination parameters
    queryParams.page = page;
    queryParams.limit = pageSize;

    // Convert to array of objects for the API
    const queryArray = Object.entries(queryParams).map(([name, value]) => ({
      name,
      value,
    }));

    setObjectQuery(queryArray);
  };

  const { data } = useGetAllBrandsQuery(undefined);
  const { data: getAllModelsQuery, isLoading: getAllModelsLoading } =
    useGetAllModelsQuery(selectedMake, {
      skip: !selectedMake,
    });
  const { data: getAllVariantsQuery, isLoading: getAllVariantsLoading } =
    useGetAllVariantsQuery(selectedModel, {
      skip: !selectedModel,
    });
  const { data: getAllEngineQuery, isLoading: getAllEngineLoading } =
    useGetAllEngineQuery(selectedModel, {
      skip: !selectedModel,
    });
  const {
    data: getEngineCapacityLitresQuery,
    isLoading: getEngineCapacityLitresLoading,
  } = useGetEngineCapacityLitresQuery(selectedModel, {
    skip: !selectedModel,
  });

  const { data: getAllFuelTypeQuery, isLoading: getAllFuelTypeLoading } =
    useGetAllFuelTypeQuery(undefined);

  const { data: getAllYearsQuery, isLoading: getAllYearsLoading } =
    useGetAllYearsQuery(undefined);
  const { data: getAllTransmissionQuery } =
    useGetAllTransmissionQuery(undefined);
  const { data: getAllMilageRangeQuery } = useGetAllMilageRangeQuery(undefined);
  const { data: getAllBodyStyleQuery } = useGetAllBodyStyleQuery(undefined);
  const { data: getAllDoorsQuery } = useGetAllDoorsQuery(undefined);
  const { data: getAllColorsQuery } = useGetAllColorsQuery(undefined);

  const makeOptions =
    data?.data?.map((item: any) => ({
      value: item?.id,
      label: item?.name,
    })) || [];

  const modelOptions =
    getAllModelsQuery?.data?.map((item: any) => ({
      value: item?.id,
      label: item?.name,
    })) || [];

  const modelVariantOptions =
    getAllVariantsQuery?.data?.map((item: any) => ({
      value: item?.id,
      label: item?.name,
    })) || [];

  const engineSizeOptions =
    getAllEngineQuery?.data?.map((item: any) => ({
      value: item?.id,
      label: item?.name ? `${item?.name} cc` : "",
    })) || [];

  const priceOptions = [
    { value: "0", label: "£000" },
    { value: "1000", label: "£1000" },
    { value: "2000", label: "£2000" },
    { value: "3000", label: "£3000" },
    { value: "4000", label: "£4000" },
    { value: "5000", label: "£5000" },
    { value: "6000", label: "£6000" },
    { value: "7000", label: "£7000" },
    { value: "8000", label: "£8000" },
    { value: "9000", label: "£9000" },
    { value: "10000", label: "£10,000" },
    { value: "15000", label: "£15,000" },
    { value: "20000", label: "£20,000+" },
  ];

  interface PriceOption {
    value: string;
    label: string;
  }

  const maxPriceOptions: PriceOption[] = [];

  // remove the less amount from price options, based on selectedMinimumPrice and push the rest to maxPriceOptions
  priceOptions.forEach((option) => {
    if (parseInt(option.value) > parseInt(selectedMinimumPrice)) {
      maxPriceOptions.push(option);
    }
  });

  const fuelTypeOptions =
    getAllFuelTypeQuery?.data?.map((item: any) => ({
      value: item,
      label: item,
    })) || [];

  const yearOptions =
    getAllYearsQuery?.data?.map((item: any) => ({
      value: item?.toString(),
      label: item,
    })) || [];

  interface YearOption {
    value: string;
    label: string;
  }
  const toYearsOptions: YearOption[] = [];
  yearOptions.forEach((year: any) => {
    if (parseInt(year.value) >= parseInt(selectedYearFrom)) {
      toYearsOptions.push(year);
    }
  });

  const sellerTypeOptions = [
    { value: "private", label: "Private" },
    { value: "trade", label: "Trade" },
  ];

  const transmissionOptions =
    getAllTransmissionQuery?.data?.map((item: any) => ({
      value: item,
      label: item,
    })) || [];

  const milesOptions =
    getAllMilageRangeQuery?.data?.map((item: any) => ({
      value: item?.max?.toString(),
      label: item?.label,
    })) || [];

  const bodyStyleOptions =
    getAllBodyStyleQuery?.data?.map((item: any) => ({
      value: item,
      label: item,
    })) || [];

  const engineSizeAdvOptions =
    getEngineCapacityLitresQuery?.data?.map((item: any) => ({
      value: item,
      label: item ? `${item} litres` : "",
    })) || [];

  const doorsOptions =
    getAllDoorsQuery?.data?.map((item: any) => ({
      value: item?.toString(),
      label: `${item} Doors`,
    })) || [];

  const colourOptions =
    getAllColorsQuery?.data?.map((item: any) => ({
      value: item,
      label: item,
    })) || [];
  return (
    <div>
      <MyFormWrapper
        onSubmit={handleSubmit}
        resolver={zodResolver(validationSchema)}
        className="space-y-6  my-6 sm:my-8 md:my-10 lg:my-12 xl:my-14 "
        key={formReset} // Reset form when formReset changes
      >
        <div className="md:bg-[#F9F9F9] rounded-2xl md:p-4">
          {/* Basic Search Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <MyFormSelect
              name="make"
              label="Make"
              options={makeOptions}
              getSelectedValue={(value: string) => {
                setSelectedMake(value);
              }}
              labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
              placeHolder="Make"
            />

            <MyFormSelect
              name="model"
              label="Model"
              options={modelOptions}
              isLoading={getAllModelsLoading}
              disabled={!selectedMake}
              getSelectedValue={(value: string) => {
                setSelectedModel(value); // Update selected model
              }}
              labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
              placeHolder="Model"
            />

            <MyFormSelect
              name="modelVariant"
              label="Model variant"
              options={modelVariantOptions}
              isLoading={getAllVariantsLoading}
              disabled={!selectedModel}
              labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
              placeHolder="Model variant"
            />

            <MyFormSelect
              name="engineSize"
              label="Engine size"
              options={[
                {
                  value: "",
                  label: "Not specified",
                },
                ...engineSizeAdvOptions,
              ]}
              isLoading={getEngineCapacityLitresLoading}
              disabled={!selectedModel}
              labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
              placeHolder="Engine size"
            />

            <MyFormSelect
              name="minPrice"
              label="Min price"
              options={priceOptions}
              getSelectedValue={(value: string) => {
                setSelectedMinimumPrice(value); // Update selected minimum price
              }}
              labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
              placeHolder="Min price"
            />

            <MyFormSelect
              name="maxPrice"
              label="Max price"
              options={maxPriceOptions}
              disabled={!selectedMinimumPrice}
              labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
              placeHolder="Max price"
            />
          </div>

          {/* More Options Toggle */}
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="text-cyan-500 hover:text-cyan-600 font-medium text-sm cursor-pointer"
            >
              {showMoreOptions ? "" : "More OPTIONS"}
            </button>
          </div>

          {/* Advanced Search Options */}
          {showMoreOptions && (
            <div className="space-y-4">
              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
                <MyFormSelect
                  name="fuelType"
                  label="Fuel Type"
                  options={fuelTypeOptions}
                  isLoading={getAllFuelTypeLoading}
                  labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
                  placeHolder="Fuel type"
                />

                <MyFormSelect
                  name="yearFrom"
                  label="Year From"
                  options={yearOptions}
                  isLoading={getAllYearsLoading}
                  getSelectedValue={(value: string) => {
                    setSelectedYearFrom(value); // Update selected year from
                  }}
                  labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
                  placeHolder="Year from"
                />

                <MyFormSelect
                  name="sellerType"
                  label="Seller Type"
                  options={sellerTypeOptions}
                  labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
                  placeHolder="Seller type"
                />

                <MyFormSelect
                  name="transmission"
                  label="Transmission"
                  options={transmissionOptions}
                  labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
                  placeHolder="Transmission"
                />

                <MyFormSelect
                  name="yearTo"
                  label="Year To"
                  options={toYearsOptions}
                  labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
                  placeHolder="Year to"
                />

                <MyFormSelect
                  name="maxMiles"
                  label="Max. Miles"
                  options={milesOptions}
                  labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
                  placeHolder="Max. miles"
                />
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MyFormSelect
                  name="bodyStyle"
                  label="Body Style"
                  options={bodyStyleOptions}
                  labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
                  placeHolder="Body style"
                />

                <MyFormSelect
                  name="doors"
                  label="Doors"
                  options={doorsOptions}
                  labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
                  placeHolder="Doors"
                />

                <MyFormSelect
                  name="colour"
                  label="Colour"
                  options={colourOptions}
                  labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
                  placeHolder="Colour"
                />
              </div>

              <div className="flex items-center justify-between flex-col sm:flex-row pb-3">
                {/* Location Section */}
                {/* <div className="flex flex-col sm:flex-row gap-y-3 items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex  items-center space-x-2">
                      <input
                        type="radio"
                        id="within"
                        name="location"
                        value="within"
                        checked={locationOption === "within"}
                        onChange={(e) => setLocationOption(e.target.value)}
                        className="text-cyan-500"
                      />
                      <label htmlFor="within" className="text-sm text-gray-700">
                        Within
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="allNI"
                        name="location"
                        value="allNI"
                        checked={locationOption === "allNI"}
                        onChange={(e) => setLocationOption(e.target.value)}
                        className="text-cyan-500"
                      />
                      <label htmlFor="allNI" className="text-sm text-gray-700">
                        All NI
                      </label>
                    </div>
                  </div>
                  {locationOption === "within" && (
                    <div className="flex flex-col sm:flex-row gap-y-3 items-center space-x-2">
                      <MyFormSelect
                        name="locationRadius"
                        label=""
                        options={radiusOptions}
                        labelClassName="hidden"
                        placeHolder="50"
                        className="w-full"
                      />
                      <div className="w-full">
                        <MyFormInput
                          name="postcode"
                          type="text"
                          label=""
                          labelClassName="hidden"
                          placeHolder="Enter postcode"
                          // className="w-32"
                          inputClassName="w-full  "
                        />
                      </div>
                    </div>
                  )}
                  <MyFormSelect
                    name="PreviouslyWrittenOff"
                    label=""
                    options={PreviouslyWrittenOff}
                    labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
                    placeHolder="Previously written off"
                  />
                </div> */}
                <div></div>
                {/* More Options Toggle */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                    className="text-cyan-500 hover:text-cyan-600 font-medium text-sm cursor-pointer"
                  >
                    {showMoreOptions ? "FEWER OPTIONS" : ""}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="flex justify-center ">
          <Button
            type="submit"
            className="bg-blue-primary hover:bg-cyan-600 text-white px-8 md:px-32 py-2 rounded-md md:rounded-4xl font-medium cursor-pointer"
          >
            Search
          </Button>
        </div>
        {/* reset Button */}
        <div className="flex justify-center ">
          <button
            className="text-blue-primary hover:text-cyan-600 font-medium text-sm cursor-pointer"
            type="button"
            onClick={() => {
              setFormReset((prev) => prev + 1); // Increment to reset form
            }}
          >
            CLEAR ALL FIELDS
          </button>
        </div>
      </MyFormWrapper>

      <div className="mb-8">
        <FilterSection isGridView={isGridView} setIsGridView={setIsGridView} />
        <>
          {isGridView ? (
            <GridView
              allVehicle={getAllVehicleBySearchQuery?.data?.vehicles}
              isLoading={getAllVehicleBySearchLoading}
              isFetching={getAllVehicleBySearchFetching}
            />
          ) : (
            <CarListView
              allVehicle={getAllVehicleBySearchQuery?.data?.vehicles}
              isLoading={getAllVehicleBySearchLoading}
              isFetching={getAllVehicleBySearchFetching}
            />
          )}
        </>
        <div className="flex justify-center mt-6">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={getAllVehicleBySearchQuery?.data?.totalCount || 0}
            onChange={handlePaginationChange}
            className="custom-pagination"
          />
        </div>
      </div>
    </div>
  );
}
