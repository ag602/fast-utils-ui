"use client"

import type React from "react"

import { useState } from "react"
import { AudioLines, Download, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"

interface AudioEditorProps {
  mode: "trim" | "convert"
}

export function AudioEditor({ mode }: AudioEditorProps) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(60)
  const [format, setFormat] = useState("mp3")
  const [duration, setDuration] = useState(60) // Simulated duration in seconds

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      // Simulate getting audio duration
      setDuration(180)
      setEndTime(180)
    }
  }

  const handleProcess = () => {
    if (!file) return

    setProcessing(true)
    setProgress(0)

    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setProcessing(false)
          return 100
        }
        return newProgress
      })
    }, 300)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="audio-upload">Upload audio</Label>
        <div className="flex items-center gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id="audio-upload" type="file" accept="audio/*" onChange={handleFileChange} />
          </div>
          {file && (
            <div className="flex items-center gap-2 text-sm">
              <AudioLines className="h-4 w-4" />
              <span className="font-medium">{file.name}</span>
              <span className="text-muted-foreground">({Math.round((file.size / 1024 / 1024) * 10) / 10} MB)</span>
            </div>
          )}
        </div>
      </div>

      {mode === "trim" && file && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>
                Trim range: {formatTime(startTime)} - {formatTime(endTime)}
              </Label>
            </div>
            <div className="px-2">
              <Slider
                min={0}
                max={duration}
                step={1}
                value={[startTime, endTime]}
                onValueChange={(value) => {
                  setStartTime(value[0])
                  setEndTime(value[1])
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0:00</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      {mode === "convert" && (
        <div className="space-y-2">
          <Label htmlFor="format">Output format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger id="format" className="w-full max-w-sm">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp3">MP3</SelectItem>
              <SelectItem value="wav">WAV</SelectItem>
              <SelectItem value="ogg">OGG</SelectItem>
              <SelectItem value="flac">FLAC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex gap-4">
        <Button onClick={handleProcess} disabled={!file || processing} className="w-full max-w-sm">
          <Upload className="mr-2 h-4 w-4" />
          {processing ? "Processing..." : mode === "trim" ? "Trim Audio" : "Convert Audio"}
        </Button>

        {progress === 100 && (
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Result
          </Button>
        )}
      </div>

      {processing && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-sm text-center">{progress}% complete</p>
        </div>
      )}
    </div>
  )
}

