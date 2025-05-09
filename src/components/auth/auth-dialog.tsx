"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { ForgotPasswordForm } from "./forgot-password-form";
import { ResetPasswordForm } from "./reset-password-form";
import { OTPForm } from "./otp-form";
import { Button } from "../ui/button";

export type FormType = "signup" | "login" | "otp" | "forgot-password" | "reset-password";

export default function AuthDialog() {
  const [activeForm, setActiveForm] = useState<FormType>("login");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const handleDialogChange = (isOpen: boolean) => {
    setAuthDialogOpen(isOpen);
    // if (!isOpen) {
    //   setActiveForm("login");
    // }
  };

  return (
    <Dialog open={authDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle></DialogTitle>
        {activeForm === "signup" && <SignupForm setActiveForm={setActiveForm} />}
        {activeForm === "login" && (
          <LoginForm onClose={() => handleDialogChange(false)} setActiveForm={setActiveForm} />
        )}
        {activeForm === "forgot-password" && <ForgotPasswordForm setActiveForm={setActiveForm} />}
        {activeForm === "reset-password" && <ResetPasswordForm setActiveForm={setActiveForm} />}
        {activeForm === "otp" && (
          <OTPForm onClose={() => handleDialogChange(false)} setActiveForm={setActiveForm} />
        )}
        <FormSwitcher activeForm={activeForm} setActiveForm={setActiveForm} />
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function FormSwitcher({
  activeForm,
  setActiveForm,
}: {
  activeForm: FormType;
  setActiveForm: Dispatch<SetStateAction<FormType>>;
}) {
  const toggleForm = () => setActiveForm(activeForm === "signup" ? "login" : "signup");

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex justify-center items-center gap-2">
        <p className="text-sm text-muted-foreground">
          {activeForm === "signup" ? "Already have an account?" : "Don't have an account?"}
        </p>
        <button onClick={toggleForm} className="hover:underline underline-offset-4 text-sm">
          {activeForm === "signup" ? "Login" : "Signup"}
        </button>
      </div>
    </div>
  );
}
