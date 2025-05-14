
import { useToast as useShadcnToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

// Re-export the useToast hook from shadcn
export const useToast = useShadcnToast;

// Create an extended toast object with success and error methods
export const toast = {
  ...sonnerToast,
  success: (message: string) => {
    return sonnerToast(message, {
      style: { backgroundColor: "hsl(var(--success))" },
    });
  },
  error: (message: string) => {
    return sonnerToast(message, {
      style: { backgroundColor: "hsl(var(--destructive))" },
    });
  }
};
