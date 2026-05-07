/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const vehicleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllVehicle: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `/vehicle`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["vehicle"],
    }),
    getAllVehicleByUser: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `/vehicle/by-user`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["vehicle"],
    }),
    getAllVehicleBySearch: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `/vehicle/search`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["vehicle"],
    }),
    getAllVehicleByVehicleType: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data?.objectQuery) {
          data?.objectQuery?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `/vehicle/by-vehicle-class`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["vehicle"],
    }),
    getSingleVehicle: builder.query({
      query: (id) => ({
        url: `vehicle/${id}`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),

    getAllBrands: builder.query({
      query: () => ({
        url: `vehicle/dropdown/makesAndBrands`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
 
    getAllModels: builder.query({
      query: (id) => ({
        url: `vehicle/dropdown/models?makeId=${id}`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
    getAllVariants: builder.query({
      query: (id) => ({
        url: `vehicle/dropdown/variants?modelId=${id}`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
    getAllEngine: builder.query({
      query: (id) => ({
        url: `vehicle/dropdown/engine-sizes?modelId=${id}`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
    getEngineCapacityCc: builder.query({
      query: () => ({
        url: `vehicle/dropdown/engine-capacity-cc`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
    getEngineCapacityLitres: builder.query({
      query: () => ({
        url: `vehicle/dropdown/engine-capacity-litres`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
    getAllFuelType: builder.query({
      query: () => ({
        url: `vehicle/dropdown/fuel-types`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
    getAllYears: builder.query({
      query: () => ({
        url: `vehicle/dropdown/years`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
    getAllTransmission: builder.query({
      query: () => ({
        url: `vehicle/dropdown/transmissions`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
    getAllMilageRange: builder.query({
      query: () => ({
        url: `vehicle/dropdown/mileage-ranges`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
    getAllBodyStyle: builder.query({
      query: () => ({
        url: `vehicle/dropdown/body-styles`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
    getAllDoors: builder.query({
      query: () => ({
        url: `vehicle/dropdown/doors`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),
    getAllColors: builder.query({
      query: () => ({
        url: `vehicle/dropdown/colours`,
        method: "GET",
      }),
      providesTags: ["vehicle"],
    }),

    createVehicle: builder.mutation({
      query: (data) => {
        return {
          url: "/vehicle/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["vehicle"],
    }),

    updateVehicle: builder.mutation({
      query: (data) => {
        return {
          url: `/vehicle/update/${data?.id}`,
          method: "PATCH",
          body: data?.formData,
        };
      },
      invalidatesTags: ["vehicle"],
    }),
    deleteVehicle: builder.mutation({
      query: (id) => {
        return {
          url: `/vehicle/delete/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["vehicle"],
    }),
  }),
});

export const {
  useGetAllVehicleQuery,
  useGetAllVehicleBySearchQuery,
  useGetAllVehicleByUserQuery,
  useGetAllVehicleByVehicleTypeQuery,
  useUpdateVehicleMutation,
  useCreateVehicleMutation,
  useGetSingleVehicleQuery,
  useGetAllBrandsQuery,
  useGetAllModelsQuery,
  useGetAllVariantsQuery,
  useGetAllEngineQuery,
  useGetAllFuelTypeQuery,
  useGetAllYearsQuery,
  useGetAllTransmissionQuery,
  useGetAllMilageRangeQuery,
  useGetAllBodyStyleQuery,
  useGetAllDoorsQuery,
  useGetAllColorsQuery,
  useGetEngineCapacityCcQuery,
  useGetEngineCapacityLitresQuery,
  useDeleteVehicleMutation,
} = vehicleApi;
