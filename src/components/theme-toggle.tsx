
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" onClick={toggleTheme} className="w-10 px-0">
      {theme === "dark" ? "☀️" : "🌙"}
    </Button>
  );
}
