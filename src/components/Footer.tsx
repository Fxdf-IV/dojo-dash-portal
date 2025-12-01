import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";
import logo from "@/assets/logo.webp";
import manekiIcon from "@/assets/MenekiNeekoIco.webp";

const Footer = () => {
  return <footer className="bg-secondary border-t border-primary/20" role="contentinfo" aria-label="Rodapé do site">
      <div className="container mx-auto px-4 pt-12 pb-4">
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

        <div className="mt-8 pt-4 border-t border-primary/20">
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 text-sm text-muted-foreground text-center">
            <div className="flex flex-wrap justify-center items-center gap-1">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="hidden md:inline">&bull;</span>
              <span>Desenvolvido com</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>por</span>
              <a 
                href="https://github.com/maneki-neeko" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-medium hover:text-primary transition-colors"
              >
                Maneki Neeko
                <img 
                  src={manekiIcon} 
                  alt="Maneki Neeko" 
                  className="h-12 w-12 object-contain"
                />
              </a>
            </div>
            <span className="hidden md:inline">|</span>
            <p>Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;