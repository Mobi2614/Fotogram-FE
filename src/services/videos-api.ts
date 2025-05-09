import axiosClient from "@/lib/axios-client";
import { errorHandler } from "@/lib/utils";

type VideoPayloadType = {
  title: string;
  description: string;
  url: string;
  tags: string[];
  creator: string;
  thumbnailUrl: string;
};

export async function createVideo(data: VideoPayloadType) {
  try {
    const res = await axiosClient.post(`/videos`, data);
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}

export async function deleteVideo(videoId: string) {
  try {
    const res = await axiosClient.delete(`/videos/${videoId}`);
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}

export async function getCreatorVideos() {
  try {
    const res = await axiosClient.get(`/videos`);
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}

export async function getFeedVideos(params?: object) {
  try {
    const res = await axiosClient.get(`/videos/feed`, {
      params,
    });
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}

export async function likeVideo(videoId: string) {
  try {
    const res = await axiosClient.get(`/videos/${videoId}/like`);
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}

export async function viewVideo(videoId: string) {
  try {
    const res = await axiosClient.get(`/videos/${videoId}/view`);
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}
