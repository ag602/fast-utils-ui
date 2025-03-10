import { useState } from "react"
import { Wand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MagicFixButtonProps {
  input: string
  setInput: (input: string) => void
  setOutput: (output: string) => void
  setError: (error: string | null) => void
}

export function MagicFixButton({ input, setInput, setOutput, setError }: MagicFixButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleMagicFix = async () => {
    if (!input.trim()) {
      setError("Please enter some JSON to fix")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8080/api/json/fix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ json: input }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to fix JSON")
      }

      const fixedJson = await response.text()
      try {
        // Verify that the response is valid JSON
        JSON.parse(fixedJson)
        setInput(fixedJson)
        setOutput(fixedJson)
      } catch (e) {
        throw new Error("Received invalid JSON from server")
      }
    } catch (error) {
      console.error("Error fixing JSON:", error)
      setError(error instanceof Error ? error.message : "Failed to fix JSON. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleMagicFix}
            disabled={isLoading || !input}
          >
            <Wand className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>AI Fix & Beautify</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}