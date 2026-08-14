import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.webp";
import { useAuth } from "@/contexts/AuthContext";

import { dojoConfig } from "@/config/dojo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { name: "Início", path: "/" },
    { name: "História", path: "/historia" },
    { name: "Galeria", path: "/galeria" },
    { name: "Eventos", path: "/eventos" },
    { name: "Contato", path: "/contato" },
  ];

  const isActive = (path: string) => {
    if (path.includes("#")) {
      return location.pathname === "/" && location.hash === path.split("#")[1];
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu mobile ao navegar
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const dashboardPath = user?.role === "admin" ? "/admin" : "/student";
  const dashboardLabel = user?.role === "admin" ? "Área da Administração" : "Área do Aluno";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-primary/25 bg-secondary/95 shadow-elevated backdrop-blur-md supports-[backdrop-filter]:bg-secondary/80"
          : "border-transparent bg-secondary",
      )}
    >
      <nav className="container mx-auto px-4" aria-label="Navegação principal">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
          >
            <img
              src={logo}
              alt={dojoConfig.name}
              className="h-12 w-12 shrink-0 transition-transform duration-300 group-hover:scale-105 md:h-14 md:w-14"
              width={56}
              height={56}
            />
            <span className="min-w-0">
              <span className="block truncate font-display text-base font-bold leading-tight text-primary-foreground md:text-xl">
                {dojoConfig.name}
              </span>
              <span className="block truncate text-xs text-primary-foreground/60">Dojo {dojoConfig.location}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                  "after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-primary after:transition-all after:duration-300",
                  isActive(link.path)
                    ? "text-primary after:w-5"
                    : "text-primary-foreground/85 hover:bg-white/5 hover:text-primary-foreground hover:after:w-5",
                )}
              >
                {link.name}
              </Link>
            ))}

            <span className="mx-2 h-6 w-px bg-white/10" aria-hidden="true" />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to={dashboardPath}>
                  <Button variant="default" size="sm" className="shadow-glow">
                    {dashboardLabel}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground/70 hover:bg-destructive/15 hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm" className="shadow-glow">
                  Cadastrar-se / Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-primary-foreground transition-colors hover:bg-white/10 focus-visible:ring-offset-secondary md:hidden"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={cn(
            "grid overflow-hidden transition-all duration-300 ease-out md:hidden",
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="min-h-0">
            <div className="space-y-1 border-t border-white/10 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={isActive(link.path) ? "page" : undefined}
                  className={cn(
                    "flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium transition-colors",
                    isActive(link.path)
                      ? "bg-primary/15 text-primary"
                      : "text-primary-foreground/85 hover:bg-white/5 hover:text-primary-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="space-y-2 pt-3">
                {isAuthenticated ? (
                  <>
                    <Link to={dashboardPath} onClick={() => setIsOpen(false)} className="block">
                      <Button variant="default" className="w-full shadow-glow">
                        {dashboardLabel}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full text-primary-foreground/80 hover:bg-destructive/15 hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                    <Button variant="default" className="w-full shadow-glow">
                      Cadastrar-se / Entrar
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
