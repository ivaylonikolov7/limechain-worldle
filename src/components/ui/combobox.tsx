import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps<T> {
  items: T[]
  value?: T
  onValueChange?: (value: T | undefined) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  getItemLabel: (item: T) => string
  getItemValue: (item: T) => string
  disabled?: boolean
}

export function Combobox<T>({
  items,
  value,
  onValueChange,
  placeholder = "Select item...",
  searchPlaceholder = "Search...",
  emptyText = "No items found.",
  getItemLabel,
  getItemValue,
  disabled = false,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)

  const selectedItem = value
    ? items.find((item) => getItemValue(item) === getItemValue(value))
    : undefined

  return (
    <Popover open={open && !disabled} onOpenChange={(newOpen) => !disabled && setOpen(newOpen)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedItem ? getItemLabel(selectedItem) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const itemValue = getItemValue(item)
                const isSelected = selectedItem && getItemValue(selectedItem) === itemValue
                return (
                  <CommandItem
                    key={itemValue}
                    value={getItemLabel(item)}
                    onSelect={() => {
                      onValueChange?.(isSelected ? undefined : item)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {getItemLabel(item)}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
