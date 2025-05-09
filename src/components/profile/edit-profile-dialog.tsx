"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/services/auth-api";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@/contexts/user-context";
import { CircleX } from "lucide-react";
import Spinner from "@/components/ui/spinner";

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type UpdateUserFormType = {
  firstName: string;
  lastName: string;
  phoneNo: string;
};

type ActionStateType = {
  loading: boolean;
  error: string | null;
};

export default function EditProfileDialog({ isOpen, onClose }: EditProfileDialogProps) {
  const { user, fetchCurrentUser } = useUser();
  const [formData, setFormData] = useState<UpdateUserFormType>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNo: user?.phoneNo || "",
  });
  const [actionState, setActionState] = useState<ActionStateType>({
    loading: false,
    error: null,
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: UpdateUserFormType) => updateUser(user!.id, data),
    onSuccess: () => {
      fetchCurrentUser();
      onClose();
    },
    onError: (error) => {
      setActionState({
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionState({ loading: true, error: null });
    updateUserMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        {actionState.error && (
          <div className="px-4 py-2 bg-destructive text-foreground rounded-md flex gap-2 items-center">
            <CircleX />
            <p className="text-xs font-medium">{actionState.error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phoneNo">Phone Number</Label>
              <Input
                id="phoneNo"
                value={formData.phoneNo}
                onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={actionState.loading || updateUserMutation.isPending}>
              {actionState.loading || updateUserMutation.isPending ? (
                <Spinner size="sm" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
