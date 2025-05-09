import axiosClient from "@/lib/axios-client";

export async function uploadFile(data: FormData) {
  try {
    const res = await axiosClient.post(`/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
