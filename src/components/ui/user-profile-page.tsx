/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Camera, Edit } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import human from "@/assets/images/Human.png";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";
import {
  useChangePasswordMutation,
  useGetMeQuery,
  useUpdateUserMutation,
} from "@/redux/features/auth/authApi";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import MyFormWrapper from "./MyForm/MyFormWrapper/MyFormWrapper";
import { Button } from "./buttons/button";
import MyFormInput from "./MyForm/MyFormInput/MyFormInput";

// Define the form schema using Zod
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  emailAddress: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  postcode: z.string().min(1, "Postcode is required"),
});

const changePasswordSchema = z.object({
  oldPassword: z.string({ required_error: "Old password is required" }).min(8, "Old password must be at least 8 characters"),
  newPassword: z.string({ required_error: "New password is required" }).min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string({ required_error: "Confirm password is required" }).min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof formSchema>;
type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | StaticImageData>(
    human
  );
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const token = useAppSelector(selectCurrentToken);
  const {
    data: userData,
    isSuccess: isUserDataFetched,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });

  const [changePassword] = useChangePasswordMutation();
  const [updateUser] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      emailAddress: "",
      address: "",
      postcode: "",
    },
  });

  useEffect(() => {
    if (isUserDataFetched && userData?.data) {
      setValue("firstName", userData.data.firstName || "");
      setValue("lastName", userData.data.lastName || "");
      setValue("phoneNumber", userData.data.phoneNumber || "");
      setValue("emailAddress", userData.data.email || "");
      setValue("address", userData.data.address || "");
      setValue("postcode", userData.data.postCode || "");
      setProfileImage(userData.data.profileImage || human);
    }
  }, [userData]);
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);

    const formattedData = {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.emailAddress,
      address: data.address,
      postCode: data.postcode,
    };

    const formData = new FormData();
    if (profileImageFile) {
      formData.append("profileImage", profileImageFile);
    }
    formData.append("data", JSON.stringify(formattedData));

    await handleAsyncWithToast(async () => updateUser(formData));

    setIsEditing(false);
    // Here you would typically send the data to your backend
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };


  async function handlePasswordChange(
    data: { oldPassword: string; newPassword: string }
  ) {
    if (!data.oldPassword || !data.newPassword) {
      console.error("Old password and new password are required.");
      return;
    }

    // Prepare payload for password change
    const payload = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    };

    await handleAsyncWithToast(async () => changePassword(payload));
  }

  return (
    <div className="lg:col-span-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
        {/* Header with Profile Image and Edit Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="relative">
              <Image
                src={profileImage || human}
                alt="Profile"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-cyan-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmit)}
                type="button"
                className="bg-blue-primary hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={handleEditClick}
              className="bg-blue-primary hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center gap-2 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Row - Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                disabled={!isEditing}
                {...register("firstName")}
                className={`w-full px-3 py-2.5 border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
                placeholder=""
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                disabled={!isEditing}
                {...register("lastName")}
                className={`w-full px-3 py-2.5 border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
                placeholder=""
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Second Row - Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                disabled={!isEditing}
                {...register("phoneNumber")}
                className={`w-full px-3 py-2.5 border ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
                placeholder=""
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="emailAddress"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="emailAddress"
                disabled={!isEditing}
                {...register("emailAddress")}
                className={`w-full px-3 py-2.5 border ${
                  errors.emailAddress ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
                placeholder=""
              />
              {errors.emailAddress && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.emailAddress.message}
                </p>
              )}
            </div>
          </div>

          {/* Third Row - Password */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Old Password
              </label>
              <input
                type="password"
                id="newPassword"
                disabled={!isEditing}
                {...register("newPassword")}
                className={`w-full px-3 py-2.5 border ${errors.newPassword ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm ${!isEditing ? "bg-gray-100" : ""}`}
                placeholder=""
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="retypePassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                 New Password
              </label>
              <input
                type="password"
                id="retypePassword"
                disabled={!isEditing}
                {...register("retypePassword")}
                className={`w-full px-3 py-2.5 border ${errors.retypePassword ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm ${!isEditing ? "bg-gray-100" : ""}`}
                placeholder=""
              />
              {errors.retypePassword && (
                <p className="mt-1 text-sm text-red-500">{errors.retypePassword.message}</p>
              )}
            </div>
          </div> */}

          {/* Fourth Row - Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                disabled={!isEditing}
                {...register("address")}
                className={`w-full px-3 py-2.5 border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
                placeholder=""
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="postcode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Postcode
              </label>
              <input
                type="text"
                id="postcode"
                disabled={!isEditing}
                {...register("postcode")}
                className={`w-full px-3 py-2.5 border ${
                  errors.postcode ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-sm ${
                  !isEditing ? "bg-gray-100" : ""
                }`}
                placeholder=""
              />
              {errors.postcode && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.postcode.message}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>

{/* old password and set new password */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Change Password
        </h2>
       <MyFormWrapper
            onSubmit={handlePasswordChange}
            resolver={zodResolver(changePasswordSchema)}
            className="space-y-6"
          >
            <div className="rounded-lg space-y-6 text-sm">
              <MyFormInput
                name="oldPassword"
                type="password"
                label="Old Password"
                labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
              />

              <MyFormInput
                name="newPassword"
                type="password"
                label="New Password"
                labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
              />

              <MyFormInput
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                labelClassName="text-[#525252] font-dm-sans text-sm mb-1"
              />

              {/* Send reset link button */}
              <Button className="w-full bg-blue-primary hover:bg-cyan-600 text-white! py-2 px-4 rounded-md font-medium cursor-pointer">
                Send 
              </Button>
            </div>
          </MyFormWrapper>
      </div>
    </div>
  );
}
