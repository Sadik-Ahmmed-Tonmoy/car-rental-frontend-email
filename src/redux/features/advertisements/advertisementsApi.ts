/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const advertisementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdvertisements: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `/advertisements`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["advertisements"],
    }),
    getSingleAdvertisement: builder.query({
      query: (id) => ({
        url: `/advertisements/${id}`,
        method: "GET",
      }),
      providesTags: ["advertisements"],
    }),
    getSingleAdvertisementBySessionId: builder.query({
      query: (id) => ({
        url: `/advertisements/by-session/${id}`,
        method: "GET",
      }),
      providesTags: ["advertisements"],
    }),

    createAdvertisement: builder.mutation({
      query: (data) => {
        return {
          url: "/advertisements/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["advertisements"],
    }),

    updateAdvertisement: builder.mutation({
      query: (data) => {
        return {
          url: `/advertisements/update/${data?.id}`,
          method: "PUT",
          body: data?.formData,
        };
      },
      invalidatesTags: ["advertisements"],
    }),
    updateAdvertisementBySessionId: builder.mutation({
      query: (data) => {
        return {
          url: `/advertisements/update-by-session/${data?.sessionId}`,
          method: "PUT",
          body: data?.formData,
        };
      },
      invalidatesTags: ["advertisements"],
    }),
    // deleteExample: builder.mutation({
    //   query: (id) => {
    //     return {
    //       url: `example/${id}`,
    //       method: "DELETE",
    //     };
    //   },
    //   invalidatesTags: ["example"],
    // }),
  }),
});

export const {
  useGetAllAdvertisementsQuery,
  useGetSingleAdvertisementQuery,
  useGetSingleAdvertisementBySessionIdQuery,
  useCreateAdvertisementMutation,
  useUpdateAdvertisementMutation,
  useUpdateAdvertisementBySessionIdMutation,
} = advertisementsApi;
