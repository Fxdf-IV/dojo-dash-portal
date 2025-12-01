import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";
import { ScheduleItem } from "@/types";

const DAYS_OF_WEEK = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

interface LocationFormProps {
  form: {
    name: string;
    description: string;
    mapUrl: string;
    schedule: ScheduleItem[];
  };
  setForm: (form: any) => void;
  coverImageFile: File | null;
  setCoverImageFile: (file: File | null) => void;
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
  currentImageUrl?: string;
  onRemoveCoverImage?: () => Promise<void>;
}

export const LocationForm = ({
  form,
  setForm,
  coverImageFile,
  setCoverImageFile,
  imageFiles,
  setImageFiles,
  onSubmit,
  onCancel,
  submitLabel,
  currentImageUrl,
  onRemoveCoverImage,
}: LocationFormProps) => {
  return (
    <div className="space-y-4 py-2">
      <div>
        <Label htmlFor="location-name">Nome</Label>
        <Input
          id="location-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="location-mapUrl">Link do Mapa (Embed)</Label>
        <Input
          id="location-mapUrl"
          value={form.mapUrl}
          onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
          placeholder="Cole o link do Google Maps"
        />
        <ul className="text-xs text-muted-foreground mt-1 list-disc pl-4 space-y-1 mt-3 ml-3">
          <li>
            Vá no{" "}
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary/80 hover:text-primary"
            >
              <strong>Google Maps</strong>
            </a>
            , encontre o local desejado.
          </li>
          <li>Clique em <strong>Compartilhar</strong> {">"} <strong>Incorporar um mapa</strong>.</li>
          <li>Clique em <strong>Copiar HTML</strong> e cole-o no campo acima.</li>
        </ul>
      </div>
      <div>
        <Label htmlFor="location-description">Descrição</Label>
        <Textarea
          id="location-description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
      </div>
      <div>
        <Label>Horários</Label>
        <div className="space-y-2 mt-2">
          {form.schedule.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Select
                value={item.day}
                onValueChange={(value) => {
                  const newSchedule = [...form.schedule];
                  newSchedule[index].day = value;
                  setForm({ ...form, schedule: newSchedule });
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Dia" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="time"
                value={item.startTime}
                onChange={(e) => {
                  const newSchedule = [...form.schedule];
                  newSchedule[index].startTime = e.target.value;
                  setForm({ ...form, schedule: newSchedule });
                }}
                className="w-[120px]"
                placeholder="Início"
              />
              <Input
                type="time"
                value={item.endTime}
                onChange={(e) => {
                  const newSchedule = [...form.schedule];
                  newSchedule[index].endTime = e.target.value;
                  setForm({ ...form, schedule: newSchedule });
                }}
                className="w-[120px]"
                placeholder="Término"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newSchedule = form.schedule.filter(
                    (_, i) => i !== index
                  );
                  setForm({ ...form, schedule: newSchedule });
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setForm({
                ...form,
                schedule: [
                  ...form.schedule,
                  { day: "", startTime: "", endTime: "" },
                ],
              })
            }
          >
            <Plus className="w-4 h-4 mr-2" /> Adicionar Horário
          </Button>
        </div>
      </div>
      <ImageUpload
        label="Imagem de Capa"
        value={currentImageUrl}
        onChange={(file) => setCoverImageFile(file)}
        onRemove={onRemoveCoverImage || (() => setCoverImageFile(null))}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        maxSize={5}
      />
      <MultipleImageUpload
        label={
          submitLabel === "Salvar"
            ? "Adicionar Fotos à Galeria"
            : "Fotos da Galeria"
        }
        value={imageFiles}
        onChange={setImageFiles}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        maxSize={5}
        maxFiles={20}
        placeholder={
          submitLabel === "Salvar"
            ? "Selecione múltiplas imagens para adicionar à galeria durante a edição"
            : "Selecione múltiplas imagens para a galeria do local"
        }
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </div>
  );
};
