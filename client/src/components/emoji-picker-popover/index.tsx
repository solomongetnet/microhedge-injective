"use client"

import * as React from "react"
import { Smile } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export type EmojiItem = {
  char: string
  name: string
  keywords?: string[]
}

const DEFAULT_EMOJIS: EmojiItem[] = [
  // Smileys & Emotion
  { char: "😀", name: "Grinning Face", keywords: ["smile", "happy"] },
  { char: "😁", name: "Beaming Face", keywords: ["grin", "cheese"] },
  { char: "😂", name: "Face with Tears of Joy", keywords: ["lol", "joy", "tears"] },
  { char: "🤣", name: "Rolling on the Floor Laughing", keywords: ["rofl"] },
  { char: "😊", name: "Smiling Face with Smiling Eyes", keywords: ["blush", "warm"] },
  { char: "🙂", name: "Slightly Smiling Face", keywords: ["smile", "ok"] },
  { char: "😉", name: "Winking Face", keywords: ["wink"] },
  { char: "😍", name: "Smiling Face with Heart-Eyes", keywords: ["love"] },
  { char: "😘", name: "Face Blowing a Kiss", keywords: ["kiss"] },
  { char: "😎", name: "Smiling Face with Sunglasses", keywords: ["cool"] },
  { char: "🤩", name: "Star-Struck", keywords: ["star", "wow"] },
  { char: "🤔", name: "Thinking Face", keywords: ["hmm", "think"] },
  { char: "😐", name: "Neutral Face", keywords: ["meh"] },
  { char: "😴", name: "Sleeping Face", keywords: ["sleep"] },
  { char: "😮‍💨", name: "Face Exhaling", keywords: ["relief", "phew"] },
  { char: "🥳", name: "Partying Face", keywords: ["party", "celebrate"] },
  { char: "🥹", name: "Face Holding Back Tears", keywords: ["touching"] },
  { char: "😭", name: "Loudly Crying Face", keywords: ["cry"] },
  { char: "😡", name: "Enraged Face", keywords: ["angry"] },
  { char: "🤯", name: "Exploding Head", keywords: ["mind blown"] },

  // Hand gestures
  { char: "👍", name: "Thumbs Up", keywords: ["like", "approve"] },
  { char: "👎", name: "Thumbs Down", keywords: ["dislike"] },
  { char: "🙏", name: "Folded Hands", keywords: ["thanks", "please", "pray"] },
  { char: "👏", name: "Clapping Hands", keywords: ["applause", "bravo"] },
  { char: "🙌", name: "Raising Hands", keywords: ["hooray"] },
  { char: "🤝", name: "Handshake", keywords: ["deal", "agree"] },
  { char: "👌", name: "OK Hand", keywords: ["ok"] },
  { char: "🤌", name: "Pinched Fingers", keywords: ["chef", "pinch"] },
  { char: "✌️", name: "Victory Hand", keywords: ["peace"] },
  { char: "🤘", name: "Sign of the Horns", keywords: ["rock"] },

  // Symbols & misc
  { char: "❤️", name: "Red Heart", keywords: ["love", "heart"] },
  { char: "🧡", name: "Orange Heart", keywords: ["heart"] },
  { char: "💛", name: "Yellow Heart", keywords: ["heart"] },
  { char: "💚", name: "Green Heart", keywords: ["heart"] },
  { char: "💙", name: "Blue Heart", keywords: ["heart"] },
  { char: "💜", name: "Purple Heart", keywords: ["heart"] },
  { char: "🤍", name: "White Heart", keywords: ["heart"] },
  { char: "🔥", name: "Fire", keywords: ["lit", "hot"] },
  { char: "✨", name: "Sparkles", keywords: ["magic"] },
  { char: "💯", name: "Hundred Points", keywords: ["100", "keep it 100"] },
  { char: "🎉", name: "Party Popper", keywords: ["celebration", "congrats"] },
  { char: "✅", name: "Check Mark Button", keywords: ["done", "check"] },
  { char: "⚡", name: "High Voltage", keywords: ["zap", "energy"] },
  { char: "☕", name: "Hot Beverage", keywords: ["coffee", "tea"] },
  { char: "🍕", name: "Pizza", keywords: ["food"] },
  { char: "🚀", name: "Rocket", keywords: ["launch"] },
  { char: "⭐", name: "Star", keywords: ["favorite"] },
]

export interface EmojiPickerProps {
  emojis?: EmojiItem[]
  onSelect?: (emoji: EmojiItem) => void
  trigger?: React.ReactNode
  title?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  columns?: number
  className?: string
}

export function EmojiPicker(props: EmojiPickerProps = {}) {
  const {
    emojis = DEFAULT_EMOJIS,
    onSelect = () => {},
    trigger = null,
    title = "Pick an emoji",
    open,
    onOpenChange,
    columns = 8,
    className,
  } = props

  const isControlled = typeof open === "boolean"
  const [internalOpen, setInternalOpen] = React.useState(false)
  const actualOpen = isControlled ? (open as boolean) : internalOpen
  const setOpen = (v: boolean) => {
    if (isControlled) onOpenChange?.(v)
    else setInternalOpen(v)
  }

  const items = emojis
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([])
  itemRefs.current = []

  const handleKeyNav = (idx: number, e: React.KeyboardEvent<HTMLButtonElement>) => {
    const cols = Math.max(1, Math.min(columns, 12))
    let nextIndex = idx
    switch (e.key) {
      case "ArrowRight":
        nextIndex = Math.min(items.length - 1, idx + 1)
        break
      case "ArrowLeft":
        nextIndex = Math.max(0, idx - 1)
        break
      case "ArrowDown":
        nextIndex = Math.min(items.length - 1, idx + cols)
        break
      case "ArrowUp":
        nextIndex = Math.max(0, idx - cols)
        break
      default:
        return
    }
    e.preventDefault()
    itemRefs.current[nextIndex]?.focus()
  }

  const DefaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Smile className="size-4" />
      {"Add emoji"}
    </Button>
  )

  return (
    <Popover open={actualOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger ?? DefaultTrigger}</PopoverTrigger>
      <PopoverContent className={cn("w-[320px] p-1 mb-2 mr-2" , className)}>
        {/* <div className="border-b px-3 py-2">
          <div className="text-sm font-medium">{title}</div>
        </div> */}

        <ScrollArea className="max-h-72">
          <div
            role="listbox"
            aria-label="Emoji list"
            className="p-2"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.max(4, Math.min(columns, 12))}, minmax(0, 1fr))`,
              gap: "0.75rem",
            }}
          >
            {items.map((e, idx) => (
              <button
                key={`${e.char}-${idx}`}
                ref={(el) => {
                  itemRefs.current[idx] = el
                }}
                type="button"
                role="option"
                aria-label={e.name}
                aria-selected={false}
                className={cn(
                  "flex items-center justify-center rounded-md transition",
                  "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground/30"
                )}
                onKeyDown={(ev) => handleKeyNav(idx, ev)}
                onClick={() => {
                  onSelect(e)
                  setOpen(false)
                }}
                title={e.name}
              >
                <span aria-hidden="true" className="text-xl"> {e.char}</span>
              </button>
            ))}
            {items.length === 0 && (
              <div className="col-span-full py-8 text-center text-sm text-muted-foreground">
                {"No emojis available"}
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker
