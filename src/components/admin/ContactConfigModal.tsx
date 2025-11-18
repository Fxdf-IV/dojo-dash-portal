import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contactSettingsService } from "@/services/contactSettings";

interface ContactConfigModalProps {
  onUpdate?: () => void;
}

export const ContactConfigModal = ({ onUpdate }: ContactConfigModalProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    whatsappNumber: "",
    whatsappMessage: "",
  });

  const handleOpenChange = async (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Carregar dados atuais
      try {
        const settings = await contactSettingsService.getSettings();
        setFormData({
          whatsappNumber: settings.whatsappNumber,
          whatsappMessage: settings.whatsappMessage,
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao carregar configurações",
          variant: "destructive",
        });
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactSettingsService.updateSettings(
        formData.whatsappNumber,
        formData.whatsappMessage
      );

      toast({
        title: "Sucesso!",
        description: "Configurações de contato atualizadas com sucesso.",
      });

      setOpen(false);
      onUpdate?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar configurações';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Configure o Contato
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Contato WhatsApp</DialogTitle>
          <DialogDescription>
            Configure o número e a mensagem padrão do WhatsApp
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Número WhatsApp
            </label>
            <Input
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="18991234567"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use apenas números (ex: 18991234567)
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Mensagem Padrão
            </label>
            <Textarea
              name="whatsappMessage"
              value={formData.whatsappMessage}
              onChange={handleChange}
              placeholder="Olá, gostaria de conhecer o karatê do Alessandro Dojo. Como eu posso começar?"
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
