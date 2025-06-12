import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "~/lib/axios";
import { BankDetailProps, User } from "~/types";

const useGetProfile = ({ enabled }: { enabled?: boolean }) => {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/me`);

        return response.data.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Request failed");
      }
    },
    enabled: !!enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 0,
  });
};
const useUserInfoUpdate = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, Partial<User>>({
    mutationFn: async (data: Partial<User>) => {
      try {
        const response = await axiosInstance.patch(`/user/${userId}`, {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        });
        return response.data.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to update profile"
        );
      }
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["user"] })
        .catch(console.error);
    },
    onError: (error) => {
      console.error("Profile update failed:", error.message);
    },
  });
};

const useUserDocsUpdate = (userId: string) => {
  return useMutation({
    mutationFn: async (payload: FormData) => {
      try {
        const response = await axiosInstance.patch(
          `/user/doc/${userId}`,
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data.data;
      } catch (error: any) {
        console.error(error);
        throw new Error(
          error.response?.data?.message || "Failed to update profile"
        );
      }
    },
  });
};

const useCreateBankDetail = () => {
  return useMutation({
    mutationFn: async (payload: BankDetailProps & { userId: string }) => {
      try {
        const response = await axiosInstance.post(`/bank-details`, payload);
        return response.data.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to update profile"
        );
      }
    },
  });
};

export {
  useCreateBankDetail,
  useGetProfile,
  useUserDocsUpdate,
  useUserInfoUpdate,
};
