"use client"

import * as React from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

interface MonthYearPickerProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  allowPresent?: boolean
}

export function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  allowPresent = false
}: MonthYearPickerProps) {
  const [open, setOpen] = React.useState(false)
  const currentYear = new Date().getFullYear()
  const [displayYear, setDisplayYear] = React.useState(currentYear)

  const parseValue = (val: string | undefined) => {
    if (!val || val.toLowerCase() === "present") return { month: null, year: null }
    const parts = val.split(" ")
    if (parts.length === 2) {
      const monthIndex = MONTHS.findIndex(m => m.toLowerCase() === parts[0].toLowerCase())
      const year = parseInt(parts[1])
      if (monthIndex !== -1 && !isNaN(year)) {
        return { month: monthIndex, year }
      }
    }
    return { month: null, year: null }
  }

  const { month: selectedMonth, year: selectedYear } = parseValue(value)

  React.useEffect(() => {
    if (selectedYear) {
      setDisplayYear(selectedYear)
    }
  }, [selectedYear])

  const handleMonthSelect = (monthIndex: number) => {
    const newValue = `${MONTHS[monthIndex]} ${displayYear}`
    onChange(newValue)
    setOpen(false)
  }

  const handlePresentClick = () => {
    onChange("Present")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setDisplayYear(y => y - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold">{displayYear}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setDisplayYear(y => y + 1)}
              disabled={displayYear >= currentYear + 10}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => (
              <Button
                key={month}
                variant={selectedMonth === index && selectedYear === displayYear ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 text-xs",
                  selectedMonth === index && selectedYear === displayYear && "bg-purple-600 hover:bg-purple-700"
                )}
                onClick={() => handleMonthSelect(index)}
              >
                {month}
              </Button>
            ))}
          </div>

          {allowPresent && (
            <Button
              variant={value?.toLowerCase() === "present" ? "default" : "outline"}
              size="sm"
              className={cn(
                "w-full",
                value?.toLowerCase() === "present" && "bg-purple-600 hover:bg-purple-700"
              )}
              onClick={handlePresentClick}
            >
              Present
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
