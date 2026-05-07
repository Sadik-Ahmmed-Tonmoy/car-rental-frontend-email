/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination } from "antd";
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useMemo, useState } from "react";

interface User {
  id: string;
  image: string | StaticImageData; // Assuming you might use a static image
  name: string;
  totalSold: number;
  totalListed: number;
  signUpDate: string;
  email: string;
  status: string; // "Active" | "Inactive"
}

interface ColumnConfig {
  key: string;
  header: string;
  render?: (value: any, item: User) => React.ReactNode;
  mobilePriority?: boolean;
}

interface UserListProps {
  data?: User[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddUser?: () => void;
  searchFields?: string[];
  defaultItemsPerPage?: number;
}

const UserList = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onAddUser,
  searchFields = ["name", "email", "status"],
  defaultItemsPerPage = 10,
}: UserListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  // Column configuration
  const columns: ColumnConfig[] = [
    {
      key: "image",
      header: "Avatar",
      render: (value: string) => (
        <div className="w-10 h-10 relative rounded-full overflow-hidden">
          <Image
            src={value || "/default-avatar.jpg"}
            alt="User Avatar"
            fill
            className="object-cover"
          />
        </div>
      ),
      mobilePriority: true,
    },
    {
      key: "name",
      header: "Name/Email",
      render: (value: string, item: User) => (
        <div>
          <div className="font-semibold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
        </div>
      ),
      mobilePriority: true,
    },
    {
      key: "status",
      header: "Status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            value === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "totalListed",
      header: "Listed",
    },
    {
      key: "totalSold",
      header: "Sold",
    },
    {
      key: "signUpDate",
      header: "Join Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      searchFields.some((field) =>
        String(item[field as keyof User] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searchFields]);

  // Pagination
  const totalItems = filteredData.length;
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setItemsPerPage(pageSize);
    }
  };

  // Actions column
  const actionsColumn: ColumnConfig = {
    key: "actions",
    header: "Actions",
    render: (_, item) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView?.(item.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          title="View"
          aria-label={`View user ${item.name}`}
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit?.(item.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          title="Edit"
          aria-label={`Edit user ${item.name}`}
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete?.(item.id)}
          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
          title="Delete"
          aria-label={`Delete user ${item.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
    mobilePriority: true,
  };

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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Add User Button */}
        {onAddUser && (
          <button
            onClick={onAddUser}
            className="bg-blue-primary hover:bg-blue-600 cursor-pointer text-white  rounded-lg transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
          >
   
          </button>
        )}
      </div>

      {/* Empty State */}
      {currentData.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">
            {searchTerm ? "No users match your search." : "No users found."}
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
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {column.render
                        ? column.render(item[column.key as keyof User], item)
                        : (() => {
                            const value = item[column.key as keyof User];
                            // If value is StaticImageData, use its src property
                            if (typeof value === "object" && value && "src" in value) {
                              return value.src;
                            }
                            return value as React.ReactNode;
                          })()}
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
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 relative rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/default-avatar.jpg"}
                      alt="User Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">{item.email}</div>
                        <div className="mt-1">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              item.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {(onView || onEdit || onDelete) && (
                          <div className="flex gap-2">
                            {onView && (
                              <button
                                onClick={() => onView(item.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            {onEdit && (
                              <button
                                onClick={() => onEdit(item.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(item.id)}
                                className="text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span className="font-medium">Listed:</span>{" "}
                        {item.totalListed}
                      </div>
                      <div>
                        <span className="font-medium">Sold:</span>{" "}
                        {item.totalSold}
                      </div>
                      <div>
                        <span className="font-medium">Joined:</span>{" "}
                        {new Date(item.signUpDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-t border-gray-200 gap-4">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            users
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
    </div>
  );
};

export default UserList;