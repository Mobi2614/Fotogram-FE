"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { login } from "@/services/auth-api";
import type { FormType } from "./auth-dialog";
import { CircleX } from "lucide-react";
import Spinner from "../ui/spinner";
import { useUser } from "@/contexts/user-context";

type LoginFormProps = React.ComponentPropsWithoutRef<"div"> & {
  setActiveForm: React.Dispatch<React.SetStateAction<FormType>>;
  onClose: () => void;
};

type ActionStateType = {
  loading: boolean;
  error: string | null;
};
const actionState = {
  loading: false,
  error: null,
};
export function LoginForm({ setActiveForm, onClose, className, ...props }: LoginFormProps) {
  const [{ error, loading }, setActionState] = useState<ActionStateType>(actionState);
  const { fetchCurrentUser } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionState({ loading: true, error: null });
      const data = await login(formData);
      localStorage.setItem("user_token", data.tokens.access.token);
      fetchCurrentUser();
      onClose();
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
      <h2 className="text-2xl text-center font-bold text-primary">Login</h2>
      {error && (
        <div className="px-4 py-2 bg-destructive text-foreground rounded-md flex gap-2 items-center">
          <CircleX />
          <p className="text-xs font-medium">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <button
                onClick={() => setActiveForm("forgot-password")}
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </button>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
}
