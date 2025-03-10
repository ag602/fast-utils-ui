// json-editor-buttons/UndoButton.tsx
import { Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

interface UndoButtonProps {
  input: string;
  setInput: (input: string) => void;
}

export function UndoButton({ input, setInput }: UndoButtonProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    // Update history whenever input changes
    if (input && (history.length === 0 || input !== history[currentIndex])) {
      const newHistory = [...history.slice(0, currentIndex + 1), input];
      // Keep only last 10 states to prevent excessive memory use
      const trimmedHistory = newHistory.slice(-10);
      setHistory(trimmedHistory);
      setCurrentIndex(trimmedHistory.length - 1);
    }
  }, [input, history, currentIndex]);
  
  const handleUndo = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setInput(history[newIndex]);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={handleUndo} disabled={currentIndex <= 0}>
            <Undo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Undo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}