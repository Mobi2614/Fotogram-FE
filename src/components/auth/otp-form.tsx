"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { FormType } from "./auth-dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { verifyOTP } from "@/services/auth-api";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleX } from "lucide-react";
import Spinner from "../ui/spinner";
import { useUser } from "@/contexts/user-context";

type OTPFormProps = React.ComponentPropsWithoutRef<"div"> & {
  setActiveForm?: React.Dispatch<React.SetStateAction<FormType>>;
  onClose?: () => void;
};

type ActionStateType = {
  loading: boolean;
  error: string | null;
};

const actionState = {
  loading: false,
  error: null,
};
export function OTPForm({ onClose, className, ...props }: OTPFormProps) {
  const [otp, setOTP] = useState("");
  const { fetchCurrentUser } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const recipientEmail = String(searchParams?.get("recipient"));

  const [{ error, loading }, setActionState] = useState<ActionStateType>(actionState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      recipient: recipientEmail,
      otp: otp,
      type: "creator",
      context: String(searchParams?.get("ctx")),
    };
    try {
      setActionState({ loading: true, error: null });
      const data = await verifyOTP(payload);
      if (data?.isValid) {
        localStorage.setItem("user_token", data.tokens.access.token);
        fetchCurrentUser();
        const currentParams = new URLSearchParams(searchParams.toString());
        currentParams.delete("ctx");
        currentParams.delete("recipient");
        router.push(`?${currentParams}`);
        onClose?.();
      }
    } catch (error) {
      setActionState({
        loading: false,
        error: error instanceof Error ? error.message : (error as string),
      });
    } finally {
      setActionState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 p-4", className)} {...props}>
      <h2 className="text-2xl text-center font-bold text-primary">Enter OTP</h2>
      <p className="text-xs text-center">
        We&apos;ve sent an email containing OTP to <br /> <b>{recipientEmail}</b>
        <br />
        Please check your inbox
      </p>
      {error && (
        <div className="px-4 py-2 bg-destructive text-foreground rounded-md flex gap-2 items-center">
          <CircleX />
          <p className="text-xs font-medium">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <InputOTP value={otp} onChange={(val) => setOTP(val)} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button type="submit" className="w-full" disabled={otp.length !== 6}>
            {loading ? <Spinner size="sm" /> : "Verify OTP"}
          </Button>
          <Button variant={"link"}>Resend OTP</Button>
        </div>
      </form>
    </div>
  );
}
