"use client";

import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { cn } from "@/lib/utils";

interface CustomDropzoneOptions extends DropzoneOptions {
  className?: string;
  children?: React.ReactNode;
}

const Dropzone = React.forwardRef<HTMLDivElement, CustomDropzoneOptions>(
  ({ className, ...props }, ref) => {
    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
    } = useDropzone(props);

    return (
      <div
        {...getRootProps()}
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer",
          isDragActive ? "border-primary" : "border-border",
          isDragAccept ? "border-green-500" : "",
          isDragReject ? "border-red-500" : "",
          className
        )}
      >
        <input {...getInputProps()} />
        {props.children}
      </div>
    );
  }
);
Dropzone.displayName = "Dropzone";

export { Dropzone };
