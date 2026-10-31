import { useState } from "react";
import { Menu, X, Sun, Moon, ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo";
import { NAV_LINKS, PROFILE } from "@/data/portfolio";
import { useTheme } from "@/context/AppContexts";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-xl" data-testid="navbar">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="Kishan home" onClick={() => setMenuOpen(false)}>
          <Logo size={36} /><span className="font-display font-bold tracking-tight">Kishan<span className="text-gradient">.dev</span></span>
        </a>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{link.label}</a>)}
          <a href="#contact" className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500">Contact <ArrowUpRight size={14} /></a>
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleTheme} className="rounded-full border border-border p-2.5 text-muted-foreground transition-colors hover:text-foreground" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} data-testid="theme-toggle">{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button>
          <button type="button" onClick={() => setMenuOpen((v) => !v)} className="rounded-full border border-border p-2.5 md:hidden" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}>{menuOpen ? <X size={17} /> : <Menu size={17} />}</button>
        </div>
      </div>
      {menuOpen && <nav className="border-t border-border px-4 py-4 md:hidden" aria-label="Mobile navigation"><div className="mx-auto flex max-w-7xl flex-col gap-1">{NAV_LINKS.map((link) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">{link.label}</a>)}<a href="#contact" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-cyan-600 dark:text-cyan-300">Contact Kishan</a></div></nav>}
    </header>
  );
};
export default Navbar;
