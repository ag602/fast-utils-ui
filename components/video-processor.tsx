"use client"

import type React from "react"

import { useState } from "react"
import { FileVideo, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"

interface VideoProcessorProps {
  mode: "compress" | "convert"
}

export function VideoProcessor({ mode }: VideoProcessorProps) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [quality, setQuality] = useState(80)
  const [format, setFormat] = useState("mp4")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleProcess = () => {
    if (!file) return

    setProcessing(true)
    setProgress(0)

    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setProcessing(false)
          return 100
        }
        return newProgress
      })
    }, 300)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="video-upload">Upload video</Label>
        <div className="flex items-center gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} />
          </div>
          {file && (
            <div className="flex items-center gap-2 text-sm">
              <FileVideo className="h-4 w-4" />
              <span className="font-medium">{file.name}</span>
              <span className="text-muted-foreground">({Math.round((file.size / 1024 / 1024) * 10) / 10} MB)</span>
            </div>
          )}
        </div>
      </div>

      {mode === "compress" && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="quality">Quality: {quality}%</Label>
          </div>
          <Slider
            id="quality"
            min={10}
            max={100}
            step={1}
            value={[quality]}
            onValueChange={(value) => setQuality(value[0])}
          />
          <p className="text-xs text-muted-foreground">Lower quality = smaller file size</p>
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
              <SelectItem value="mp4">MP4</SelectItem>
              <SelectItem value="webm">WebM</SelectItem>
              <SelectItem value="mov">MOV</SelectItem>
              <SelectItem value="avi">AVI</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button onClick={handleProcess} disabled={!file || processing} className="w-full max-w-sm">
        <Upload className="mr-2 h-4 w-4" />
        {processing ? "Processing..." : mode === "compress" ? "Compress Video" : "Convert Video"}
      </Button>

      {processing && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-sm text-center">{progress}% complete</p>
        </div>
      )}
    </div>
  )
}

