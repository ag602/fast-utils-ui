"use client"

import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface UtilityCardProps {
  title: string
  description: string
  icon: ReactNode
  onClick: () => void
}

export function UtilityCard({ title, description, icon, onClick }: UtilityCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="p-2 rounded-md bg-primary/10">{icon}</div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full justify-between" onClick={onClick}>
          Open utility
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

