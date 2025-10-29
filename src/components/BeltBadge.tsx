import { Badge } from "@/components/ui/badge";

interface BeltBadgeProps {
  kyu?: number;
  dan?: number;
  className?: string;
}

export const getBeltColor = (kyu?: number, dan?: number) => {
  if (dan) {
    if (dan >= 1 && dan <= 5) return { color: "#000000", textColor: "#FFFFFF" };
    if (dan === 6) return { gradient: "linear-gradient(90deg, #E53935 50%, #FFFFFF 50%)", textColor: "#1F2937" };
    if (dan === 7 || dan === 8) return { gradient: "linear-gradient(90deg, #E53935 50%, #FFFFFF 50%)", textColor: "#1F2937" };
    if (dan === 9 || dan === 10) return { color: "#B71C1C", textColor: "#FFFFFF" };
  }
  
  if (kyu) {
    const colors: { [key: number]: { color: string; textColor: string } } = {
      9: { color: "#FFFFFF", textColor: "#1F2937" },
      8: { color: "#E53935", textColor: "#FFFFFF" },
      7: { color: "#FDD835", textColor: "#1F2937" },
      6: { color: "#FB8C00", textColor: "#FFFFFF" },
      5: { color: "#1E88E5", textColor: "#FFFFFF" },
      4: { color: "#9E9E9E", textColor: "#FFFFFF" },
      3: { color: "#43A047", textColor: "#1F2937" },
      2: { color: "#8E24AA", textColor: "#FFFFFF" },
      1: { color: "#6D4C41", textColor: "#FFFFFF" },
    };
    return colors[kyu] || { color: "#000000", textColor: "#FFFFFF" };
  }
  
  return { color: "#000000", textColor: "#FFFFFF" };
};

const BeltBadge = ({ kyu, dan, className = "" }: BeltBadgeProps) => {
  const style = getBeltColor(kyu, dan);
  
  return (
    <Badge
      className={`font-semibold ${className}`}
      style={{
        ...(style.gradient 
          ? { background: style.gradient } 
          : { backgroundColor: style.color }),
        color: style.textColor
      }}
    >
      {dan ? `${dan}º Dan` : `${kyu}º Kyu`}
    </Badge>
  );
};

export default BeltBadge;
