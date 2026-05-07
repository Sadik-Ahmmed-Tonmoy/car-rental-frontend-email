/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { User, Heart, ChevronDown, LayoutDashboard, Menu, List } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer, Button, Modal } from "antd";
import human from '@/assets/images/Human.png'
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import { useGetMeQuery } from "@/redux/features/auth/authApi";


export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSalvageOpen, setIsSalvageOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=80&width=80"
  );
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [visible, setVisible] = useState(false); // Controls Modal visibility
  const token = useAppSelector(selectCurrentToken);
  const {
    data: userData,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });
  const menuItems = [
    {
      id: "My Profile",
      label: "My Profile",
      icon: User,
      link: "/profile",
      hasDropdown: false,
    },
    {
      id: "My Listing",
      label: "My Listing",
      icon: List,
      link: "/profile/my-listing",
      hasDropdown: false,
    },
    {
      id: "Wishlist",
      label: "Wishlist",
      icon: Heart,
      link: "/wishlist",
      hasDropdown: false,
    },
    // {
    //   id: "Dashboard",
    //   label: "Dashboard",
    //   icon: LayoutDashboard,
    //   link: "/profile/dashboard",
    //   hasDropdown: false,
    // }, 
  ];

  // Determine active menu item based on current path
  const getActiveMenuItem = () => {
    if (pathname === "/profile") return "My Profile";
    if (pathname === "/profile/my-listing") return "My Listing";
    if (pathname === "/wishlist") return "Wishlist";
    if (pathname === "/profile/dashboard") return "Dashboard";
    return "My Profile"; // default
  };
 
  const activeMenuItem = getActiveMenuItem();

  const renderMenuItems = () => (
    <>
      {menuItems.map((item) => (
        <div key={item.id}>
          <Link href={item.link} passHref>
            <button
              onClick={() => {
                if (item.id === "Salvage") {
                  setIsSalvageOpen(!isSalvageOpen);
                }
                setDrawerVisible(false);
              }}
              className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors cursor-pointer ${
                activeMenuItem === item.id
                  ? "bg-blue-primary text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.hasDropdown && (
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isSalvageOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>
          </Link>
        </div>
      ))}
    </>
  );

  return (
    <div className="md:flex justify-start gap-6 space-y-3  py-8">
      {/* Mobile Menu Button (visible only on small screens) */}
      <div className="block md:hidden z-50  ">
        <Button
          type="primary"
          icon={<Menu className="w-5 h-5" />}
          onClick={() => setDrawerVisible(true)}
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-3 p-4">
            <div className="relative">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt="Kristin"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Hello 👋</p>
              <p className="font-semibold text-gray-900">Kristin</p>
            </div>
          </div>
        }
        placement="left"
        closable={true}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={300}
        bodyStyle={{ padding: 0 }}
      >
        <div className="py-2">{renderMenuItems()}</div>
      <SubscribeButton setVisible={setVisible} />
      </Drawer>

      {/* Left Sidebar (visible only on medium and larger screens) */}
      <div className="hidden md:block md:w-[400px] w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={userData?.data?.profileImage ? userData?.data?.profileImage : human}
                  alt="Kristin"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Hello 👋</p>
                <p className="font-semibold text-gray-900">{userData?.data?.firstName || "User"}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="py-2">{renderMenuItems()}</div>
        </div>
        {/* <SubscribeButton setVisible={setVisible} /> */}
      </div>

      {/* Main Content */}
      <div className="w-full ">{children}</div>
      <Modal
        visible={visible}
        footer={null}
        closable={false}
        centered
        width={400}
        bodyStyle={{
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Free trial period has now ended
          </h3>

          <p className="text-gray-600">
            Subscribe now to continue using dashboard features.
          </p>

          <p className="text-lg font-medium text-gray-900">
            Price: $2.99/month
          </p>

          <Button
            type="primary"
            size="large"
            //   onClick={onSubscribe}
            style={{
              width: "100%",
              height: "40px",
              fontWeight: 500,
              marginTop: "16px",
            }}
          >
            Subscribe now
          </Button>

          <div className="mt-4">
            {/* Replace with actual Stripe logo component */}
            STRIPE
            {/* Or use: */}
            {/* <img src="/stripe-logo.png" alt="Stripe" className="h-8" /> */}
          </div>
        </div>
      </Modal>
    </div>
  );
}

const SubscribeButton = ({
  setVisible,
}: {
  setVisible: (visible: boolean) => void;
}) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-sm border border-gray-200 p-6 max-w-md mx-auto mt-5">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Enjoy 30 days free access
        </h3>
        <p className="text-gray-600">
          Subscribe now to continue using dashboard features
        </p>
        <Button
          type="primary"
          onClick={() => setVisible(true)}
          className="bg-blue-primary! hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
        >
          Subscribe now
        </Button>
      </div>
    </div>
  );
};
