
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-base">
          ☰
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[75vw] sm:w-[350px] px-6">
        <nav className="flex flex-col items-start gap-4 mt-12">
          <Link 
            to="/" 
            className="text-lg font-medium hover:text-primary w-full px-2 py-1.5"
          >
            Today
          </Link>
          <Link 
            to="/tasks" 
            className="text-lg font-medium hover:text-primary w-full px-2 py-1.5"
          >
            All Tasks
          </Link>
          <Link 
            to="/stats" 
            className="text-lg font-medium hover:text-primary w-full px-2 py-1.5"
          >
            Statistics
          </Link>
          <Link 
            to="/study" 
            className="text-lg font-medium hover:text-primary w-full px-2 py-1.5"
          >
            Study
          </Link>
          <Link 
            to="/weekly" 
            className="text-lg font-medium hover:text-primary w-full px-2 py-1.5"
          >
            Weekly View
          </Link>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
