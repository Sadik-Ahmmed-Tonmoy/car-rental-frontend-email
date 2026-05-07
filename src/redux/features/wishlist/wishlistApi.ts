/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllWishlistItems: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `/wishlist`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["wishlist"],
    }),
    // getSingleExample: builder.query({
    //   query: (id) => ({
    //     url: `example/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["example"],
    // }),

    addToWishlist: builder.mutation({
      query: (id) => {
        return {
          url: "/wishlist/add",
          method: "POST",
          body: id,
        };
      },
      invalidatesTags: ["wishlist"],
    }),

    // updateExample: builder.mutation({
    //   query: (data) => {
    //     return {
    //       url: `example/${data?.id}`,
    //       method: "POST",
    //       body: data?.formData,
    //     };
    //   },
    //   invalidatesTags: ["example"],
    // }),
    removeFromWishlist: builder.mutation({
      query: (id) => {
        return {
          url: `/wishlist/remove/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["wishlist"],
    }),
  }),
});

export const {
  useAddToWishlistMutation,
  useGetAllWishlistItemsQuery,
  useRemoveFromWishlistMutation,
} = wishlistApi;
