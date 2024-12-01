"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMembers } from "@/hooks/members/use-members"
import { useState } from "react"

interface MemberSelectProps {
  onSelect: (memberId: string) => void
}

export function MemberSelect({ onSelect }: MemberSelectProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const { data: members } = useMembers()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? members?.members.find((member) => member.id === value)?.name
            : "Selecione um membro..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar membro..." />
          <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
          <CommandGroup>
            {members?.members.map((member) => (
              <CommandItem
                key={member.id}
                value={member.id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  onSelect(currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === member.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {member.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
