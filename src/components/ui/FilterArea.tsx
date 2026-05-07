"use client";
import { useGetAllVehicleByVehicleTypeQuery } from "@/redux/features/vehicle/vehicleApi";
import { Pagination } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CarListView from "./car-list-view";
import FilterSection from "./FilterSection";
import GridView from "./GridView";

const FilterArea = () => {
  const [isGridView, setIsGridView] = useState(true);
  const queryParams = useParams();
  const vehicleType = queryParams.vehicleType as string;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: string | number }[]
  >([
    { name: "page", value: page },
    { name: "limit", value: pageSize },
    { name: "vehicleClass", value: vehicleType },
  ]);

  useEffect(() => {
    setObjectQuery([
      { name: "page", value: page },
      { name: "limit", value: pageSize },
      { name: "vehicleClass", value: vehicleType },
    ]);
  }, [page, pageSize, vehicleType]);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const { data, isLoading, isFetching } = useGetAllVehicleByVehicleTypeQuery({
    objectQuery,
  });

  return (
    <div className="mb-8">
      <FilterSection isGridView={isGridView} setIsGridView={setIsGridView} />
      <>
        {isGridView ? (
          <GridView
            allVehicle={data?.data?.data}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        ) : (
          <CarListView
            allVehicle={data?.data?.data}
            isLoading={isLoading}
            isFetching={isFetching}
          />
        )}
      </>

      <div className="flex justify-center mt-6">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={data?.data?.meta?.total || 0}
          onChange={handlePaginationChange}
          className="custom-pagination"
        />
      </div>
    </div>
  );
};

export default FilterArea;
