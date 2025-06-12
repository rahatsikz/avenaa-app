import { useMutation, useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import axiosInstance from "~/lib/axios";
import { IProperty } from "~/types";

const useGetProperty = (propertyId: string) => {
  return useQuery<IProperty>({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/property/${propertyId}`);
      return response.data.data;
    },
    enabled: !!propertyId, // Only run the query if productId is truthy
    retry: 2, // Optional: Retry failed queries up to 2 times
  });
};

const useGetAllProperties = ({
  destination = "",
  from = format(new Date(), "yyyy-MM-dd"),
  to = format(addDays(new Date(), 3), "yyyy-MM-dd"),
  adults = "",
  rooms = "",
  children = "",
  filter = {},
  userId = "",
  wishlist = false,
  isEnabled = true,
  limit = 2,
  page = 1,
}) => {
  return useQuery({
    queryKey: [
      "property",
      {
        destination,
        from,
        to,
        adults,
        rooms,
        children,
        userId,
        wishlist,
        limit,
        page,
      },
    ],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/properties2`, {
          params: {
            destination: JSON.stringify(destination),
            from: from,
            to: to,
            adults,
            rooms,
            children,
            page: JSON.stringify(page),
            limit: JSON.stringify(limit),
            filter: JSON.stringify(filter),
            userId: JSON.stringify(userId),
            wishlist: JSON.stringify(wishlist),
          },
          withCredentials: true,
        });

        return response.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    // staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: isEnabled,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

const useGetPropertyBySlug = (slug: string) => {
  return useQuery<IProperty>({
    queryKey: ["property", slug],
    queryFn: async () => {
      const response = await axiosInstance.get(`/property-by-slug/${slug}`);
      return response.data.data;
    },
  });
};

// add to wishlist

const useAddToWishlist = () => {
  return useMutation({
    mutationFn: async (payload: {
      userId: string;
      propertyId: string;
      isFavourite: boolean;
    }) => {
      try {
        const response = await axiosInstance.post(`/wishlist`, payload);
        return response.data.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Request failed");
      }
    },
  });
};

// get wishlist by userId

const useGetWishlist = (userId: string) => {
  return useQuery({
    queryKey: ["wishlist", userId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/wishlist/${userId}`);
        return response.data.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Request failed");
      }
    },
  });
};

export {
  useAddToWishlist,
  useGetAllProperties,
  useGetProperty,
  useGetPropertyBySlug,
  useGetWishlist,
};
