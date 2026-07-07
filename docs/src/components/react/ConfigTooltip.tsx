import { type ReactNode } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
  text: string
  children: ReactNode
  side?: "top" | "right" | "bottom" | "left"
}

export default function ConfigTooltip({ text, children, side = "top" }: Props) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help border-b border-dotted border-current">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent side={side}>
          <p className="max-w-xs text-sm">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
