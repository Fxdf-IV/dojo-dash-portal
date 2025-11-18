export interface BeltGradeDisplay {
  id: string;
  level: string;
  name: string;
  color?: string;
  gradient?: string;
}

export const kyuGrades: BeltGradeDisplay[] = [
  { id: "white", level: "9º Kyu", name: "Faixa Branca", color: "#FFFFFF" },
  { id: "red-kyu", level: "8º Kyu", name: "Faixa Vermelha", color: "#E53935" },
  { id: "yellow", level: "7º Kyu", name: "Faixa Amarela", color: "#FDD835" },
  { id: "orange", level: "6º Kyu", name: "Faixa Laranja", color: "#FB8C00" },
  { id: "blue", level: "5º Kyu", name: "Faixa Azul", color: "#1E88E5" },
  { id: "gray", level: "4º Kyu", name: "Faixa Cinza", color: "#9E9E9E" },
  { id: "green", level: "3º Kyu", name: "Faixa Verde", color: "#43A047" },
  { id: "purple", level: "2º Kyu", name: "Faixa Roxa", color: "#8E24AA" },
  { id: "brown", level: "1º Kyu", name: "Faixa Marrom", color: "#6D4C41" },
];

export const danGrades: BeltGradeDisplay[] = [
  { id: "black-1", level: "1º Dan (Shodan)", name: "Faixa Preta", color: "#000000" },
  { id: "black-2", level: "2º Dan (Nidan)", name: "Faixa Preta", color: "#000000" },
  { id: "black-3", level: "3º Dan (Sandan)", name: "Faixa Preta", color: "#000000" },
  { id: "black-4", level: "4º Dan (Yondan)", name: "Faixa Preta", color: "#000000" },
  { id: "black-5", level: "5º Dan (Godan)", name: "Faixa Preta", color: "#000000" },
  {
    id: "coral-6",
    level: "6º Dan (Rokudan)",
    name: "Faixa Preta/Coral",
    gradient: "linear-gradient(90deg, black 0%, black 65%, white 65%, white 70%, red 70%, red 85%, white 85%, white 90%, black 90%, black 100%)",
  },
  {
    id: "coral-7",
    level: "7º Dan (Shichidan)",
    name: "Faixa Coral",
    gradient: "linear-gradient(90deg, #B71C1C 25%, #FFFFFF 25%, #FFFFFF 50%, #B71C1C 50%, #B71C1C 75%, #FFFFFF 75%, #FFFFFF 100%)",
  },
  {
    id: "coral-8",
    level: "8º Dan (Hachidan)",
    name: "Faixa Coral",
    gradient: "linear-gradient(90deg, #B71C1C 25%, #FFFFFF 25%, #FFFFFF 50%, #B71C1C 50%, #B71C1C 75%, #FFFFFF 75%, #FFFFFF 100%)",
  },
  { id: "red-9", level: "9º Dan (Kyudan)", name: "Faixa Vermelha", color: "#B71C1C" },
  { id: "red-10", level: "10º Dan (Judan)", name: "Faixa Vermelha", color: "#B71C1C" },
];

const levelWithLightText = new Set(["8º Kyu", "5º Kyu", "3º Kyu", "2º Kyu", "1º Kyu"]);

export const getTextColor = (backgroundColor?: string, level?: string) => {
  if (backgroundColor === "#000000" || level === "6º Dan (Rokudan)") {
    return "text-yellow-400";
  }
  if (level && levelWithLightText.has(level)) {
    return "text-gray-100";
  }
  return "text-gray-900";
};

export interface BeltDisplayInfo {
  label: string;
  description: string;
  background: string;
  textClass: string;
}

export const getBeltDisplay = (beltId?: string): BeltDisplayInfo | null => {
  if (!beltId) return null;
  const allGrades = [...kyuGrades, ...danGrades];
  const grade = allGrades.find((item) => item.id === beltId);
  if (!grade) return null;

  const background = grade.gradient ? grade.gradient : grade.color || "#FFFFFF";
  const textClass = getTextColor(grade.color, grade.level);
  
  return {
    label: grade.level,
    description: grade.name,
    background,
    textClass,
  };
};
