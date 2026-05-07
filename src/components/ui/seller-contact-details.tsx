/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useGetSingleVehicleQuery, useUpdateVehicleMutation } from "@/redux/features/vehicle/vehicleApi";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { z } from "zod";

interface ContactNumber {
  id: string;
  value: string;
}

interface ValidationErrors {
  contactNumbers?: string[];
  email?: string;
  address?: string;
  postcode?: string;
}

// Zod schema for validation
const sellerContactSchema = z.object({
  contactNumbers: z
    .array(
      z.object({
        id: z.string(),
        value: z.string().min(1, "Contact number is required"),
      })
    )
    .min(1, "At least one contact number is required")
    .refine(
      (numbers) => numbers.some((num) => num.value.trim() !== ""),
      "At least one contact number must be filled"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  address: z.string().min(1, "Address is required"),
  postcode: z.string().min(1, "Postcode is required"),
});

export default function SellerContactDetails() {
  const [contactNumbers, setContactNumbers] = useState<ContactNumber[]>([
    { id: "1", value: "" },
  ]);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const nextIdRef = useRef(2); // Keep track of the next ID to use
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("id");
  const router = useRouter();

  const handleContactNumberChange = (id: string, value: string) => {
    setContactNumbers((prev) =>
      prev.map((number) => (number.id === id ? { ...number, value } : number))
    );

    // Clear contact number errors when user starts typing
    if (errors.contactNumbers) {
      setErrors((prev) => ({ ...prev, contactNumbers: undefined }));
    }
  };

  const addAnotherNumber = () => {
    const newId = nextIdRef.current.toString();
    nextIdRef.current += 1;
    setContactNumbers((prev) => [...prev, { id: newId, value: "" }]);
  };

  const removeContactNumber = (id: string) => {
    if (contactNumbers.length > 1) {
      setContactNumbers((prev) => prev.filter((number) => number.id !== id));
    }
  };

  const clearFieldError = (field: keyof ValidationErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const [updateVehicleMutation] = useUpdateVehicleMutation();

  const handleContinueToPayment = async () => {
    // Prepare data for validation
    const data = {
      contactNumbers,
      email,
      address,
      postcode,
    };

    // Validate with Zod
    const result = sellerContactSchema.safeParse(data);

    if (!result.success) {
      // Parse Zod errors into our error format
      const validationErrors: ValidationErrors = {};

      result.error.errors.forEach((error) => {
        const path = error.path.join(".");

        if (path.startsWith("contactNumbers")) {
          if (!validationErrors.contactNumbers) {
            validationErrors.contactNumbers = [];
          }
          validationErrors.contactNumbers.push(error.message);
        } else if (path === "email") {
          validationErrors.email = error.message;
        } else if (path === "address") {
          validationErrors.address = error.message;
        } else if (path === "postcode") {
          validationErrors.postcode = error.message;
        }
      });

      setErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    // Filter out empty contact numbers for final data
    const filledNumbers = contactNumbers.filter(
      (number) => number.value.trim() !== ""
    );

    const formData = new FormData();

    const vehicleData = {
      contactNumber: filledNumbers.map((number) => number.value),
      contactEmail: email,
      address,
      postCode: postcode,
    };

    formData.append("data", JSON.stringify(vehicleData));

    const response = await handleAsyncWithToast(async () => {
      return updateVehicleMutation({
        id: vehicleId,
        formData,
      });
    });
    if (response?.data?.success) {
      router.push(`/`);
    }
  };

  

    const { isLoading, data: getSingleVehicleQuery } = useGetSingleVehicleQuery(
      vehicleId,
      {
        skip: !vehicleId,
      }
    );
  
  
    useEffect(() => {
      if (getSingleVehicleQuery?.data) {
        const vehicleData = getSingleVehicleQuery.data;
        if (vehicleData.contactNumber?.length > 0) {
          setContactNumbers(
            vehicleData.contactNumber.map((number: string, idx: number) => ({
              id: (idx + 1).toString(),
              value: number,
            }))
          );
        }
        setEmail(vehicleData.contactEmail || "");
        setAddress(vehicleData.address || "");
        setPostcode(vehicleData.postCode || "");
      }
    }, [getSingleVehicleQuery?.data]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      );
    }



  return (
    <div className="max-w-2xl mx-auto px-2 sm:p-6 ">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">
          Seller contact details
        </h1>
        <p className="text-gray-600 text-sm">
          Add your contact details so buyers are able reach out to you
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Contact Numbers */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Contact number
          </label>
          <div className="space-y-3">
            {contactNumbers.map((number) => (
              <div key={number.id} className="flex gap-2">
                <input
                  type="tel"
                  value={number.value}
                  onChange={(e) =>
                    handleContactNumberChange(number.id, e.target.value)
                  }
                  className={`flex-1 px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
                    errors.contactNumbers
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                  }`}
                  placeholder=""
                />
                {contactNumbers.length > 1 && (
                  <button
                    onClick={() => removeContactNumber(number.id)}
                    className="px-1 py-2.5 text-red-500 hover:text-red-600 text-sm"
                  >
                    <MdDeleteOutline size={22} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Another Number Link */}
          {/* <button
            onClick={addAnotherNumber}
            className="text-blue-primary hover:text-cyan-600 text-sm font-medium mt-3 transition-colors cursor-pointer"
          >
            Add another number
          </button> */}

          {/* Contact Number Errors */}
          {errors.contactNumbers && (
            <div className="mt-2">
              {errors.contactNumbers.map((error, index) => (
                <p key={index} className="text-red-600 text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900 mb-3"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
              errors.email
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
            }`}
            placeholder=""
          />
          {errors.email && (
            <p className="mt-2 text-red-600 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-900 mb-3"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              clearFieldError("address");
            }}
            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
              errors.address
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
            }`}
            placeholder=""
          />
          {errors.address && (
            <p className="mt-2 text-red-600 text-sm">{errors.address}</p>
          )}
        </div>

        {/* Postcode */}
        <div>
          <label
            htmlFor="postcode"
            className="block text-sm font-medium text-gray-900 mb-3"
          >
            Postcode
          </label>
          <input
            type="text"
            id="postcode"
            value={postcode}
            onChange={(e) => {
              setPostcode(e.target.value);
              clearFieldError("postcode");
            }}
            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-1 text-sm ${
              errors.postcode
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
            }`}
            placeholder=""
          />
          {errors.postcode && (
            <p className="mt-2 text-red-600 text-sm">{errors.postcode}</p>
          )}
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-12">
        <button
          onClick={handleContinueToPayment}
          className="w-full bg-blue-primary hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-full transition-colors text-sm cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
