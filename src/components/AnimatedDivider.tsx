import { useEffect, useState, useRef } from "react";
import dividerImage from "@/assets/images/components/divider.webp";

interface AnimatedDividerProps {
  imageSrc?: string;
  alt?: string;
}

export const AnimatedDivider = ({ 
  imageSrc = dividerImage, 
  alt = "Divisor" 
}: AnimatedDividerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full relative h-0 z-20 flex justify-center">
      <img 
        src={imageSrc} 
        alt={alt} 
        className={`absolute top-0 left-0 w-full h-auto object-cover -translate-y-1/2 pointer-events-none opacity-98 transition-transform duration-1000 ease-out ${
          isVisible ? 'translate-x-[-1%]' : '-translate-x-full'
        }`} 
      />
    </div>
  );  
};
