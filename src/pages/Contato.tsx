import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const Contato = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Aqui seria integrado com backend/email
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve."
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground text-center mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center max-w-3xl mx-auto">
            Tem dúvidas ou quer começar a treinar? Estamos prontos para ajudar você!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Envie uma Mensagem</h2>
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Nome</label>
                      <Input name="name" value={formData.name} onChange={handleChange} placeholder="Seu nome completo" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                      <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Telefone</label>
                      <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(18) 99999-9999" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Mensagem</label>
                      <Textarea name="message" value={formData.message} onChange={handleChange} placeholder="Conte-nos como podemos ajudar..." rows={5} required />
                    </div>
                    <Button type="submit" className="w-full shadow-glow">
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">Informações de Contato</h2>
                <div className="space-y-4">
                  <Card className="border-primary/20 hover:border-primary transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">Telefone</p>
                        <p className="text-sm text-muted-foreground">(18) 99999-9999</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 hover:border-primary transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">Email</p>
                        <p className="text-sm text-muted-foreground">contato@alessandrokarate.com.br</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 hover:border-primary transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-card-foreground">Localização</p>
                        <p className="text-sm text-muted-foreground">Palmital - SP</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Redes Sociais</h3>
                <p className="text-muted-foreground mb-4">
                  Acompanhe nossas atividades, eventos e conquistas
                </p>
                <div className="flex gap-4">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                    <Facebook size={24} />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-primary/10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                    <Instagram size={24} />
                  </a>
                  
                </div>
              </div>

              {/* Locations */}
              <div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Nossos Locais</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>● CT Maylson Campos</p>
                  <p>● Bola e Cidadania</p>
                  <p>● Projeto Gota Verde</p>
                  <p>● Colégio Expoente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Contato;