
import { ReactNode } from "react";
import { Navbar } from "./navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          AbdeTask &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
