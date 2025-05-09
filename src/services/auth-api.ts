import axiosClient from "@/lib/axios-client";
import { API_URL } from "@/lib/constants";
import { errorHandler } from "@/lib/utils";
import axios from "axios";

export async function login(data: { email: string; password: string }) {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, data);
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}

export type RegisterFormType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  role: "creator" | "consumer";
};
export async function register(data: RegisterFormType) {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, data);
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}

type OTPFormType = {
  recipient: string;
  otp: string;
  type: string;
  context: string;
};

export async function verifyOTP(data: OTPFormType) {
  try {
    const res = await axios.post(`${API_URL}/auth/verify-otp`, data);
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}

export async function getCurrentUser() {
  try {
    const res = await axiosClient.get(`/auth/me`);
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}
export async function updateUser(userId: string, data: object) {
  try {
    const res = await axiosClient.put(`/users/${userId}`, data);
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
}
