"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const debouncedUpdateSearchParam = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, 300);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      debouncedUpdateSearchParam(value);
    },
    [debouncedUpdateSearchParam]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return (
    <div className="relative w-72">
      <Input
        type="text"
        placeholder="Search photos..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="pr-8"
      />
      {searchTerm ? (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      )}
    </div>
  );
}
