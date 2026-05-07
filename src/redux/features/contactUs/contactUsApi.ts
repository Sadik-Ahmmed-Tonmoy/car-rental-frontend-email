/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const contactUsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    

    createContact: builder.mutation({
      query: (data) => {
        return {
          url: "/contact/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["contact"],
    }),

   
  }),
});

export const {
    useCreateContactMutation,
} = contactUsApi;
