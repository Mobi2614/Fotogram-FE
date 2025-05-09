import React from "react";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { SearchBar } from "./search-bar";

export default function Header() {
  return (
    <header className="hidden lg:block sticky top-0 border-b h-[60px] z-20 transition px-8 w-full bg-background">
      <div className="h-full flex items-center justify-between">
        <div>
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
