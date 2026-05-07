/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useDeleteVehicleMutation,
  useGetAllVehicleByUserQuery,
} from "@/redux/features/vehicle/vehicleApi";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { Pagination, Spin, Tag } from "antd";
import { Edit, Eye, Trash2, RefreshCw, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";

interface Vehicle {
  id: string;
  images: string[];
  registrationNumber: string;
  minPrice: number;
  maxPrice: number;
  priceRange: string;
  currentMilage: string;
  fuelType: string;
  bodyType: string;
  make?: string;
  model?: string;
}

interface CarInventoryItem extends Vehicle {
  priceRange: string;
  advertisement?: {
    startDate?: string;
    endDate?: string;
  };
  [key: string]: any;
}

interface ColumnConfig {
  key: string;
  header: string;
  render?: (value: any, item: CarInventoryItem) => React.ReactNode;
  mobilePriority?: boolean;
}

interface InventoryPageComponentProps {
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddVehicle?: () => void;
}

const InventoryPageComponent: React.FC<InventoryPageComponentProps> = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: any }[]
  >([
    { name: "page", value: currentPage },
    { name: "limit", value: itemsPerPage },
    { name: "search", value: searchTerm },
  ]);

  // Update query params when state changes
  useEffect(() => {
    setObjectQuery([
      { name: "page", value: currentPage },
      { name: "limit", value: itemsPerPage },
      { name: "search", value: searchTerm },
    ]);
  }, [currentPage, itemsPerPage, searchTerm]);

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetAllVehicleByUserQuery(objectQuery);
  const [deleteVehicle] = useDeleteVehicleMutation();

  const allVehicles = apiResponse?.data?.vehicles || [];
  const totalCount = apiResponse?.data?.totalCount || 0;

  // Helper function to check if advertisement is expiring soon
  const isExpiringSoon = (endDate: string): boolean => {
    if (!endDate) return false;
    const end = moment(endDate, "DD-MM-YYYY");
    const now = moment();
    const daysLeft = end.diff(now, "days");
    return daysLeft <= 2 && daysLeft >= 0;
  };

  // Helper function to get days left
  const getDaysLeft = (endDate: string): number => {
    if (!endDate) return -1;
    const end = moment(endDate, "DD-MM-YYYY");
    const now = moment();
    return end.diff(now, "days");
  };

  // Process data for price range formatting
  const processedData = useMemo(() => {
    return allVehicles.map((vehicle: Vehicle) => ({
      ...vehicle,
      priceRange: `${vehicle?.priceRange}`,
    }));
  }, [allVehicles]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setItemsPerPage(pageSize);
  };

  const onView = (id: string) => {
    router.push(`/vehicle-details/${id}`);
  };
  const onEdit = (id: string) => {
    // router.push(`/edit-vehicle/${id}`);sell-form?id=6895865144a231963ef689e2
    router.push(`/sell-form?id=${id}`);
  };
  const onDelete = async (id: string) => {
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
    } catch (error) {
      Swal.fire(
        "Error!",
        "Failed to delete vehicle. Please try again.",
        "error"
      );
    }
  };

  const onRenew = (id: string) => {
    // Navigate to renewal page or show renewal modal
    router.push(`/re-new?vehicleId=${id}`);
  };

  const onAddVehicle = () => {
    router.push("/sell");
  };

  const renderCell = (item: CarInventoryItem, column: ColumnConfig) => {
    const value: any = item[column.key];
    if (column.render) return column.render(value, item);
    return <span className="text-sm text-gray-900">{value || "N/A"}</span>;
  };

  // Table columns
  const columns: ColumnConfig[] = [
    {
      key: "images",
      header: "Image",
      render: (images: string[]) => (
        <div className="w-16 h-12 relative bg-gray-100 rounded">
          <Image
            src={images[0] || "/placeholder-car.svg"}
            alt="Vehicle"
            fill
            className="object-cover rounded"
            sizes="64px"
            unoptimized
          />
        </div>
      ),
      mobilePriority: true,
    },
    {
      key: "registrationNumber",
      header: "Registration",
      render: (regNumber: string, item: CarInventoryItem) => (
        <div>
          <div className="font-semibold text-gray-900">{regNumber}</div>
          <div className="text-xs text-gray-500 capitalize">
            {item.bodyType?.toLowerCase()}
          </div>
        </div>
      ),
      mobilePriority: true,
    },
    {
      key: "make",
      header: "Make",
      render: (make: string, item: CarInventoryItem) => (
        <div>
          <div className="font-semibold text-gray-900">{make}</div>
          <div className="text-xs text-gray-500 capitalize">{item?.model}</div>
        </div>
      ),
      mobilePriority: true,
    },
    {
      key: "priceRange",
      header: "Price Range",
      render: (priceRange: string) => (
        <span className="font-medium text-green-600">{priceRange}</span>
      ),
    },
    {
      key: "advertisementDates",
      header: "Ad Duration",
      render: (_: any, item: CarInventoryItem) => {
        const start = item?.advertisement?.startDate;
        const end = item?.advertisement?.endDate;
        const daysLeft = getDaysLeft(end || "");
        const isExpiring = isExpiringSoon(end || "");
        
        return (
          <div className="space-y-1">
            <span className="text-sm text-gray-700">
              {start && end ? `${start} → ${end}` : "N/A"}
            </span>
            {isExpiring && daysLeft >= 0 && (
              <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                <Clock className="w-3 h-3" />
                {daysLeft === 0 ? "Expires today" : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
              </div>
            )}
          </div>
        );
      },
    },
    // {
    //   key: "currentMilage",
    //   header: "Mileage",
    //   render: (milage: string) => (
    //     <span>{parseInt(milage)?.toLocaleString()} miles</span>
    //   ),
    // },
    // {
    //   key: "fuelType",
    //   header: "Fuel Type",
    //   render: (fuelType: string) => (
    //     <Tag color={getFuelTypeColor(fuelType)} className="capitalize">
    //       {fuelType?.toLowerCase()}
    //     </Tag>
    //   ),
    // },
  ];

  const actionsColumn: ColumnConfig = {
    key: "actions",
    header: "Actions",
    render: (_, item) => {
      const isExpiring = isExpiringSoon(item?.advertisement?.endDate || "");
      
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(item.id)}
            className="text-gray-400 hover:text-blue-600 cursor-pointer"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(item.id)}
            className="text-gray-400 hover:text-yellow-600 cursor-pointer"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          {isExpiring && (
            <button
              onClick={() => onRenew(item.id)}
              className="text-orange-500 hover:text-orange-700 cursor-pointer"
              title="Renew Advertisement"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(item.id)}
            className="text-gray-400 hover:text-red-600 cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    },
    mobilePriority: true,
  };

  const finalColumns = [...columns, actionsColumn];

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load vehicle data. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 ">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-gray-200 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by registration, type, fuel..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {onAddVehicle && (
            <button
              onClick={onAddVehicle}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Vehicle
            </button>
          )}
        </div> */}

        {/* Empty State */}
        {processedData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchTerm
                ? "No vehicles match your search."
                : "No vehicles found in your inventory."}
            </div>
            {onAddVehicle && !searchTerm && (
              <button
                onClick={onAddVehicle}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium cursor-pointer"
              >
                Add Your First Vehicle
              </button>
            )}
          </div>
        )}

        {/* Desktop Table */}
        {processedData.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {finalColumns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedData.map((item: any) => {
                  const isExpiring = isExpiringSoon(item?.advertisement?.endDate || "");
                  
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-gray-50 ${isExpiring ? 'bg-orange-50 border-l-4 border-orange-400' : ''}`}
                    >
                      {finalColumns.map((column) => (
                        <td
                          key={`${item.id}-${column.key}`}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          {renderCell(item, column)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {processedData.length > 0 && (
          <div className="md:hidden divide-y divide-gray-200">
            {processedData.map((item: any) => {
              const isExpiring = isExpiringSoon(item?.advertisement?.endDate || "");
              const daysLeft = getDaysLeft(item?.advertisement?.endDate || "");
              
              return (
                <div 
                  key={item.id} 
                  className={`p-4 hover:bg-gray-50 ${isExpiring ? 'bg-orange-50 border-l-4 border-orange-400' : ''}`}
                >
                  {/* Expiring reminder for mobile */}
                  {isExpiring && (
                    <div className="mb-3 flex items-center gap-2 p-2 bg-orange-100 border border-orange-200 rounded-lg">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-700 font-medium">
                        {daysLeft === 0 ? "Advertisement expires today!" : `Advertisement expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`}
                      </span>
                      <button
                        onClick={() => onRenew(item.id)}
                        className="ml-auto bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-xs font-medium flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Renew
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-12 relative flex-shrink-0 bg-gray-100 rounded">
                      <Image
                        src={item.images[0] || "/placeholder-car.svg"}
                        alt="Vehicle"
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {item.registrationNumber}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {item.bodyType?.toLowerCase()}
                          </div>
                          <div className="mt-1 font-medium text-green-600">
                            {item.priceRange}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => onView(item.id)}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(item.id)}
                            className="text-gray-400 hover:text-yellow-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {isExpiring && (
                            <button
                              onClick={() => onRenew(item.id)}
                              className="text-orange-500 hover:text-orange-700"
                              title="Renew Advertisement"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(item.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Tag
                          color={getFuelTypeColor(item.fuelType)}
                          className="capitalize"
                        >
                          {item.fuelType?.toLowerCase()}
                        </Tag>
                        <span className="text-sm text-gray-500">
                          {parseInt(item.currentMilage)?.toLocaleString()} miles
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {processedData.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-t border-gray-200 gap-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
              vehicles
            </div>
            <Pagination
              current={currentPage}
              total={totalCount}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={[5, 10, 20, 50]}
              onShowSizeChange={handlePageChange}
              className="[&_.ant-pagination-item]:rounded-lg [&_.ant-pagination-item]:border-gray-300 [&_.ant-pagination-item-active]:bg-blue-600 [&_.ant-pagination-item-active]:border-blue-600 [&_.ant-pagination-item-active_a]:text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Helper for fuel type colors
function getFuelTypeColor(fuelType: string): string {
  switch (fuelType?.toLowerCase()) {
    case "petrol":
      return "red";
    case "diesel":
      return "blue";
    case "hybrid electric":
      return "green";
    case "electric":
      return "cyan";
    default:
      return "gray";
  }
}

export default InventoryPageComponent;