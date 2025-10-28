import { Badge } from "@/components/ui/badge";

interface BeltGrade {
  level: string;
  name: string;
  color: string;
  gradient?: string;
}

const BeltGrades = () => {
  const kyuGrades: BeltGrade[] = [
    { level: "9º Kyu", name: "Faixa Branca", color: "#FFFFFF" },
    { level: "8º Kyu", name: "Faixa Vermelha", color: "#E53935" },
    { level: "7º Kyu", name: "Faixa Amarela", color: "#FDD835" },
    { level: "6º Kyu", name: "Faixa Laranja", color: "#FB8C00" },
    { level: "5º Kyu", name: "Faixa Azul", color: "#1E88E5" },
    { level: "4º Kyu", name: "Faixa Cinza", color: "#9E9E9E" },
    { level: "3º Kyu", name: "Faixa Verde", color: "#43A047" },
    { level: "2º Kyu", name: "Faixa Roxa", color: "#8E24AA" },
    { level: "1º Kyu", name: "Faixa Marrom", color: "#6D4C41" },
  ];

  const danGrades: BeltGrade[] = [
    { level: "1º Dan (Shodan)", name: "Faixa Preta", color: "#000000" },
    { level: "2º Dan (Nidan)", name: "Faixa Preta", color: "#000000" },
    { level: "3º Dan (Sandan)", name: "Faixa Preta", color: "#000000" },
    { level: "4º Dan (Yondan)", name: "Faixa Preta", color: "#000000" },
    { level: "5º Dan (Godan)", name: "Faixa Preta", color: "#000000" },
    { level: "6º Dan (Rokudan)", name: "Faixa Preta/Coral", gradient: "linear-gradient(90deg, #E53935 50%, #FFFFFF 50%)" },
    { level: "7º Dan (Shichidan)", name: "Faixa Coral", gradient: "linear-gradient(90deg, #E53935 50%, #FFFFFF 50%)" },
    { level: "8º Dan (Hachidan)", name: "Faixa Coral", gradient: "linear-gradient(90deg, #E53935 50%, #FFFFFF 50%)" },
    { level: "9º Dan (Kyudan)", name: "Faixa Vermelha", color: "#B71C1C" },
    { level: "10º Dan (Judan)", name: "Faixa Vermelha", color: "#B71C1C" },
  ];

  const getTextColor = (backgroundColor: string) => {
    // Para faixas claras, usar texto escuro
    if (backgroundColor === "#FFFFFF" || backgroundColor === "#FDD835" || backgroundColor === "#43A047") {
      return "text-gray-900";
    }
    return "text-white";
  };

  return (
    <div className="space-y-8">
      {/* Kyu Grades */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-foreground">
          🥋 Graduações de Kyu (Mudansha - Níveis Iniciais)
        </h3>
        <div className="flex flex-wrap gap-3">
          {kyuGrades.map((grade, index) => (
            <Badge
              key={index}
              className={`px-4 py-2 text-sm font-semibold ${
                getTextColor(grade.color)
              }`}
              style={{ backgroundColor: grade.color }}
            >
              <span className="font-bold">{grade.level}</span>
              <span className="ml-2 opacity-90">• {grade.name}</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Dan Grades */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-foreground">
          🥋 Graduações de Dan (Yudansha - Níveis Avançados)
        </h3>
        <div className="flex flex-wrap gap-3">
          {danGrades.map((grade, index) => (
            <Badge
              key={index}
              className={`px-4 py-2 text-sm font-semibold ${
                grade.gradient ? "text-gray-900" : grade.color === "#000000" ? "text-white" : "text-white"
              }`}
              style={
                grade.gradient
                  ? { background: grade.gradient }
                  : { backgroundColor: grade.color }
              }
            >
              <span className="font-bold">{grade.level}</span>
              <span className="ml-2 opacity-90">• {grade.name}</span>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeltGrades;

