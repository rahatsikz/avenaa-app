import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "~/lib/axios";
import { BookingProps } from "~/types";

const useGetBookings = ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
} = {}) => {
  return useQuery<any>({
    queryKey: ["bookings", page, limit],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/user-bookings?page=${page}&limit=${limit}`
        );

        return response.data.data;
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    },
    staleTime: 5 * 60 * 1000, //  Keep the data fresh for 5 minutes
    retry: 2, //  Retry failed queries up to 2 times
  });
};

const useCancelBooking = () => {
  return useMutation({
    mutationFn: async ({
      id,
      disapproveReason,
    }: {
      id: string;
      disapproveReason: string;
    }) => {
      try {
        const response = await axiosInstance.post(`/cancel-booking`, {
          id,
          disapproveReason,
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Request failed");
      }
    },
  });
};

const useCreateBooking = () => {
  return useMutation({
    mutationFn: async (payload: BookingProps) => {
      try {
        const response = await axiosInstance.post(`/booking`, payload);
        return response.data.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Request failed");
      }
    },
  });
};

// get single booking with bookingId
const useGetBooking = (id: string) => {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/booking/${id}`);
        return response.data.data;
      } catch (error) {
        console.error("Error fetching booking:", error);
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export { useCancelBooking, useCreateBooking, useGetBooking, useGetBookings };
