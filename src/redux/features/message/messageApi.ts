/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    

    createMessage: builder.mutation({
      query: (data) => {
        return {
          url: "/message/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["contact"],
    }),

   
  }),
});

export const {
  useCreateMessageMutation,
} = messageApi;
