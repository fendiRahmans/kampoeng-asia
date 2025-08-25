import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { FileText, Home, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppearance } from "@/hooks/use-appearance";

export default function LandingHeaderLayout() {
  const { appearance, updateAppearance } = useAppearance();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, [appearance]);

  const toggleTheme = () => {
    // Toggle between light and dark. This will persist via the hook.
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    updateAppearance(next);
    setIsDark(!isDark);
  };

  return (
    <header className="shadow-sm border-b border-rt-primary/20 sticky top-0 z-50 bg-white dark:bg-black backdrop-blur-3xl bg-opacity-60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-rt-primary to-rt-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RT</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-rt-text">Kampoeng Asean</h1>
                <p className="text-sm text-rt-text/70">RT 01 RW 23</p>
              </div>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Beranda</span>
              </Button>
            </Link>

            <Link href="/dokumentasi">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Dokumentasi</span>
              </Button>
            </Link>


            <Link href="/login">
              <Button size="sm">
                Login
              </Button>
            </Link>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center justify-center p-2"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
