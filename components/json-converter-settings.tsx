"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Settings2 } from "lucide-react"

export interface ConverterSettings {
  tidyUp: boolean
  attackClones: boolean
  explodeType: 'new-lines' | 'spaces' | 'commas' | 'semicolons'
  quotes: 'none' | 'double' | 'single'
  delimiter: string
  tags: {
    openTag: string
    closeTag: string
  }
  interval: {
    value: number
    openTag: string
    closeTag: string
  }
}

interface JsonConverterSettingsProps {
  settings: ConverterSettings
  onSettingsChange: (settings: ConverterSettings) => void
}

export function JsonConverterSettings({ settings, onSettingsChange }: JsonConverterSettingsProps) {
  const handleChange = (key: keyof ConverterSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  const handleTagsChange = (type: 'openTag' | 'closeTag', value: string) => {
    onSettingsChange({
      ...settings,
      tags: {
        ...settings.tags,
        [type]: value
      }
    })
  }

  const handleIntervalChange = (key: keyof typeof settings.interval, value: any) => {
    onSettingsChange({
      ...settings,
      interval: {
        ...settings.interval,
        [key]: value
      }
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Converter Settings</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tidy Up</Label>
                <p className="text-sm text-muted-foreground">
                  Remove the new lines from output
                </p>
              </div>
              <Switch
                checked={settings.tidyUp}
                onCheckedChange={(checked) => handleChange('tidyUp', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Attack the clones</Label>
                <p className="text-sm text-muted-foreground">
                  Remove the duplicates from the result set
                </p>
              </div>
              <Switch
                checked={settings.attackClones}
                onCheckedChange={(checked) => handleChange('attackClones', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>Explode</Label>
              <p className="text-sm text-muted-foreground">
                Explode your records using this
              </p>
              <Tabs 
                value={settings.explodeType} 
                onValueChange={(value: any) => handleChange('explodeType', value)}
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="new-lines">New Lines</TabsTrigger>
                  <TabsTrigger value="spaces">Spaces</TabsTrigger>
                  <TabsTrigger value="commas">Commas</TabsTrigger>
                  <TabsTrigger value="semicolons">Semicolons</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>Quotes</Label>
              <p className="text-sm text-muted-foreground">
                Add quotes to each record
              </p>
              <Tabs 
                value={settings.quotes} 
                onValueChange={(value: any) => handleChange('quotes', value)}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="none">No</TabsTrigger>
                  <TabsTrigger value="double">Double</TabsTrigger>
                  <TabsTrigger value="single">Single</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>Delimiter</Label>
              <p className="text-sm text-muted-foreground">
                Character used between records
              </p>
              <Input
                value={settings.delimiter}
                onChange={(e) => handleChange('delimiter', e.target.value)}
                placeholder="Enter delimiter"
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <p className="text-sm text-muted-foreground">
                Use Tags to wrap your records. Ex: &lt;strong&gt;
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Open Tag</Label>
                  <Input
                    value={settings.tags.openTag}
                    onChange={(e) => handleTagsChange('openTag', e.target.value)}
                    placeholder="<li>"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Close Tag</Label>
                  <Input
                    value={settings.tags.closeTag}
                    onChange={(e) => handleTagsChange('closeTag', e.target.value)}
                    placeholder="</li>"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Interval</Label>
              <p className="text-sm text-muted-foreground">
                Add a new line after x amount
              </p>
              <Input
                type="number"
                min={0}
                value={settings.interval.value}
                onChange={(e) => handleIntervalChange('value', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label>Interval Wrap</Label>
              <p className="text-sm text-muted-foreground">
                Wrap your intervals with tags
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Open Tag</Label>
                  <Input
                    value={settings.interval.openTag}
                    onChange={(e) => handleIntervalChange('openTag', e.target.value)}
                    placeholder="<ul>"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Close Tag</Label>
                  <Input
                    value={settings.interval.closeTag}
                    onChange={(e) => handleIntervalChange('closeTag', e.target.value)}
                    placeholder="</ul>"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
