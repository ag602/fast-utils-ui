// json-editor-buttons/JsonBeautifierButton.tsx
import { Braces } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface JsonBeautifierButtonProps {
  input: string;
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setError: (error: string | null) => void;
}

export function JsonBeautifierButton({ input, setInput, setOutput, setError }: JsonBeautifierButtonProps) {
  const handleBeautify = () => {
    try {
      const parsed = JSON.parse(input);
      const beautified = JSON.stringify(parsed, null, 2);
      setInput(beautified);
      setOutput(beautified);
      setError(null);
    } catch (error) {
      console.error("Failed to beautify JSON:", error);
      setError("Invalid JSON: Please check your syntax");
      setOutput("");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={handleBeautify}>
            <Braces className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Beautify JSON</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}