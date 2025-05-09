"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { FormType } from "./auth-dialog";

type ResetPasswordFormProps = React.ComponentPropsWithoutRef<"div"> & {
  setActiveForm: React.Dispatch<React.SetStateAction<FormType>>;
};

export function ResetPasswordForm({
  setActiveForm,
  className,
  ...props
}: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement reset password logic here
    console.log("Reset password:", formData);
    // On success, move to login form
    setActiveForm("login");
  };

  return (
    <div className={cn("flex flex-col gap-6 p-4", className)} {...props}>
      <h2 className="text-2xl text-center font-bold text-primary">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Set New Password
          </Button>
        </div>
      </form>
    </div>
  );
}

