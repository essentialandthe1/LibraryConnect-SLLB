import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../axios";

// ✅ Fetch files for a folder
export const useFiles = (folderId) => {
  return useQuery({
    queryKey: ["files", folderId],
    queryFn: async () => {
      // 🔽 Replace with backend endpoint
      const { data } = await api.get(`/folders/${folderId}/files`);
      return data;
    },
    enabled: !!folderId, // Only fetch if folderId is available
  });
};

// ✅ Upload new file
export const useUploadFile = () => {
  return useMutation({
    mutationFn: async ({ folderId, file }) => {
      const formData = new FormData();
      formData.append("file", file);

      // 🔽 Replace with backend endpoint
      const { data } = await api.post(`/folders/${folderId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
  });
};
