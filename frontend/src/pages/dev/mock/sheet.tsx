import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Alert } from '@/components/ui/feedback/alert'
import { Button } from '@/components/ui/actions/button'
import { Card, CardItem } from '@/components/ui/layout/card'
import { ConfirmDialog } from '@/components/ui/overlays/confirm-dialog'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/overlays/dialog'
import { Field } from '@/components/ui/inputs/field'
import { Input } from '@/components/ui/inputs/input'
import { Select } from '@/components/ui/selection/select'
import { Combobox } from '@/components/ui/selection/combobox'
import { Textarea } from '@/components/ui/inputs/textarea'
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/overlays/sheet'
import { cn } from '@/lib/utils'
import { CardKeyValueRows } from '@/pages/dev/mock/card'
import { MockNav } from '@/pages/dev/mock/mock-nav'
import { useViewportWidth } from '@/pages/dev/mock/mock-pages'

const DESKTOP_MIN = 981

const LONG_ROWS = Array.from(
  { length: 24 },
  (_, index) =>
    `Evento ${String(index + 1).padStart(2, '0')} · Mensaje entregado a +52 55 1234 56${String(index).padStart(2, '0')}`
)

function Shot({
  name,
  note,
  children,
}: {
  name: string
  note?: string
  children: ReactNode
}) {
  return (
    <section className="mb-6" data-shot={name}>
      <h2 className="mb-1 font-mono text-label uppercase text-muted">{name}</h2>
      {note && <p className="mb-2.5 text-xs text-ink-secondary">{note}</p>}
      <div className="flex flex-wrap items-center gap-3 rounded-surface border border-line bg-card p-4 text-ink">
        {children}
      </div>
    </section>
  )
}

function DismissHint() {
  return <span className="text-[10.5px] text-muted">Esc para cerrar</span>
}

export function SheetDetailShot({ trigger = 'Abrir sheet-detail' }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="primary">{trigger}</Button>
      </SheetTrigger>
      <SheetContent side="responsive">
        <SheetHeader>
          <SheetTitle>Adrián Martínez</SheetTitle>
          <SheetDescription className="font-mono text-[9.5px] tracking-[0.06em]">
            CT-88213
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Card divided>
            <CardKeyValueRows />
          </Card>
          <Alert
            tone="warning"
            title="Verificación pendiente"
            description="El número aún no confirmó recepción del primer mensaje."
          />
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="quiet">Cerrar</Button>
          </SheetClose>
          <span className="flex-1" />
          <DismissHint />
          <Button variant="primary">Editar contacto</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function SheetFormErrorShot({ trigger = 'Abrir sheet-form-error' }) {
  const [name, setName] = useState('Adrián Martínez')
  const [email, setEmail] = useState('adrian@')

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">{trigger}</Button>
      </SheetTrigger>
      <SheetContent side="responsive">
        <SheetHeader>
          <SheetTitle>Editar contacto</SheetTitle>
          <SheetDescription>Cambios sin guardar</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Field label="Nombre" className="max-w-none">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field label="Email" error="Formato inválido" className="max-w-none">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="quiet">Descartar</Button>
          </SheetClose>
          <span className="flex-1" />
          <Button variant="primary" disabled>
            Guardar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const EXPIRATION_OPTIONS = [
  { value: 'never', label: 'Sin expiración' },
  { value: '7', label: '7 días' },
  { value: '30', label: '30 días' },
  { value: '90', label: '90 días' },
  { value: 'custom', label: 'Fecha personalizada' },
]

export function SheetWithSelectShot() {
  const [sheetValue, setSheetValue] = useState('never')
  const [dialogValue, setDialogValue] = useState('never')
  const [sender, setSender] = useState('')

  return (
    <div className="flex flex-wrap gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Abrir sheet con Select</Button>
        </SheetTrigger>
        <SheetContent side="responsive">
          <SheetHeader>
            <SheetTitle>Nueva API Key</SheetTitle>
            <SheetDescription>
              El desplegable del Select debe quedar encima del sheet.
            </SheetDescription>
          </SheetHeader>
          <SheetBody>
            <Field label="Expiración" className="max-w-none">
              <Select
                value={sheetValue}
                onValueChange={setSheetValue}
                options={EXPIRATION_OPTIONS}
              />
            </Field>
          </SheetBody>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="quiet">Cerrar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Abrir Dialog con Select</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva API Key</DialogTitle>
            <DialogDescription>
              Mismo caso que configuración → API Keys.
            </DialogDescription>
          </DialogHeader>
          <Field label="Remitente (Combobox, Popover)" className="max-w-none">
            <Combobox
              value={sender}
              onChange={setSender}
              placeholder="Seleccionar remitente"
              options={[
                { value: 'wa-1', label: '+52 55 1234 5600 · WhatsApp' },
                { value: 'wa-2', label: '+52 81 9876 5400 · WhatsApp' },
                { value: 'sms-1', label: '+52 33 5555 0000 · SMS' },
              ]}
            />
          </Field>
          <Field label="Expiración" className="max-w-none">
            <Select
              value={dialogValue}
              onValueChange={setDialogValue}
              options={EXPIRATION_OPTIONS}
            />
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="quiet">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const IMPORT_STEPS = ['Archivo', 'Mapeo', 'Revisión'] as const

function ImportSteps({ current }: { current: number }) {
  return (
    <ol className="flex overflow-auto rounded-[12px] border border-line bg-card">
      {IMPORT_STEPS.map((label, index) => {
        const active = index === current
        return (
          <li
            key={label}
            aria-current={active ? 'step' : undefined}
            className={cn(
              'flex-1 border-r border-line px-3.5 pt-2.5 pb-3 last:border-r-0',
              active && 'bg-selection'
            )}
          >
            <span className="flex items-center gap-1.5 font-mono text-[9px] leading-none tracking-[0.16em] text-muted">
              {active && (
                <span
                  aria-hidden="true"
                  className="size-[7px] rounded-full bg-signal"
                />
              )}
              {String(index + 1).padStart(2, '0')}
            </span>
            <span
              className={cn(
                'mt-1 block text-[13px]',
                active ? 'font-bold text-ink' : 'font-medium text-ink-secondary'
              )}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function ImportDropzone({
  fileName,
  onFileChange,
}: {
  fileName: string | null
  onFileChange: (name: string | null) => void
}) {
  return (
    <label className="flex cursor-pointer flex-col items-center gap-1.5 rounded-control border border-dashed border-line-strong bg-inset px-3.5 py-[22px] text-center transition-colors focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-signal-contrast hover:border-signal-contrast hover:bg-selection motion-reduce:transition-none">
      <Upload aria-hidden="true" className="size-5 text-muted" />
      <b className="text-[12.5px] font-bold text-ink">
        {fileName ?? 'Arrastra tu CSV aquí'}
      </b>
      <span className="text-[11px] text-muted">
        o haz clic para elegir el archivo
      </span>
      <input
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        onChange={(event) =>
          onFileChange(event.target.files?.[0]?.name ?? null)
        }
      />
    </label>
  )
}

export function SheetImportShot({ trigger = 'Importar CSV' }) {
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <Sheet onOpenChange={(open) => !open && setFileName(null)}>
      <SheetTrigger asChild>
        <Button variant="primary">{trigger}</Button>
      </SheetTrigger>
      <SheetContent side="center">
        <SheetHeader className="gap-4">
          <div className="min-w-0">
            <SheetTitle>Importar contactos</SheetTitle>
            <SheetDescription className="mt-0.5 text-[10px] font-semibold">
              CSV · máx 500k filas
            </SheetDescription>
          </div>
        </SheetHeader>
        <div className="flex-none border-b border-line bg-card px-4 py-3">
          <ImportSteps current={0} />
        </div>
        <SheetBody>
          <ImportDropzone fileName={fileName} onFileChange={setFileName} />
          <Alert
            tone="signal"
            title="Formato"
            description="Una fila por contacto. Columna mínima: phone en E164. Los duplicados se actualizan por teléfono — nunca se crea un segundo contacto."
          />
        </SheetBody>
        <SheetFooter>
          <span className="text-[10.5px] text-muted">
            {fileName
              ? 'Listo para mapear columnas'
              : 'Selecciona un CSV para continuar'}
          </span>
          <span className="flex-1" />
          <SheetClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </SheetClose>
          <Button variant="primary" disabled={!fileName}>
            Continuar →
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const IMPORT_COLUMNS = [
  { column: 'phone', field: 'Teléfono' },
  { column: 'nombre', field: 'Nombre' },
  { column: 'empresa', field: 'Empresa' },
] as const

const IMPORT_FOOTER_HINT = [
  null,
  '3 columnas detectadas',
  '1,204 filas listas para importar',
] as const

export function SheetImportWizardShot({ trigger = 'Importar CSV (3 pasos)' }) {
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    []
  )

  const lastStep = step === IMPORT_STEPS.length - 1

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setStep(0)
      setFileName(null)
      setOpen(true)
      return
    }
    if (pending) return
    if (fileName) {
      setConfirmOpen(true)
      return
    }
    setOpen(false)
  }

  const handleDiscard = () => {
    setConfirmOpen(false)
    setOpen(false)
  }

  const handleContinue = () => {
    if (!lastStep) {
      setStep(step + 1)
      return
    }
    setPending(true)
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      setPending(false)
      setOpen(false)
      toast.success('Importación iniciada', {
        closeButton: false,
        description: `«${fileName}» se está procesando. Te avisaremos al terminar.`,
      })
    }, 1200)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button variant="secondary">{trigger}</Button>
        </SheetTrigger>
        <SheetContent side="center">
          <SheetHeader className="gap-4">
            <div className="min-w-0">
              <SheetTitle>Importar contactos</SheetTitle>
              <SheetDescription className="mt-0.5 text-[10px] font-semibold">
                CSV · máx 500k filas
              </SheetDescription>
            </div>
          </SheetHeader>
          <div className="flex-none border-b border-line bg-card px-4 py-3">
            <ImportSteps current={step} />
          </div>
          <SheetBody>
            {step === 0 && (
              <>
                <ImportDropzone
                  fileName={fileName}
                  onFileChange={setFileName}
                />
                <Alert
                  tone="signal"
                  title="Formato"
                  description="Una fila por contacto. Columna mínima: phone en E164. Los duplicados se actualizan por teléfono — nunca se crea un segundo contacto."
                />
              </>
            )}
            {step === 1 && (
              <Card divided>
                {IMPORT_COLUMNS.map(({ column, field }) => (
                  <CardItem
                    key={column}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="font-mono text-xs text-muted">
                      {column}
                    </span>
                    <span className="text-xs font-semibold">→ {field}</span>
                  </CardItem>
                ))}
              </Card>
            )}
            {step === 2 && (
              <>
                <Card divided>
                  {[
                    { label: 'Archivo', value: fileName },
                    { label: 'Filas', value: '1,204' },
                    { label: 'Columnas mapeadas', value: '3 de 3' },
                  ].map(({ label, value }) => (
                    <CardItem
                      key={label}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="flex-none text-xs text-muted">
                        {label}
                      </span>
                      <span className="min-w-0 truncate text-right text-xs font-semibold">
                        {value}
                      </span>
                    </CardItem>
                  ))}
                </Card>
                <Alert
                  tone="warning"
                  title="Duplicados"
                  description="38 filas actualizarán contactos existentes por teléfono."
                />
              </>
            )}
          </SheetBody>
          <SheetFooter>
            <span className="text-[10.5px] text-muted">
              {step === 0
                ? fileName
                  ? 'Listo para mapear columnas'
                  : 'Selecciona un CSV para continuar'
                : IMPORT_FOOTER_HINT[step]}
            </span>
            <span className="flex-1" />
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() =>
                step === 0 ? handleOpenChange(false) : setStep(step - 1)
              }
            >
              {step === 0 ? 'Cancelar' : 'Atrás'}
            </Button>
            <Button
              variant="primary"
              disabled={step === 0 && !fileName}
              loading={pending}
              onClick={handleContinue}
            >
              {lastStep ? 'Importar' : 'Continuar →'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Descartar la importación?</DialogTitle>
            <DialogDescription>
              Ya elegiste «{fileName}». Si sales ahora se pierden el archivo y
              el mapeo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Seguir editando</Button>
            </DialogClose>
            <Button variant="danger" onClick={handleDiscard}>
              Descartar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

const SEGMENT_ROWS = [
  { label: 'Condiciones', value: '3 · Cliente VIP = Sí' },
  { label: 'Contactos', value: '1,204' },
] as const

export function SheetWithDialogShot({ trigger = 'Abrir sheet con dialog' }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [savedList, setSavedList] = useState<string | null>(null)
  const timerRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    []
  )

  const nameError =
    submitted && !name.trim() ? 'Escribe un nombre para la lista' : undefined

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && pending) return
    if (open) {
      setName('')
      setDescription('')
      setSubmitted(false)
    }
    setDialogOpen(open)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    if (!name.trim() || pending) return
    setPending(true)
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      setPending(false)
      setSavedList(name.trim())
      toast.success('Lista creada', {
        closeButton: false,
        description: `«${name.trim()}» ya está disponible en Listas con 1,204 contactos.`,
      })
      setDialogOpen(false)
    }, 1200)
  }

  const blockWhilePending = (event: Event) => {
    if (pending) event.preventDefault()
  }

  return (
    <Sheet onOpenChange={(open) => !open && setSavedList(null)}>
      <SheetTrigger asChild>
        <Button variant="secondary">{trigger}</Button>
      </SheetTrigger>
      <SheetContent side="responsive">
        <SheetHeader>
          <SheetTitle>Clientes VIP</SheetTitle>
          <SheetDescription>Segmento</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Card divided>
            {SEGMENT_ROWS.map(({ label, value }) => (
              <CardItem
                key={label}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex-none text-xs text-muted">{label}</span>
                <span className="min-w-0 truncate text-right text-xs font-semibold">
                  {value}
                </span>
              </CardItem>
            ))}
            <CardItem className="flex items-center justify-between gap-3">
              <span className="flex-none text-xs text-muted">
                Lista vinculada
              </span>
              <span className="min-w-0 truncate text-right text-xs font-semibold">
                {savedList ?? '—'}
              </span>
            </CardItem>
          </Card>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="quiet">Cerrar</Button>
          </SheetClose>
          <span className="flex-1" />
          <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button variant="primary">Guardar como lista</Button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={!pending}
              onEscapeKeyDown={blockWhilePending}
              onInteractOutside={blockWhilePending}
            >
              <form noValidate onSubmit={handleSubmit} className="grid gap-4">
                <DialogHeader>
                  <DialogTitle>Guardar como lista</DialogTitle>
                  <DialogDescription>
                    Crea una lista estática con los 1,204 contactos del
                    segmento.
                  </DialogDescription>
                </DialogHeader>
                <Field
                  label="Nombre"
                  required
                  error={nameError}
                  className="max-w-none"
                >
                  <Input
                    value={name}
                    disabled={pending}
                    placeholder="Ej. VIP noviembre"
                    onChange={(event) => setName(event.target.value)}
                  />
                </Field>
                <Field
                  label="Descripción"
                  description="Opcional · quiénes son y de dónde vienen"
                  className="max-w-none"
                >
                  <Textarea
                    value={description}
                    disabled={pending}
                    rows={3}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </Field>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={pending}
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit" variant="primary" loading={pending}>
                    {pending ? 'Guardando…' : 'Guardar lista'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function SheetWithConfirmShot({
  trigger = 'Abrir sheet con confirmación',
}) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleDelete = async () => {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 1500))
    toast.success('Segmento eliminado', {
      closeButton: false,
      description: '«Clientes VIP» ya no está disponible en campañas futuras.',
    })
    setSheetOpen(false)
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary">{trigger}</Button>
      </SheetTrigger>
      <SheetContent side="responsive">
        <SheetHeader>
          <SheetTitle>Clientes VIP</SheetTitle>
          <SheetDescription>Segmento</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Card divided>
            {SEGMENT_ROWS.map(({ label, value }) => (
              <CardItem
                key={label}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex-none text-xs text-muted">{label}</span>
                <span className="min-w-0 truncate text-right text-xs font-semibold">
                  {value}
                </span>
              </CardItem>
            ))}
          </Card>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="quiet">Cerrar</Button>
          </SheetClose>
          <span className="flex-1" />
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Eliminar segmento
          </Button>
        </SheetFooter>
      </SheetContent>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        tone="danger"
        title="¿Eliminar este segmento?"
        description="«Clientes VIP» dejará de estar disponible en campañas futuras. Los 1,204 contactos no se eliminan."
        confirmLabel="Eliminar segmento"
        pendingLabel="Eliminando…"
        onConfirm={handleDelete}
      />
    </Sheet>
  )
}

export default function SheetMockPage() {
  const width = useViewportWidth()
  const [lastEvent, setLastEvent] = useState('Ninguno (abre un sheet)')
  const [pendingOpen, setPendingOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const handlePendingOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && pending) {
      setLastEvent('Cierre bloqueado mientras pending está activo')
      return
    }
    setPendingOpen(nextOpen)
    setLastEvent(nextOpen ? 'sheet-pending abierto' : 'sheet-pending cerrado')
  }

  return (
    <div className="min-h-dvh w-full bg-paper text-ink">
      <MockNav />

      <main className="mx-auto w-full max-w-3xl p-6">
        <h1 className="mb-2 text-lg font-semibold text-ink">
          Sheet · interacciones manuales
        </h1>
        <p className="mb-4 text-xs text-ink-secondary">
          Con <code className="font-mono">side=&quot;responsive&quot;</code> es
          bottom sheet por debajo de 981 px y drawer derecho de 440 px desde 981
          px. Prueba Escape, clic en el scrim (
          <code className="font-mono">bg-panel/45</code>), botón X de 44 px y
          retorno del foco al disparador.
        </p>

        <div className="mb-6 flex flex-col gap-1 rounded-surface border border-line bg-card p-3 font-mono text-xs text-ink-secondary">
          <span>
            Viewport: {width} px ·{' '}
            {width >= DESKTOP_MIN
              ? 'Drawer (≥ 981 px)'
              : 'Bottom sheet (< 981 px)'}
          </span>
          <span>
            Último evento: <strong className="text-ink">{lastEvent}</strong>
          </span>
        </div>

        <Shot
          name="sheet-detail"
          note="Card divided con CardKeyValueRows, Alert warning y pie con Cerrar / Esc para cerrar / Editar contacto."
        >
          <SheetDetailShot />
        </Shot>

        <Shot
          name="sheet-form-error"
          note="Field + Input con error en Email; Guardar deshabilitado."
        >
          <SheetFormErrorShot />
        </Shot>

        <Shot
          name="sheet-con-select (capas)"
          note="Select dentro de un Sheet y Select + Combobox (Popover) dentro de un Dialog: el desplegable va en portal y debe quedar encima (z-pop 95 > z-sheet 80)."
        >
          <SheetWithSelectShot />
        </Shot>

        <Shot
          name="sheet-import (side=center)"
          note="Wizard de importación de contacts-switchboard.html: modal centrado de 620 px desde 981 px y bottom sheet (92dvh) por debajo. La barra de pasos y la zona de carga son composición local."
        >
          <SheetImportShot />
        </Shot>

        <Shot
          name="sheet-import-wizard (3 pasos)"
          note="Mismo sheet side=center con estado de flujo: la cabecera, la barra de pasos y el pie no se desmontan; solo cambia SheetBody. Atrás conserva el archivo; con archivo cargado, cerrar (Cancelar, X, Escape o escrim) pide confirmación en un Dialog; Importar queda en pending 1,2 s sin poder cerrar y termina con un toast."
        >
          <SheetImportWizardShot />
        </Shot>

        <Shot
          name="sheet-con-dialog (formulario encima del sheet)"
          note="El botón del pie abre un Dialog con formulario. Escape, el scrim o Cancelar cierran solo el diálogo y el foco vuelve al botón dentro del sheet. Nombre es obligatorio; al guardar (1,2 s en pending, sin poder cerrar) el diálogo se cierra y el sheet muestra la lista vinculada, más un toast de éxito."
        >
          <SheetWithDialogShot />
        </Shot>

        <Shot
          name="sheet-con-confirm (ConfirmDialog encima del sheet)"
          note="El botón del pie abre un ConfirmDialog. Por debajo de 981 px el sheet y la confirmación son bottom sheets: la confirmación queda encima del sheet y del scrim. Escape, el scrim o Cancelar cierran solo la confirmación y el foco vuelve a «Eliminar segmento». Al confirmar (1,5 s en pending, sin poder cerrar) se cierran los dos y sale un toast."
        >
          <SheetWithConfirmShot />
        </Shot>

        <Shot
          name="sheet-cuerpo-largo (560 px)"
          note="Solo SheetBody hace scroll; cabecera y pie quedan fijos. Ancho 560 px con className."
        >
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Abrir cuerpo largo</Button>
            </SheetTrigger>
            <SheetContent side="responsive" className="desktop:w-[560px]">
              <SheetHeader>
                <SheetTitle>Historial de envíos</SheetTitle>
                <SheetDescription>24 eventos</SheetDescription>
              </SheetHeader>
              <SheetBody>
                {LONG_ROWS.map((row) => (
                  <p
                    key={row}
                    className="rounded-control border border-line bg-card p-3 text-sm text-ink-secondary"
                  >
                    {row}
                  </p>
                ))}
              </SheetBody>
              <SheetFooter>
                <span className="flex-1" />
                <DismissHint />
                <SheetClose asChild>
                  <Button variant="primary">Listo</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Shot>

        <Shot
          name="sheet-pending"
          note="Mientras guarda se bloquean Escape, scrim, X y el clic repetido en Guardar. Pulsa «Terminar» para liberarlo."
        >
          <Button
            variant="secondary"
            onClick={() => handlePendingOpenChange(true)}
          >
            Abrir sheet-pending
          </Button>
          <Sheet open={pendingOpen} onOpenChange={handlePendingOpenChange}>
            <SheetContent side="responsive" showCloseButton={!pending}>
              <SheetHeader>
                <SheetTitle>Editar contacto</SheetTitle>
                <SheetDescription>
                  {pending ? 'Guardando…' : 'Cambios sin guardar'}
                </SheetDescription>
              </SheetHeader>
              <SheetBody>
                <Field label="Nombre" className="max-w-none">
                  <Input defaultValue="Adrián Martínez" disabled={pending} />
                </Field>
              </SheetBody>
              <SheetFooter>
                <Button
                  variant="quiet"
                  disabled={!pending}
                  onClick={() => {
                    setPending(false)
                    setLastEvent('Pending liberado')
                  }}
                >
                  Terminar
                </Button>
                <span className="flex-1" />
                <Button
                  variant="primary"
                  loading={pending}
                  onClick={() => {
                    setPending(true)
                    setLastEvent('Guardando (pending activo)')
                  }}
                >
                  {pending ? 'Guardando…' : 'Guardar'}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Shot>

        <Shot
          name="sheet-left y sheet-right (legacy)"
          note="side=left es el del sidebar móvil; side=right es el valor por defecto actual (LEGACY). Ambos con la X absoluta de 44 px."
        >
          {(['left', 'right'] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="secondary">
                  Abrir side=&quot;{side}&quot;
                </Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>side=&quot;{side}&quot;</SheetTitle>
                  <SheetDescription>
                    Layout de los consumidores actuales.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 p-4 text-sm text-ink-secondary">
                  Contenido libre del consumidor.
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="secondary">Cerrar</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </Shot>
      </main>
    </div>
  )
}
