"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { FormType } from "./auth-dialog";

type ForgotPasswordFormProps = React.ComponentPropsWithoutRef<"div"> & {
  setActiveForm: React.Dispatch<React.SetStateAction<FormType>>;
};

export function ForgotPasswordForm({
  setActiveForm,
  className,
  ...props
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement forgot password logic here
    console.log("Forgot password for:", email);
    // On success, move to OTP form
    setActiveForm("otp");
  };

  return (
    <div className={cn("flex flex-col gap-6 p-4", className)} {...props}>
      <h2 className="text-2xl text-center font-bold text-primary">
        Forgot Password
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Send OTP
          </Button>
        </div>
      </form>
    </div>
  );
}
