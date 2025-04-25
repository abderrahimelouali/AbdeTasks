
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleMenu} 
        className="md:hidden text-base"
      >
        {isOpen ? "✕" : "☰"}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
          <div className="fixed inset-x-0 top-0 p-4 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleMenu} 
              className="text-base"
            >
              ✕
            </Button>
          </div>
          <nav className="fixed inset-x-0 top-16 p-4 flex flex-col items-center gap-4">
            <Link 
              to="/" 
              className="text-lg font-medium hover:text-primary"
              onClick={toggleMenu}
            >
              Today
            </Link>
            <Link 
              to="/tasks" 
              className="text-lg font-medium hover:text-primary"
              onClick={toggleMenu}
            >
              All Tasks
            </Link>
            <Link 
              to="/stats" 
              className="text-lg font-medium hover:text-primary"
              onClick={toggleMenu}
            >
              Statistics
            </Link>
            <Link 
              to="/study" 
              className="text-lg font-medium hover:text-primary"
              onClick={toggleMenu}
            >
              Study
            </Link>
            <Link 
              to="/weekly" 
              className="text-lg font-medium hover:text-primary"
              onClick={toggleMenu}
            >
              Weekly View
            </Link>
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
