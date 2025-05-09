import ProfileTabs from "@/components/profile/profile-tabs";
import UserInfo from "@/components/profile/user-info";
import { Suspense } from "react";

export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <UserInfo />
        <Suspense fallback={<div>Loading photos...</div>}>
          <ProfileTabs />
        </Suspense>
      </div>
    </div>
  );
}
