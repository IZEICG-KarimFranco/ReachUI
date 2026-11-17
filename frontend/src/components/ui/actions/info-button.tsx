import { Button } from '@/components/ui/actions/button'
import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/overlays/tooltip'

interface InfoButtonProps {
  label: string
  onClick?: () => void
}

function InfoButton({ label, onClick }: InfoButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="default"
          size="icon-sm"
          type="button"
          onClick={onClick}
          className="rounded-full bg-transparent text-muted-foreground shadow-none hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all duration-200"
        >
          <Info className="size-4" />
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

export { InfoButton, type InfoButtonProps }
