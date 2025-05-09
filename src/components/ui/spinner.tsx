import { LoaderCircle } from "lucide-react";
import React from "react";

export default function Spinner({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <LoaderCircle
      size={sizeMap[size]} // Dynamically map the size prop
      className="animate-spin"
    />
  );
}
