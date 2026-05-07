import LeftSideMenu from "@/components/pages/dashboard/LeftSideMenu/LeftSideMenu";
import WithAuthForAdmin from "@/components/WithAuthForAdmin/WithAuthForAdmin";
import type React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="md:flex justify-start gap-6 space-y-3 mt-8 mx-4">
      {/* left side */}
      <LeftSideMenu />

      {/* Main Content */}
      <div className="w-full flex flex-col justify-start items-start space-y-3">
        <WithAuthForAdmin>{children}</WithAuthForAdmin>
      </div>
    </div>
  );
}
