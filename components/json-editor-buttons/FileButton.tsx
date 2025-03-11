// json-editor-buttons/FileButton.tsx
import { FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const SAMPLE_JSON = {
  "name": "FastUtils",
  "version": "1.0.0",
  "description": "An all-in-one utility hub",
  "features": [
    "JSON formatting",
    "File conversion",
    "Image editing"
  ],
  "settings": {
    "theme": "dark",
    "indentation": 2
  }
}

interface FileButtonProps {
  input: string
  setInput: (input: string) => void
  setError: (error: string | null) => void
}

export function FileButton({ setInput, setError }: FileButtonProps) {
  const handleLoadSample = () => {
    try {
      const sample = JSON.stringify(SAMPLE_JSON, null, 2)
      setInput(sample)
      setError(null)
    } catch (error) {
      console.error("Failed to load sample JSON:", error)
      setError("Failed to load sample JSON")
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={handleLoadSample}>
            <FileJson className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Load Sample JSON</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}