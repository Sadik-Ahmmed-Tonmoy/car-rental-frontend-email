/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Eye, Edit, Trash2, ChevronDown } from "lucide-react";
import { Pagination } from "antd";

interface CarInventoryItem {
  id: string;
  [key: string]: any;
}

interface ColumnConfig {
  key: string;
  header: string;
  render?: (value: any, item: CarInventoryItem) => React.ReactNode;
  className?: string;
  mobilePriority?: boolean;
  sortable?: boolean;
}

interface CarInventoryTableProps {
  data?: CarInventoryItem[];
  columns: ColumnConfig[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddVehicle?: () => void;
  searchFields?: string[];
  defaultItemsPerPage?: number;
}

const defaultColumns: ColumnConfig[] = [
  {
    key: "image",
    header: "Product Image",
    render: (value) => (
      <div className="w-12 h-8 relative">
        <Image
          src={value || "/placeholder.svg"}
          alt="Car"
          fill
          className="object-cover rounded"
        />
      </div>
    ),
    mobilePriority: true,
  },
  {
    key: "make",
    header: "Make/Model",
    render: (value, item) => (
      <>
        <div className="text-sm font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{item.model}</div>
      </>
    ),
    mobilePriority: true,
    sortable: true,
  },
  { key: "derivative", header: "Derivative", mobilePriority: true },
  { key: "fuel", header: "Fuel" },
  {
    key: "price",
    header: "Price",
    render: (value) => `£${value?.toLocaleString() || 0}`,
    sortable: true,
  },
  { key: "mileage", header: "Mileage", sortable: true },
  { key: "year", header: "Year", sortable: true },
  { key: "days", header: "Days", sortable: true },
];

export default function CarInventoryTable({
  data = [],
  columns = defaultColumns,
  onView,
  onEdit,
  onDelete,
  onAddVehicle,
  searchFields = ["make", "model", "derivative"],
  defaultItemsPerPage = 10,
}: CarInventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Get sortable columns for dropdown
  const sortableColumns = columns.filter((col) => col.sortable);

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    searchFields.some((field) =>
      String(item[field] || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortBy) return 0;

    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle numeric values
    if (
      sortBy === "price" ||
      sortBy === "mileage" ||
      sortBy === "year" ||
      sortBy === "days"
    ) {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    } else {
      // Handle string values
      aValue = String(aValue || "").toLowerCase();
      bValue = String(bValue || "").toLowerCase();
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSortChange = (value: string) => {
    if (!value) {
      setSortBy("");
      setSortOrder("asc");
      return;
    }
    
    const [field, order] = value.split("-");
    setSortBy(field);
    setSortOrder(order as "asc" | "desc");
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Calculate pagination - use sorted data
  const totalItems = sortedData.length;
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setItemsPerPage(pageSize);
    }
  };

  const renderCell = (item: CarInventoryItem, column: ColumnConfig) => {
    const value = item[column.key];
    if (column.render) {
      return column.render(value, item);
    }
    return <span className="text-sm text-gray-900">{value}</span>;
  };

  // Actions column with proper event handlers
  const actionsColumn: ColumnConfig = {
    key: "actions",
    header: "Action",
    render: (_, item) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView?.(item.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit?.(item.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete?.(item.id)}
          className="text-gray-400 hover:text-red-600 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
    mobilePriority: true,
  };

  // Add actions column if any action handler is provided
  const finalColumns = [...columns];
  if (onView || onEdit || onDelete) {
    finalColumns.push(actionsColumn);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-gray-200 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Sort Dropdown */}
          {sortableColumns.length > 0 && (
            <div className="relative min-w-[180px]">
              <select
                value={sortBy ? `${sortBy}-${sortOrder}` : ""}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Sort by...</option>
                {sortableColumns.map((column) => (
                  <optgroup key={column.key} label={column.header}>
                    <option value={`${column.key}-asc`}>
                      {column.header} (A-Z)
                    </option>
                    <option value={`${column.key}-desc`}>
                      {column.header} (Z-A)
                    </option>
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Add Vehicle Button */}
        {onAddVehicle && (
          <button
            onClick={onAddVehicle}
            className="bg-blue-primary hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span className="text-lg">+</span>
            Add Vehicle
          </button>
        )}
      </div>

      {/* Empty State */}
      {currentData.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">
            {searchTerm ? "No vehicles match your search." : "No vehicles found."}
          </div>
        </div>
      )}

      {/* Table - Desktop */}
      {currentData.length > 0 && (
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
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
              {currentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {finalColumns.map((column) => (
                    <td
                      key={`${item.id}-${column.key}`}
                      className={`px-6 py-4 whitespace-nowrap ${
                        column.className || ""
                      }`}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Cards */}
      {currentData.length > 0 && (
        <div className="lg:hidden">
          <div className="divide-y divide-gray-200">
            {currentData.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-start gap-3">
                  {finalColumns
                    .filter((c) => c.mobilePriority)
                    .map((column) =>
                      column.key === "image" ? (
                        <div
                          key={`${item.id}-${column.key}`}
                          className="w-16 h-12 relative flex-shrink-0"
                        >
                          {renderCell(item, column)}
                        </div>
                      ) : null
                    )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        {finalColumns
                          .filter(
                            (c) =>
                              c.mobilePriority &&
                              c.key !== "image" &&
                              c.key !== "actions"
                          )
                          .map((column) => (
                            <div key={`${item.id}-${column.key}`}>
                              {renderCell(item, column)}
                            </div>
                          ))}
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {finalColumns
                          .find((c) => c.key === "actions")
                          ?.render?.(
                            item[
                              finalColumns.find((c) => c.key === "actions")?.key || ""
                            ],
                            item
                          )}
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                      {finalColumns
                        .filter((c) => !c.mobilePriority && c.key !== "actions")
                        .map((column) => (
                          <div key={`${item.id}-${column.key}`}>
                            <span className="font-medium">{column.header}:</span>{" "}
                            {item[column.key]}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer with Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-t border-gray-200 gap-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            items
          </div>

          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
            onShowSizeChange={handlePageChange}
            className="ant-pagination-custom"
          />
        </div>
      )}

      <style jsx global>{`
        .ant-pagination-custom .ant-pagination-item,
        .ant-pagination-custom .ant-pagination-prev,
        .ant-pagination-custom .ant-pagination-next,
        .ant-pagination-custom .ant-pagination-jump-prev,
        .ant-pagination-custom .ant-pagination-jump-next {
          min-width: 32px;
          height: 32px;
          line-height: 32px;
          border-radius: 6px;
          margin: 0 2px;
        }

        .ant-pagination-custom .ant-pagination-item a {
          color: #6b7280;
        }

        .ant-pagination-custom .ant-pagination-item.ant-pagination-item-active {
          background-color: #06b6d4;
          border-color: #06b6d4;
        }

        .ant-pagination-custom
          .ant-pagination-item.ant-pagination-item-active
          a {
          color: white;
        }

        .ant-pagination-custom .ant-pagination-prev .ant-pagination-item-link,
        .ant-pagination-custom .ant-pagination-next .ant-pagination-item-link {
          border-radius: 6px;
        }

        .ant-pagination-custom .ant-select-selector {
          border-radius: 6px;
          height: 32px;
        }
      `}</style>
    </div>
  );
}