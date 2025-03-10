// ListButton.tsx
import { List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface ListButtonProps {
  input: string;
  setInput: (input: string) => void;
}

export function ListButton({ input, setInput }: ListButtonProps) {
  const handleList = () => {
    try {
      const parsed = JSON.parse(input);

      // Check if parsed is an object and not an array already
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) { 
        const newArray = Object.entries(parsed).map(([key, value]) => ({
          key,
          value,
        }));
        setInput(JSON.stringify(newArray, null, 2));
      } else if (typeof parsed !== 'object' || parsed === null) {
        // Handle cases where input is not a valid JSON object
        console.error("Invalid JSON object:", parsed);
        // You might want to display an error message to the user here
      }
    } catch (error) {
      // Handle error if JSON is invalid
      console.error("Error converting to list:", error);
      // You might want to display an error message to the user here
    }
  };

  return (
    
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
      <Button variant="outline" size="icon" onClick={handleList}>
      <List className="h-4 w-4" />
    </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Listify JSON</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  );
}