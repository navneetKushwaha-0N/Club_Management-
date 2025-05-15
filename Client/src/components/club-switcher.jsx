"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const clubs = [
  {
    label: "Tennis Club",
    value: "tennis-club",
    icon: "🎾",
  },
  {
    label: "Chess Club",
    value: "chess-club",
    icon: "♟️",
  },
  {
    label: "Photography Club",
    value: "photography-club",
    icon: "📷",
  },
]

export function ClubSwitcher({ className }) {
  const [open, setOpen] = React.useState(false)
  const [showNewClubDialog, setShowNewClubDialog] = React.useState(false)
  const [selectedClub, setSelectedClub] = React.useState(clubs[0])

  return (
    <Dialog open={showNewClubDialog} onOpenChange={setShowNewClubDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a club"
            className={cn("w-[200px] justify-between", className)}
          >
            <div className="flex items-center gap-2">
              {selectedClub.icon && <span className="mr-1">{selectedClub.icon}</span>}
              <span>{selectedClub.label}</span>
            </div>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search club..." />
              <CommandEmpty>No club found.</CommandEmpty>
              <CommandGroup heading="Your clubs">
                {clubs.map((club) => (
                  <CommandItem
                    key={club.value}
                    onSelect={() => {
                      setSelectedClub(club)
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {club.icon && <span>{club.icon}</span>}
                      {club.label}
                    </div>
                    <Check
                      className={cn("ml-auto h-4 w-4", selectedClub.value === club.value ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    setShowNewClubDialog(true)
                  }}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Club
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create club</DialogTitle>
          <DialogDescription>Add a new club to manage its members and activities.</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Club name</Label>
              <Input id="name" placeholder="Tennis Club" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewClubDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowNewClubDialog(false)}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
