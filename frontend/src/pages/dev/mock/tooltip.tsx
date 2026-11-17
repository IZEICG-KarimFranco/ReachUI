import { Copy, Info } from 'lucide-react'
import { Button, IconButton } from '@/components/ui/actions/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/overlays/tooltip'
import { MockSection, MockShell } from '@/pages/dev/mock/mock-shell'

const sides = ['top', 'right', 'bottom', 'left'] as const

export default function TooltipMockPage() {
  return (
    <MockShell
      title="Tooltip"
      description="Tokens Reach: capa z-pop, rounded-control, shadow-pop, bg-card y border-line. Se abre con hover y con foco de teclado; Escape lo cierra."
    >
      <MockSection title="Lados">
        <div className="flex flex-wrap items-center justify-center gap-6 py-10">
          {sides.map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="compact">
                  side=&quot;{side}&quot;
                </Button>
              </TooltipTrigger>
              <TooltipContent side={side}>Tooltip a la {side}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </MockSection>

      <MockSection title="Sobre IconButton (nombre accesible del botón + tooltip)">
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton aria-label="Copiar SID" variant="secondary">
                <Copy />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>Copiar SID</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton aria-label="Más información" variant="quiet">
                <Info />
              </IconButton>
            </TooltipTrigger>
            <TooltipContent side="right">
              Los números provienen de tu instancia Twilio.
            </TooltipContent>
          </Tooltip>
        </div>
      </MockSection>

      <MockSection title="Texto largo (max-w-xs)">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="compact">
              Texto largo
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            El auth token no se muestra después de guardar: si lo pierdes,
            genera uno nuevo desde la consola de Twilio y vuelve a pegarlo aquí.
          </TooltipContent>
        </Tooltip>
      </MockSection>

      <MockSection title="Abierto de forma fija (para medir colores)">
        <div className="flex justify-center py-10">
          <Tooltip open>
            <TooltipTrigger asChild>
              <Button variant="secondary" size="compact">
                Siempre abierto
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Tooltip abierto</TooltipContent>
          </Tooltip>
        </div>
      </MockSection>
    </MockShell>
  )
}
