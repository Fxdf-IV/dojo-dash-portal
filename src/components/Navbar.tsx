import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const navLinks = [{
    name: "Início",
    path: "/"
  }, {
    name: "História",
    path: "/history"
  }, {
    name: "Galeria",
    path: "/gallery"
  }, {
    name: "Contato",
    path: "/contact"
  }];
  const isActive = (path: string) => {
    if (path.includes("#")) {
      return location.pathname === "/" && location.hash === path.split("#")[1];
    }
    return location.pathname === path;
  };
  return <nav className="fixed top-0 w-full z-50 bg-secondary/95 backdrop-blur-sm border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Alessandro Karatê e Kobudo" className="h-14 w-14 transition-transform group-hover:scale-110" />
            <div className="hidden md:block">
              <span className="text-primary-foreground font-bold text-xl">Alessandro Karatê e Kobudo</span>
              <p className="text-muted-foreground text-xs">Palmital - SP</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? "text-primary" : "text-primary-foreground"}`}>
                {link.name}
              </Link>)}
            {isAuthenticated ? (
              <>
                <Link to={user?.role === "admin" ? "/admin" : "/student"}>
                  <Button variant="default" size="sm" className="shadow-glow">
                    {user?.role === "admin" ? "Área da Administração" : "Área do Aluno"}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm" className="shadow-glow">Cadastrar-se / Entrar</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-primary-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="md:hidden pb-4 space-y-3">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={`block py-2 text-sm font-medium transition-colors ${isActive(link.path) ? "text-primary" : "text-primary-foreground"}`} onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>)}
            {isAuthenticated ? (
              <>
                <Link to={user?.role === "admin" ? "/admin" : "/student"} onClick={() => setIsOpen(false)}>
                  <Button variant="default" size="sm" className="w-full shadow-glow">
                    {user?.role === "admin" ? "Área da Administração" : "Área do Aluno"}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    logout();
                    navigate("/");
                    setIsOpen(false);
                  }}
                >
                  Sair
                </Button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="default" size="sm" className="w-full shadow-glow">
                  Cadastrar-se / Entrar
                </Button>
              </Link>
            )}
          </div>}
      </div>
    </nav>;
};
export default Navbar;