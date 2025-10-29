import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export type BeltGrade = {
  id: string;
  name: string;
  color: string;
  rank: 'kyu' | 'dan';
  level: number;
};

export const BELT_GRADES: BeltGrade[] = [
  { id: 'white', name: 'Faixa Branca', color: 'white', rank: 'kyu', level: 6 },
  { id: 'yellow', name: 'Faixa Amarela', color: 'yellow', rank: 'kyu', level: 5 },
  { id: 'orange', name: 'Faixa Laranja', color: 'orange', rank: 'kyu', level: 4 },
  { id: 'green', name: 'Faixa Verde', color: 'green', rank: 'kyu', level: 3 },
  { id: 'blue', name: 'Faixa Azul', color: 'blue', rank: 'kyu', level: 2 },
  { id: 'brown', name: 'Faixa Marrom', color: 'brown', rank: 'kyu', level: 1 },
  { id: 'black-1', name: 'Faixa Preta 1º Dan', color: 'black', rank: 'dan', level: 1 },
  { id: 'black-2', name: 'Faixa Preta 2º Dan', color: 'black', rank: 'dan', level: 2 },
  { id: 'black-3', name: 'Faixa Preta 3º Dan', color: 'black', rank: 'dan', level: 3 },
  { id: 'black-4', name: 'Faixa Preta 4º Dan', color: 'black', rank: 'dan', level: 4 },
  { id: 'black-5', name: 'Faixa Preta 5º Dan', color: 'black', rank: 'dan', level: 5 },
  { id: 'black-6', name: 'Faixa Preta 6º Dan', color: 'black', rank: 'dan', level: 6 },
  { id: 'black-7', name: 'Faixa Preta 7º Dan', color: 'black', rank: 'dan', level: 7 },
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