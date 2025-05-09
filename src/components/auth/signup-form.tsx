import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register, RegisterFormType } from "@/services/auth-api";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import type { FormType } from "./auth-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "../ui/spinner";
import { CircleX } from "lucide-react";

type SignupFormProps = React.ComponentPropsWithoutRef<"div"> & {
  setActiveForm: React.Dispatch<React.SetStateAction<FormType>>;
};

type ActionStateType = {
  loading: boolean;
  error: string | null;
};

const initialData: RegisterFormType = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "consumer",
  phoneNo: "",
};

const actionState = {
  loading: false,
  error: null,
};

export function SignupForm({ setActiveForm, className, ...props }: SignupFormProps) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<RegisterFormType>(initialData);
  const [{ error, loading }, setActionState] = useState<ActionStateType>(actionState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionState({ loading: true, error: null });
      await register(formData);
      const currentParams = new URLSearchParams(searchParams?.toString());
      currentParams.set("ctx", "register");
      currentParams.set("recipient", formData.email);
      router.push(`?${currentParams}`);
      setActiveForm("otp");
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
      <h2 className="text-2xl text-center font-bold text-primary">Signup</h2>
      {error && (
        <div className="px-4 py-2 bg-destructive text-foreground rounded-md flex gap-2 items-center">
          <CircleX />
          <p className="text-xs font-medium">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="grid gap-2 grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                name="firstName"
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                name="lastName"
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phoneNo">Phone</Label>
            <Input
              id="phoneNo"
              type="string"
              name="phoneNo"
              onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <RadioGroup
            onValueChange={(val: "creator" | "consumer") => {
              setFormData({ ...formData, role: val });
            }}
            defaultValue="consumer"
            className="grid gap-2 grid-cols-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="consumer" id="r3" />
              <Label htmlFor="r3">Normal Account</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="creator" id="r2" />
              <Label htmlFor="r2">Creator Account</Label>
            </div>
          </RadioGroup>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Signup"}
          </Button>
        </div>
      </form>
    </div>
  );
}
