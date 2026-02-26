import { type ReactNode } from "react"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
  text: string
  children?: ReactNode
  side?: "top" | "right" | "bottom" | "left"
}

export default function TooltipIcon({ text, children, side = "top" }: Props) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children ?? (
            <button
              type="button"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label={text}
            >
              <Info className="size-4" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p className="max-w-xs text-sm">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
