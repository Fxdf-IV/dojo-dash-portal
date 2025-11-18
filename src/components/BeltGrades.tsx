import { Badge } from "@/components/ui/badge";
import { danGrades, getTextColor, kyuGrades } from "@/constants/beltDisplay";

const BeltGrades = () => {

  return (
    <div className="space-y-8">
      {/* Kyu Grades */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-foreground">
          Graduações de Kyu (Mudansha - Níveis Iniciais)
        </h3>
        <div className="flex flex-wrap gap-3">
          {kyuGrades.map((grade, index) => (
            <Badge
              key={index}
              className={`px-4 py-2 [text-shadow:_1px_1px_10px_black] text-sm font-semibold ${
                getTextColor(grade.color, grade.level)
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
          Graduações de Dan (Yudansha - Níveis Avançados)
        </h3>
        <div className="flex flex-wrap gap-3">
          {danGrades.map((grade, index) => (
            <Badge
              key={index}
              className={`px-4 py-2 [text-shadow:_1px_1px_10px_black] text-sm font-semibold ${
                getTextColor(grade.color, grade.level)
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

