import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../axios";
import { auth } from "../api";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const response = await axiosInstance.post(auth.login, credentials);
      return response.data; // expected { token, role }
    },
  });
};
