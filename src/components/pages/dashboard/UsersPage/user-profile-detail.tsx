/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetUserByIdQuery } from "@/redux/features/auth/authApi";
import { useDeleteVehicleMutation } from "@/redux/features/vehicle/vehicleApi";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { Edit, Eye, MapPin, Trash2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function UserProfileDetail() {
  const params = useParams();
  const userId = params.userId as string;
  const [activeTab, setActiveTab] = useState("User Information");

  const tabs = [
    {
      id: "User Information",
      label: "User Information",
      icon: User,
    },
    {
      id: "Live listings",
      label: "Live listings",
      icon: Edit,
    },
  ];
  const { data: userData } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });

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

  const renderUserInformation = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      {/* Left Column */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Full Name</label>
          <p className="text-gray-900 font-medium">
            {userData?.data?.firstName} {userData?.data?.lastName}
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Email</label>
          <p className="text-gray-900">{userData?.data?.email}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Joining Date
          </label>
          <p className="text-gray-900">{
          
            new Date(userData?.data?.createdAt).toLocaleDateString()
            }</p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Address</label>
          <p className="text-gray-900">{userData?.data?.address || "Unknown"}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Status</label>
          <p className="text-gray-900">{userData?.data?.status || "Unknown"}</p>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Phone Number
          </label>
          <p className="text-gray-900">
            {userData?.data?.phoneNumber || "Unknown"}
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Live listings
          </label>
          <p className="text-gray-900 font-medium">
            {userData?.data?.vehicle?.length || 0}
          </p>
        </div>

        {/* <div>
          <label className="block text-sm text-gray-500 mb-1">
            Ended listings
          </label>
          <p className="text-gray-900">{userData?.data?.endedListings || 0}</p>
        </div> */}

        {/* <div>
          <label className="block text-sm text-gray-500 mb-1">City</label>
          <p className="text-gray-900">{userData?.data?.city || "Unknown"}</p>
        </div> */}

        <div>
          <label className="block text-sm text-gray-500 mb-1">Post Code</label>
          <p className="text-gray-900">
            {userData?.data?.postCode || "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );

 const renderLiveListings = () => (
  <div className="space-y-4">
    {/* Table Header */}
    <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
      <div className="col-span-3">Product Name</div>
      <div className="col-span-2">Seller Email</div>
      <div className="col-span-4">Product Location</div>
      <div className="col-span-2">Date</div>
      <div className="col-span-1 text-center">Actions</div>
    </div>

    {/* Table Rows */}
    <div className="space-y-2">
      {userData?.data?.vehicle?.map((listing: any, index: number) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-4 py-3 px-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="col-span-3 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-900">
              {listing.make} {listing.model}
            </span>
          </div>
          <div className="col-span-2 flex items-center">
            <span className="text-sm text-gray-600">{listing.contactEmail}</span>
          </div>
          <div className="col-span-4 flex items-center">
            <span className="text-sm text-gray-600">
              {listing.address || "Unknown"}
            </span>
          </div>
          <div className="col-span-2 flex items-center">
            <span className="text-sm text-gray-600">
              {new Date(listing.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="col-span-1 flex items-center justify-center gap-2">
                 <button
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="View"
                >
                  <Link href={`/vehicle-details/${listing.id}`}>
                    <Eye className="w-4 h-4" />
                  </Link>
                </button>
            <button
              onClick={() => handleDelete(listing.id)}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);



  const renderTabContent = () => {
    switch (activeTab) {
      case "User Information":
        return renderUserInformation();
      case "Live listings":
        return renderLiveListings();
      // case "Ended listings":
      //   return renderEndedListings()
      default:
        return renderUserInformation();
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-8 p-6">
        <div className="relative">
          <Image
            src={userData?.data?.profileImage || "/placeholder.svg"}
            alt={userData?.data?.firstName || "User"}
            width={80}
            height={80}
            className="w-20 h-20 rounded-lg object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {userData?.data?.firstName || "User"}
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {userData?.data?.address || "Unknown Location"}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "border-blue-primary text-blue-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-6 pb-8">{renderTabContent()}</div>
    </div>
  );
}
