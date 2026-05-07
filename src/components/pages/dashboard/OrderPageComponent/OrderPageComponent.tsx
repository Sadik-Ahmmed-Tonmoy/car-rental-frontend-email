/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useDeleteVehicleMutation,
  useGetAllVehicleQuery,
} from "@/redux/features/vehicle/vehicleApi";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { Pagination } from "antd";
import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const OrderPageComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: string | number }[]
  >([
    { name: "page", value: currentPage },
    { name: "limit", value: itemsPerPage },
  ]);

  useEffect(() => {
    setObjectQuery([
      { name: "page", value: currentPage },
      { name: "limit", value: itemsPerPage },
    ]);
  }, [currentPage, itemsPerPage]);

  const {
    data: carData,
    isLoading,
    isFetching,
  } = useGetAllVehicleQuery(objectQuery);

  const vehicles = carData?.data?.vehicles || [];
  const totalItems = carData?.data?.totalCount || 0;

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  const [deleteVehicle] = useDeleteVehicleMutation();

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        // Call delete API here
        // await deleteVehicle(id);
        await handleAsyncWithToast(async () => deleteVehicle(id));
        // Swal.fire("Deleted!", "Your vehicle has been deleted.", "success");
        // Optionally refresh data or redirect
      }
    } catch {
      Swal.fire(
        "Error!",
        "Failed to delete vehicle. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="space-y-4 w-full mb-7 overflow-hidden overflow-x-auto">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
        <div className="col-span-3">Product Name</div>
        <div className="col-span-2">Seller Name</div>
        <div className="col-span-4">Product Location</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1 text-center">Actions</div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {isLoading || isFetching ? (
          <div className="text-center py-4">Loading...</div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No vehicles found.
          </div>
        ) : (
          vehicles.map((vehicle: any) => (
            <div
              key={vehicle.id}
              className="grid grid-cols-12 gap-4 py-3 px-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-3 flex items-center gap-3">
                <Image
                  src={vehicle.images?.[0] || "/placeholder.svg"}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  width={60}
                  height={40}
                  className="w-15 h-10 object-cover rounded"
                />
                <span className="text-sm font-medium text-gray-900">
                  {vehicle.make} {vehicle.model || ""}
                </span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-600">
                  {vehicle?.user?.firstName || "N/A"}
                </span>
              </div>
              <div className="col-span-4 flex items-center">
                <span className="text-sm text-gray-600">
                  {vehicle.address || "N/A"}
                </span>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-600">
                  {/* Backend doesn’t send date — you might replace with createdAt if available */}
                  {new Date(vehicle.createdAt).toLocaleDateString() || "N/A"}
                </span>
              </div>
              <div className="col-span-1 flex items-center justify-center gap-2">
                <button
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="View"
                >
                  <Link href={`/vehicle-details/${vehicle.id}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalItems}
          onChange={handlePaginationChange}
          className="custom-pagination"
        />
      </div>
    </div>
  );
};

export default OrderPageComponent;
