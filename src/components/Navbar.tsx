import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.webp";
import { useAuth } from "@/contexts/AuthContext";

import { dojoConfig } from "@/config/dojo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const navLinks = [
    {
      name: "Início",
      path: "/",
    },
    {
      name: "História",
      path: "/historia",
    },
    {
      name: "Galeria",
      path: "/galeria",
    },
    {
      name: "Eventos",
      path: "/eventos",
    },
    {
      name: "Contato",
      path: "/contato",
    },
  ];
  const isActive = (path: string) => {
    if (path.includes("#")) {
      return location.pathname === "/" && location.hash === path.split("#")[1];
    }
    return location.pathname === path;
  };
  return (
    <nav className="fixed top-0 w-full z-50 bg-secondary border-t border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt={dojoConfig.name}
              className="h-14 w-14 transition-transform group-hover:scale-110"
            />
            <div className="md:block">
              <span className="text-primary-foreground font-bold text-xl">{dojoConfig.name}</span>
              <p className="text-muted-foreground text-xs">Dojo {dojoConfig.location}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-primary-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to={user?.role === "admin" ? "/admin" : "/student"}>
                  <Button variant="default" size="sm" className="shadow-glow">
                    {user?.role === "admin"
                      ? "Área da Administração"
                      : "Área do Aluno"}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-500 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
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
            className="md:hidden text-primary-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-primary-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === "admin" ? "/admin" : "/student"}
                  onClick={() => setIsOpen(false)}
                >
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full shadow-glow"
                  >
                    {user?.role === "admin"
                      ? "Área da Administração"
                      : "Área do Aluno"}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-red-500/50 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-500 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                  onClick={() => {
                    logout();
                    navigate("/");
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full shadow-glow"
                >
                  Cadastrar-se / Entrar
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
