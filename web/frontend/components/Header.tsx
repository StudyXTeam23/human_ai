import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                AI Humanizer
              </span>
              <span className="text-xs text-slate-500">100% Free</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/history" 
              className="text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              History
            </Link>
            <Link 
              href="#features" 
              className="text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-sm font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
            >
              How It Works
            </Link>
            <Button asChild size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Link href="/">Try Now - Free</Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                <Link 
                  href="/" 
                  className="text-lg font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/history" 
                  className="text-lg font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                >
                  History
                </Link>
                <Link 
                  href="#features" 
                  className="text-lg font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                >
                  Features
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="text-lg font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                >
                  How It Works
                </Link>
                <Button asChild className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600">
                  <Link href="/">Try Now - Free</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

