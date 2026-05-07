"use client";

import { Car, Clock, Diamond, Eye, Info } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import ProductsTableComponent from "../pages/dashboard/ProductsTableComponent/ProductsTableComponent";
import human from "@/assets/images/Human.png";

interface SellerOrRecentData {
  name: string;
  stock: number;
  value: number;
  avatar: string | StaticImageData;
}

export default function SellerDashboard() {
  const [analyticsFilter, setAnalyticsFilter] = useState("Last 7 days");

  const sellers: SellerOrRecentData[] = [
    {
      name: "Jenny Wilson",
      stock: 10,
      value: 276,
      avatar: human,
    },
    {
      name: "Jane Cooper",
      stock: 25,
      value: 276,
      avatar: human,
    },
    {
      name: "Wade Warren",
      stock: 10,
      value: 276,
      avatar: human,
    },
    {
      name: "Savannah Nguyen",
      stock: 20,
      value: 276,
      avatar: human,
    },
    {
      name: "Ronald Richards",
      stock: 10,
      value: 276,
      avatar: human,
    },
  ];
  const recentOrder: SellerOrRecentData[] = [
    {
      name: "Jenny Wilson",
      stock: 10,
      value: 276,
      avatar:
        "https://www.vertumotors.com/new/vertu/car/vauxhall/corsa/Corsa-GS-Turbo-2023%5E1024x768%5E.jpg",
    },
    {
      name: "Jane Cooper",
      stock: 25,
      value: 276,
      avatar:
        "https://www.vertumotors.com/new/vertu/car/vauxhall/corsa/Corsa-GS-Turbo-2023%5E1024x768%5E.jpg",
    },
    {
      name: "Wade Warren",
      stock: 10,
      value: 276,
      avatar:
        "https://www.vertumotors.com/new/vertu/car/vauxhall/corsa/Corsa-GS-Turbo-2023%5E1024x768%5E.jpg",
    },
    {
      name: "Savannah Nguyen",
      stock: 20,
      value: 276,
      avatar:
        "https://www.vertumotors.com/new/vertu/car/vauxhall/corsa/Corsa-GS-Turbo-2023%5E1024x768%5E.jpg",
    },
    {
      name: "Ronald Richards",
      stock: 10,
      value: 276,
      avatar:
        "https://www.vertumotors.com/new/vertu/car/vauxhall/corsa/Corsa-GS-Turbo-2023%5E1024x768%5E.jpg",
    },
  ];

  const chartData = [
    { day: "Mon", value: 125 },
    { day: "Tue", value: 118 },
    { day: "Wed", value: 135 },
    { day: "Thu", value: 122 },
    { day: "Fri", value: 145 },
    { day: "Sat", value: 138 },
    { day: "Sun", value: 142 },
  ];

  return (
    <>
      <div className="grid grid-cols-1 2xl:grid-cols-8 gap-6 w-full">
        {/* Left Sidebar */}

        {/* Main Content */}
        <div className="2xl:col-span-6 ">
          <div className="space-y-6">
            {/* Top Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="w-4 h-4 text-cyan-500" />
                  <span className="text-gray-600 text-sm">
                    Current Listings
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">560</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Diamond className="w-4 h-4 text-cyan-500" />
                  <span className="text-gray-600 text-sm">Stock value</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">£1050</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-cyan-500" />
                  <span className="text-gray-600 text-sm">
                    Listings due expire
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">£470</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-cyan-500" />
                  <span className="text-gray-600 text-sm">
                    Listing view average
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">250</p>
              </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-600 text-sm mb-2">Search results</h3>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-2xl font-bold text-gray-900">807.4K</p>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-red-500 text-sm">
                  14% less than previous 7 days
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-600 text-sm mb-2">
                  Clicks on listings
                </h3>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-2xl font-bold text-gray-900">807.4K</p>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  About the same as previous 7 days
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-600 text-sm mb-2">
                  Days adverts Listed
                </h3>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-2xl font-bold text-gray-900">-488</p>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  About the same as previous 7 days
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-gray-600 text-sm mb-2">Stock value</h3>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-2xl font-bold text-gray-900">£488.09</p>
                  <Info className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  About the same as previous 7 days
                </p>
              </div>
            </div>

            {/* Seller Analytics Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Seller analytics
                </h3>
                <select
                  value={analyticsFilter}
                  onChange={(e) => setAnalyticsFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>

              {/* Simple Chart */}
              <div className="relative h-64">
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                  <span>150.0k</span>
                  <span>140.0k</span>
                  <span>130.0k</span>
                  <span>120.0k</span>
                  <span>110.0k</span>
                  <span>0</span>
                </div>

                <div className="ml-12 h-full relative">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#06b6d4"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#06b6d4"
                          stopOpacity="0.1"
                        />
                      </linearGradient>
                    </defs>

                    {/* Chart area */}
                    <path
                      d="M 0 80 Q 50 100 100 75 Q 150 60 200 70 Q 250 50 300 45 Q 350 40 400 35 L 400 200 L 0 200 Z"
                      fill="url(#gradient)"
                    />

                    {/* Chart line */}
                    <path
                      d="M 0 80 Q 50 100 100 75 Q 150 60 200 70 Q 250 50 300 45 Q 350 40 400 35"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>

                <div className="absolute bottom-0 left-12 right-0 flex justify-between text-xs text-gray-500">
                  {chartData.map((item) => (
                    <span key={item.day}>{item.day}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="2xl:col-span-2 space-y-4 ">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
            <h3 className="text-base font-medium text-gray-900 mb-4 text-center">
              Top Seller
            </h3>

            {/* Sellers List */}
            <div className="space-y-4">
              {sellers.map((seller, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={seller.avatar || "/placeholder.svg"}
                      alt={seller.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {seller.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {seller.stock} Stock
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">£{seller.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-base font-medium text-gray-900 mb-4 text-center">
              Recent Orders
            </h3>

            {/* Sellers List */}
            <div className="space-y-4">
              {recentOrder.map((seller, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={seller.avatar || "/placeholder.svg"}
                      alt={seller.name}
                      width={32}
                      height={32}
                      className="w-12"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {seller.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {seller.stock} Stock
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">£{seller.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ProductsTableComponent />
    </>
  );
}
