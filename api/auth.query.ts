import { useMutation } from "@tanstack/react-query";
import axiosInstance from "~/lib/axios";

const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await axiosInstance.post(`/logout`);
        return response.data.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Request failed");
      }
    },
  });
};

const useLogin = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      try {
        const response = await axiosInstance.post(`/login`, {
          email,
          password,
        });
        return response.data.data;
      } catch (error: any) {
        console.log("rahil error", error);
        throw new Error(error?.response?.data?.message || "Request failed");
      }
    },
  });
};

const useSignup = () => {
  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      try {
        const response = await axiosInstance.post(`/signup`, {
          name,
          email,
          password,
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Request failed");
      }
    },
  });
};

const useSendOTP = () => {
  return useMutation({
    mutationFn: async ({ mobile }: { mobile: string }) => {
      try {
        const response = await axiosInstance.post(`/mobile-otp`, {
          mobile,
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Request failed");
      }
    },
  });
};

const useVerifyOTP = () => {
  return useMutation({
    mutationFn: async ({ mobile, otp }: { mobile: string; otp: string }) => {
      try {
        const response = await axiosInstance.post(`/mobile-otp-verify`, {
          mobile,
          otp,
        });
        // console.log("rahil response", response); 
        return response.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Request failed");
      }
    },
  });
};

const useOTPResend = () => {
  return useMutation({
    mutationFn: async ({ mobile }: { mobile: string }) => {
      try {
        const response = await axiosInstance.post(`/mobile-otp-resend`, {
          mobile,
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Request failed");
      }
    },
  });
};

export {
  useLogin,
  useLogout,
  useOTPResend,
  useSendOTP,
  useSignup,
  useVerifyOTP,
};
