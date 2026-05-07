/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectCurrentToken } from "@/redux/features/auth/authSlice";
import { verifyToken } from "@/utils/verifyToken";
import { signOut } from "next-auth/react";
import { useGetMeQuery } from "@/redux/features/auth/authApi";

const WithAuthForAdmin = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const token = useAppSelector(selectCurrentToken); // Check for token
  const user: any | null = token ? verifyToken(token) : null;

  const { data: userData } = useGetMeQuery(undefined, {
    skip: !token,
  });
  useEffect(() => {
    if (!token) {
      router.replace("/auth/login"); // Redirect if not authenticated
    } else if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
      dispatch(logout());
      signOut({ callbackUrl: "/auth/login" });
      router.replace("/auth/login");
    } else {
      setLoading(false); // Stop loading once authenticated
    }
  }, [router, token, user, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Profile Header */}
      <div className="flex items-center justify-between w-full bg-white  rounded-lg ">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-gray-600 text-sm">
              Hello {userData?.data?.firstName || "User"} 👋🏻
            </p>
            <p className="font-semibold text-gray-900"></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            {/* <Image
                src={human || "/placeholder.svg"}
                alt="Kristin"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              /> */}
          </div>
          <div>
            <p className="text-gray-600 text-sm">
              {userData?.data?.firstName || "User"}
            </p>
            {/* <p className="font-semibold text-gray-900">Kristin</p> */}
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default WithAuthForAdmin;
