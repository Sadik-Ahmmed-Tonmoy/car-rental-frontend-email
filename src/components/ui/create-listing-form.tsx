"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Info, X, Plus } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import {
  useGetSingleVehicleQuery,
  useUpdateVehicleMutation,
} from "@/redux/features/vehicle/vehicleApi";
import { useRouter, useSearchParams } from "next/navigation";

// Schemas
const imageSchema = z.object({
  id: z.string(),
  file: z.instanceof(File).optional(),
  url: z.string().url(),
  isNew: z.boolean().optional(), // to know if uploaded in this session
});

const formSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Description must not exceed 1000 characters"),
  images: z
    .array(imageSchema)
    .min(4, "At least four images are required")
    .max(10, "Maximum 10 images allowed"),
});

const fileValidationSchema = z.object({
  type: z
    .string()
    .refine((type) => type.startsWith("image/"), "Only image files are allowed"),
  size: z.number().max(5 * 1024 * 1024, "File size must be less than 5MB"),
});

interface UploadedImage {
  id: string;
  file?: File;
  url: string;
  isNew?: boolean;
}

interface ValidationErrors {
  description?: string;
  images?: string;
  general?: string;
}

export default function CreateListingForm() {
  const [description, setDescription] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("id");
  const router = useRouter();

  const { data: getSingleVehicleQuery , isLoading } = useGetSingleVehicleQuery(vehicleId, {
    skip: !vehicleId,
  });
  const carData = getSingleVehicleQuery?.data;

  const [updateVehicleMutation] = useUpdateVehicleMutation();

  // Populate defaults when carData changes
  useEffect(() => {
    if (carData) {
      setDescription(carData.description || "");

      // Convert backend images to UploadedImage format
      if (carData.images && Array.isArray(carData.images)) {
        setUploadedImages(
          carData.images.map((url: string, idx: number) => ({
            id: `existing-${idx}`,
            url,
            isNew: false,
          }))
        );
      }
    }
  }, [carData]);

  const clearError = (field: keyof ValidationErrors) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newImages: UploadedImage[] = [];
    const fileErrors: string[] = [];

    if (uploadedImages.length + files.length > 10) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 10 images allowed",
      }));
      return;
    }

    Array.from(files).forEach((file) => {
      try {
        fileValidationSchema.parse({
          type: file.type,
          size: file.size,
        });
        const id = Math.random().toString(36).substr(2, 9);
        const url = URL.createObjectURL(file);
        newImages.push({ id, file, url, isNew: true });
      } catch (error) {
        if (error instanceof z.ZodError) {
          fileErrors.push(`${file.name}: ${error.errors[0].message}`);
        }
      }
    });

    if (fileErrors.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: fileErrors.join(", "),
      }));
    } else {
      clearError("images");
    }

    if (newImages.length > 0) {
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleAddPhotos = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    setUploadedImages((prev) => {
      const imageToDelete = prev.find((img) => img.id === imageId);
      if (imageToDelete?.isNew && imageToDelete.url.startsWith("blob:")) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      if (!imageToDelete?.isNew) {
        setDeletedImageIds((prevDeleted) => [...prevDeleted]);
      }
      return prev.filter((img) => img.id !== imageId);
    });
    clearError("images");
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    clearError("description");
  };

  const validateForm = () => {
    try {
      formSchema.parse({
        description,
        images: uploadedImages,
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          if (err.path.includes("description")) {
            newErrors.description = err.message;
          } else if (err.path.includes("images")) {
            newErrors.images = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      if (!validateForm()) return;

      const formData = new FormData();

      uploadedImages.forEach((image) => {
        if (image.isNew && image.file) {
          formData.append("images", image.file);
        }
      });

      const existingImages = uploadedImages.map((image) => !image.isNew ? image.url : null).filter(Boolean);

      const vehicleData = {
        images: existingImages,
        description,
        deletedImageIds, // let backend know which old images to remove
      };

      formData.append("data", JSON.stringify(vehicleData));

      const response = await handleAsyncWithToast(async () => {
        return updateVehicleMutation({ id: vehicleId, formData });
      });

      if (response?.data?.success) {
        router.push(`/seller-contact?id=${vehicleId}`);
      }
    } catch {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto sm:py-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg transition-colors ${
          dragActive
            ? "border-blue-primary bg-cyan-50"
            : "border-blue-primary bg-cyan-50/30"
        } ${errors.images ? "border-red-500 bg-red-50/30" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploadedImages.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white border-2 border-blue-primary rounded-lg flex items-center justify-center">
                <Camera className="w-8 h-8 text-blue-primary" />
              </div>
            </div>
            <button
              onClick={handleAddPhotos}
              className="bg-blue-primary hover:bg-cyan-600 text-white font-medium py-2.5 px-6 rounded-md transition-colors text-sm mb-3"
            >
              Add photos
            </button>
            <p className="text-gray-500 text-sm">or drop files here</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {uploadedImages.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image.url}
                      alt="Uploaded car image"
                      width={200}
                      height={200}
                      className="w-full h-full object-fill"
                      unoptimized
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {uploadedImages.length < 10 && (
                <button
                  onClick={handleAddPhotos}
                  className="aspect-square border-2 border-dashed border-blue-primary rounded-lg flex flex-col items-center justify-center hover:border-cyan-400 hover:bg-cyan-50 transition-colors"
                >
                  <Plus className="w-8 h-8 text-blue-primary mb-2" />
                  <span className="text-blue-primary text-sm font-medium">
                    Add more
                  </span>
                </button>
              )}
            </div>
            <p className="text-gray-500 text-sm text-center">
              {uploadedImages.length < 10
                ? "or drop more files here"
                : "Maximum 10 images reached"}
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {errors.images && (
        <p className="text-red-500 text-sm mt-2">{errors.images}</p>
      )}

      {/* Info Banner */}
      <div className="bg-cyan-50 border border-blue-primary/80 rounded-lg p-3 mb-8 mt-4 flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-primary" />
        <span className="text-blue-primary text-sm">
          More images give buyers confidence to contact you
        </span>
      </div>

      {/* Car Info */}
      {carData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {carData.make} {carData.model} {carData.variant}
          </h2>
          <p className="text-gray-600 text-sm">
            {carData.engine} {carData.bodyType} {carData.transmission}{" "}
            {carData.drivetrain} {carData.euro6}
          </p>
        </div>
      )}

      {/* Description */}
      <div className="mb-8">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-900 mb-3"
        >
          Add Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          rows={4}
          className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-1 resize-none text-sm transition-colors ${
            errors.description
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-cyan-500"
          }`}
          placeholder="Describe your vehicle's condition, features, and any additional details..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {description.length}/1000 characters
        </p>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <div>
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className={`w-full font-medium py-3 px-6 rounded-full transition-colors text-sm ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-primary hover:bg-cyan-600 text-white"
          }`}
        >
          {isSubmitting ? "Processing..." : "Next"}
        </button>
      </div>
    </div>
  );
}
