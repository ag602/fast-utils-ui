// json-editor-buttons/JsonMinifierButton.tsx
import { Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface JsonMinifierButtonProps {
  input: string
  setInput: (input: string) => void
  setOutput: (output: string) => void
  setError: (error: string | null) => void
}

export function JsonMinifierButton({ input, setInput, setOutput, setError }: JsonMinifierButtonProps) {
  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError(null)
    } catch (error) {
      console.error("Failed to minify JSON:", error)
      setError("Invalid JSON: Please check your syntax")
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={handleMinify}>
            <Minimize2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Minify JSON</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
