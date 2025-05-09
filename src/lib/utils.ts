import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function errorHandler(error: unknown) {
  if (error instanceof AxiosError) {
    if (error.response?.data) throw new Error(error.response.data.message);
    else throw new Error(error.message);
  } else throw error;
}
