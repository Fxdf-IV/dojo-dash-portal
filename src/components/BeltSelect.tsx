import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export type BeltGrade = {
  id: string;
  name: string;
  color: string;
  rank: 'kyu' | 'dan';
  level: number;
};

export const BELT_GRADES: BeltGrade[] = [
  { id: 'white', name: 'Faixa Branca - 9º Kyu	', color: 'white', rank: 'kyu', level: 9 },
  { id: 'red-kyu', name: 'Faixa Vermelha - 8º Kyu', color: '#E53935', rank: 'kyu', level: 8 },
  { id: 'yellow', name: 'Faixa Amarela - 7º Kyu', color: '#FDD835', rank: 'kyu', level: 7 },
  { id: 'orange', name: 'Faixa Laranja - 6º Kyu', color: '#FB8C00', rank: 'kyu', level: 6 },
  { id: 'blue', name: 'Faixa Azul - 5º Kyu', color: '#1E88E5', rank: 'kyu', level: 5 },
  { id: 'gray', name: 'Faixa Cinza - 4º Kyu', color: '#9E9E9E', rank: 'kyu', level: 4 },
  { id: 'green', name: 'Faixa Verde - 3º Kyu', color: '#43A047', rank: 'kyu', level: 3 },
  { id: 'purple', name: 'Faixa Roxa - 2º Kyu', color: '#8E24AA', rank: 'kyu', level: 2 },
  { id: 'brown', name: 'Faixa Marrom - 1º Kyu', color: '#6D4C41', rank: 'kyu', level: 1 },
  { id: 'black-1', name: 'Faixa Preta - 1º Dan (Shodan)', color: 'black', rank: 'dan', level: 1 },
  { id: 'black-2', name: 'Faixa Preta - 2º Dan (Nidan)', color: 'black', rank: 'dan', level: 2 },
  { id: 'black-3', name: 'Faixa Preta - 3º Dan (Sandan)', color: 'black', rank: 'dan', level: 3 },
  { id: 'black-4', name: 'Faixa Preta - 4º Dan (Yondan)', color: 'black', rank: 'dan', level: 4 },
  { id: 'black-5', name: 'Faixa Preta - 5º Dan (Godan)', color: 'black', rank: 'dan', level: 5 },
  { id: 'coral-6', name: 'Faixa Preta/Coral - 6º Dan (Rokudan)', color: 'linear-gradient(90deg, black 0%, black 65%, white 45%, white 68%, #E53935 65%, #E53935 98%, white 45%)', rank: 'dan', level: 6 },
  { id: 'coral-7', name: 'Faixa Coral - 7º Dan (Shichidan)', color: 'linear-gradient(90deg, #E53935 50%, #FFFFFF 50%)', rank: 'dan', level: 7 },
  { id: 'coral-8', name: 'Faixa Coral - 8º Dan (Hachidan)', color: 'linear-gradient(90deg, #E53935 50%, #FFFFFF 50%)', rank: 'dan', level: 8 },
  { id: 'red-9', name: 'Faixa Vermelha - 9º Dan (Kyudan)', color: '#B71C1C', rank: 'dan', level: 9 },
  { id: 'red-10', name: 'Faixa Vermelha - 10º Dan (Judan)', color: '#B71C1C', rank: 'dan', level: 10 }
];

interface BeltSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  onlyDan?: boolean;
}

export function BeltSelect({ value, onValueChange, placeholder = "Selecione a faixa", onlyDan = false }: BeltSelectProps) {
  const filteredBelts = onlyDan 
    ? BELT_GRADES.filter(belt => belt.rank === 'dan')
    : BELT_GRADES;

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {filteredBelts.map((belt) => (
            <SelectItem 
              key={belt.id} 
              value={belt.id}
            >
              {belt.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}