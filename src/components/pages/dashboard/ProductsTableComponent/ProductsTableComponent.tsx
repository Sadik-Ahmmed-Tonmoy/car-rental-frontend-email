/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";

type Product = {
  name: string;
  productId: string;
  location: string;
  sellDate: string;
  sellerName: string;
  image: string;
};

const ProductsTableComponent = () => {
  const [data, setData] = useState<Product[]>([
    {
      name: "Sapphire Convertible",
      productId: "DL12653",
      location: "3891 Ranchview Dr. Richardson, California",
      sellDate: "01 March 2024",
      sellerName: "New Jersey",
      image: "https://www.vertumotors.com/new/vertu/car/vauxhall/corsa/Corsa-GS-Turbo-2023%5E1024x768%5E.jpg",
    },
    {
      name: "Sapphire Convertible",
      productId: "DL12653",
      location: "3891 Ranchview Dr. Richardson, California",
      sellDate: "01 March 2024",
      sellerName: "New Jersey",
      image: "https://www.vertumotors.com/new/vertu/car/vauxhall/corsa/Corsa-GS-Turbo-2023%5E1024x768%5E.jpg",
    },
    // Add more data as needed
  ]);

  const columns: {
    key: keyof Product;
    header: string;
    render: (value: string) => React.ReactNode;
  }[] = [
    {
      key: "image",
      header: "Product Image",
      render: (value: string) => (
        <div className="w-16 h-12 relative">
          <Image
            src={value || "/placeholder.svg"}
            alt="Product Image"
            fill
            className="object-cover rounded"
          />
        </div>
      ),
    },
    {
      key: "name",
      header: "Product Name",
      render: (value: string) => <div className="font-semibold">{value}</div>,
    },
    {
      key: "productId",
      header: "Product ID",
      render: (value: string) => <span>{value}</span>,
    },
    {
      key: "location",
      header: "Product Location",
      render: (value: string) => <span>{value}</span>,
    },
    {
      key: "sellDate",
      header: "Sell Date",
      render: (value: string) => <span>{value}</span>,
    },
    {
      key: "sellerName",
      header: "Seller Name",
      render: (value: string) => <span>{value}</span>,
    },
  ];

  return (
    <div className="w-full mx-auto my-6  rounded-lg shadow-sm border border-gray-200 px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Products Selling List</h2>
        <button className="border border-gray-200 text-sm font-normal px-3 py-1 rounded-lg cursor-pointer">View All</button>
      </div>

      <div className="overflow-x-auto ">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
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
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={`${item.productId}-${column.key}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.render(item[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTableComponent;
