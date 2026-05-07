/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetAllUsersQuery } from "@/redux/features/auth/authApi";
import { Input, Pagination, Spin, Tag, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UsersPageComponent = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: string | number }[]
  >([
    { name: "page", value: currentPage },
    { name: "limit", value: itemsPerPage },
    { name: "search", value: debouncedSearch },
  ]);

  useEffect(() => {
    setObjectQuery([
      { name: "page", value: currentPage },
      { name: "limit", value: itemsPerPage },
      { name: "search", value: debouncedSearch },
    ]);
  }, [currentPage, itemsPerPage, debouncedSearch]);

  const {
    data: dataResponse,
    isLoading,
    isFetching,
  } = useGetAllUsersQuery(objectQuery);

  const users = dataResponse?.data?.users || [];
  const totalCount = dataResponse?.data?.totalUsers || 0;

  // Local handlers for actions
  const onView = (id: string) => {
    router.push(`/dashboard/user-details/${id}`);
  };

  // const onEdit = (id: string) => {
  //   message.success(`Editing user with ID: ${id}`);
  // };

  const onDelete = (id: string) => {
    message.warning(`Deleting user with ID: ${id}`);
  };

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full mb-7">
      {/* Search Field */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg font-semibold">User List</h2>
        <Input
          placeholder="Search by name or email..."
          allowClear
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        {/* Table Header - Hidden on small screens, shown as cards */}
        <div className="hidden md:grid md:grid-cols-13 gap-4 py-3 px-4 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
          <div className="col-span-3">User Name</div>
          <div className="col-span-2">Signup Date</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Total Listed</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2">
          {users.map((user: any) => (
            <div key={user.id} className="md:hidden">
              {/* Mobile Card View */}
              <div className="bg-white rounded-lg p-4 shadow-sm mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {user.firstName || ""} {user.lastName || ""}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.status === "ACTIVE" ? (
                      <Tag color="green" className="text-xs">
                        ACTIVE
                      </Tag>
                    ) : (
                      <Tag color="red" className="text-xs">
                        INACTIVE
                      </Tag>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Signup Date</p>
                    <p>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Listed</p>
                    <p>{user.vehicle?.length || 0}</p>
                  </div>
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => onDelete(user.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete"
                    aria-label={`Delete user ${user.firstName}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M21.1303 9.8531C22.2899 11.0732 22.2899 12.9268 21.1303 14.1469C19.1745 16.2047 15.8155 19 12 19C8.18448 19 4.82549 16.2047 2.86971 14.1469C1.7101 12.9268 1.7101 11.0732 2.86971 9.8531C4.82549 7.79533 8.18448 5 12 5C15.8155 5 19.1745 7.79533 21.1303 9.8531Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Desktop Table Rows */}
          {users.map((user: any) => (
            <div
              key={`desktop-${user.id}`}
              className="hidden md:grid md:grid-cols-13 gap-4 py-3 px-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* User Name */}
              <div className="col-span-3 flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName || ""} {user.lastName || ""}
                </span>
              </div>

              {/* Signup Date */}
              <div className="col-span-2 flex items-center">
                <span className="text-sm text-gray-600 truncate">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              {/* Email */}
              <div className="col-span-3 flex items-center">
                <span className="text-sm text-gray-600 truncate">
                  {user.email}
                </span>
              </div>

              {/* Total Listed */}
              <div className="col-span-2 flex items-center">
                <span className="text-sm font-medium truncate">
                  {user.vehicle?.length || 0}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2 flex items-center">
                {user.status === "ACTIVE" ? (
                  <Tag color="green" className="truncate">
                    ACTIVE
                  </Tag>
                ) : (
                  <Tag color="red" className="truncate">
                    INACTIVE
                  </Tag>
                )}
              </div>

              {/* Actions */}
              <div className="col-span-1 flex items-center justify-end gap-2">
                <button
                  onClick={() => onView(user.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="View"
                  aria-label={`View user ${user.firstName}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21.1303 9.8531C22.2899 11.0732 22.2899 12.9268 21.1303 14.1469C19.1745 16.2047 15.8155 19 12 19C8.18448 19 4.82549 16.2047 2.86971 14.1469C1.7101 12.9268 1.7101 11.0732 2.86971 9.8531C4.82549 7.79533 8.18448 5 12 5C15.8155 5 19.1745 7.79533 21.1303 9.8531Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center md:justify-end pt-4">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalCount}
          showSizeChanger
          pageSizeOptions={["10", "20", "50"]}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setItemsPerPage(pageSize);
          }}
          responsive
          showLessItems
        />
      </div>
    </div>
  );
};

export default UsersPageComponent;
