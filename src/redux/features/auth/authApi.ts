/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

     getAllUsers: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data) {
          data?.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `/auth/get-all-users`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["user"],
    }),
    
    register: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/signup",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    login: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    changePassword: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/change-password",
          method: "PUT",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),

    googleLogin: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/google-login",
          method: "POST",
          body: userInfo,
        };
      },
    }),

    forgotPassword: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/forget-password",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    resetPassword: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/update-profile",
          method: "PATCH",
          body: userInfo,
        };
      },
      invalidatesTags: ["user"],
    }),
    otp: builder.mutation({
      query: (userInfo) => {
        return {
          url: "/auth/verify-otp",
          method: "POST",
          body: userInfo,
        };
      },
    }),
    resendOTP: builder.mutation({
      query: (data) => {
        console.log( data );
        return {
          url: "/auth/resend-otp",
          method: "POST",
          body: data,
        };
      },
    }),
    getMe: builder.query({
      query: () => ({
        url: "/auth/get-me",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/auth/get-user-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useRegisterMutation,
  useLoginMutation,
  useChangePasswordMutation,
  useGoogleLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
  useOtpMutation,
  useResendOTPMutation,
  useGetMeQuery,
  useGetUserByIdQuery,
} = authApi;
