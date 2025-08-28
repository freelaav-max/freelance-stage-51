
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Linkedin, Twitter, Mail, Phone } from "lucide-react";
import freelaavLogo from '@/assets/freelaav-logo.png';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center p-1.5">
                <img src={freelaavLogo} alt="FreelaAV" className="w-full h-full object-contain" />
              </div>
              <span className="font-heading font-bold text-xl text-primary">FreelaAV</span>
            </div>
            <p className="text-muted-foreground mb-4">
              A plataforma que conecta os melhores profissionais de áudio e vídeo
              com clientes que buscam excelência no audiovisual.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Para Freelancers</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Criar Perfil</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Plano Pro</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Gerenciar Agenda</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Para Clientes</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Buscar Profissionais</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Como Contratar</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Políticas</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Suporte</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>contato@freelaav.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>(11) 9999-9999</span>
              </div>
            </div>
            <Badge className="mt-4 bg-success/10 text-success border-success/20">
              🟢 Suporte Online
            </Badge>
          </div>
        </div>
        
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 FreelaAV. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
