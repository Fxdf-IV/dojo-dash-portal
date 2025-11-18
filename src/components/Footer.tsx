import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
const Footer = () => {
  return <footer className="bg-secondary border-t border-primary/20" role="contentinfo" aria-label="Rodapé do site">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="Logo Alessandro Karatê e Kobudo" 
                className="h-12 w-12"
                width="48"
                height="48"
                loading="lazy"
              />
              <div>
                <h3 className="text-primary-foreground font-bold text-lg">Alessandro Karatê e Kobudo</h3>
                <p className="text-muted-foreground text-xs">Dojo Palmital - SP</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Tradição, disciplina e respeito. Formando não apenas karatecas, mas cidadãos de caráter.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-primary-foreground font-semibold text-lg">Contato</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone size={16} />
                <span>(18) 99755-8617</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail size={16} />
                <span>alekaratepalmital1@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MapPin size={16} />
                <span>Palmital - SP</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="text-primary-foreground font-semibold text-lg">Redes Sociais</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/alessandrodokarate" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Visite nosso Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/alessandrodokarate/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                aria-label="Visite nosso Instagram"
              >
                <Instagram size={20} />
              </a>
              
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary/20 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Alessandro Karatê e Kobudo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;