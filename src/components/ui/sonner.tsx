import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-xl group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border/70 group-[.toaster]:shadow-elevated",
          title: "group-[.toast]:font-semibold",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:leading-relaxed",
          actionButton: "group-[.toast]:rounded-lg group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:rounded-lg group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toaster]:border-success/30",
          error: "group-[.toaster]:border-destructive/30",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
