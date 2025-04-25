
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "./mobile-nav";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/">
            <h1 className="text-xl font-bold text-primary tracking-tight">
              AbdeTask
            </h1>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Today
          </Link>
          <Link to="/tasks" className="text-sm font-medium hover:text-primary">
            All Tasks
          </Link>
          <Link to="/stats" className="text-sm font-medium hover:text-primary">
            Statistics
          </Link>
          <Link to="/study" className="text-sm font-medium hover:text-primary">
            Study
          </Link>
          <Link to="/weekly" className="text-sm font-medium hover:text-primary">
            Weekly View
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
