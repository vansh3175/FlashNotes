"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface HeaderLink {
  label: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

interface GenericHeaderProps {
  logo?: React.ReactNode;
  links?: HeaderLink[];                 // Desktop links
  extra?: React.ReactNode;              // Right side custom buttons
  mobileItems?: React.ReactNode;        // Mobile dropdown content override
  onHamburgerClick?: () => void;        // For pages using sidebar
  showHamburger?: boolean;
  showThemeSwitcher?: boolean;
}

export default function GenericHeader({
  logo,
  links = [],
  extra,
  mobileItems,
  showHamburger = false,
  onHamburgerClick,
  showThemeSwitcher = true,
}: GenericHeaderProps) 
{
  const { setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 px-4 sm:px-6 md:px-10 py-3">
      
      {/* LEFT: Logo */}
      <div className="flex items-center gap-3">
        {logo}
      </div>

      {/* DESKTOP NAV */}
      <div className="hidden md:flex items-center gap-8">

        {/* Theme Switcher */}
        {showThemeSwitcher && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:scale-110 border-0 relative">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 dark:scale-0 dark:-rotate-90 transition-all" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 dark:scale-100 dark:rotate-0 transition-all" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-neutral-50 dark:bg-gray-900">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Links */}
        <div className="flex items-center gap-6">
          {links.map((l) => (
             <Link key={l.label} href={l.href} legacyBehavior>
                <a
                className="text-lg font-medium hover:text-blue-600 cursor-pointer"
                onClick={(e) => {
                    if (l.onClick) {
                    e.preventDefault();      // Stops navigation
                    e.stopPropagation();     // Prevents bubbling
                    l.onClick(e);            // Calls your action (e.g., warning modal)
                    }
                }}
                >
                {l.label}
                </a>
            </Link>
          ))}
        </div>

        {/* Extra buttons like Create / My Notes */}
        {extra}
      </div>

      {/* MOBILE MENU */}
      <div className="md:hidden flex items-center gap-3">

        {/* Theme button */}
        {showThemeSwitcher && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5 rotate-0 scale-100 dark:scale-0 dark:-rotate-90 transition-all" />
                <Moon className="absolute h-5 w-5 scale-0 rotate-90 dark:scale-100 dark:rotate-0 transition-all" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-neutral-50 dark:bg-gray-900">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Hamburger */}
        {mobileItems && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-neutral-50 dark:bg-gray-900">
              {mobileItems}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showHamburger && (
          <Button variant="ghost" size="icon" onClick={onHamburgerClick}>
            <Menu size={24} />
          </Button>
        )}

      </div>
    </header>
  );
}
