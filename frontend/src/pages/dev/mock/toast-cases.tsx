import { toast, type ExternalToast } from 'sonner'

export type ToastCase = {
  label: string
  group: 'tipos' | 'contenido' | 'reales'
  run: (options: ExternalToast) => void
}

export const toastCases: ToastCase[] = [
  {
    label: 'Neutral',
    group: 'tipos',
    run: (options) => toast('Cambios guardados', options),
  },
  {
    label: 'Success',
    group: 'tipos',
    run: (options) => toast.success('Plantilla aprobada', options),
  },
  {
    label: 'Error',
    group: 'tipos',
    run: (options) =>
      toast.error('No pudimos actualizar la plantilla', options),
  },
  {
    label: 'Info',
    group: 'tipos',
    run: (options) => toast.info('Twilio OK · latencia 184 ms', options),
  },
  {
    label: 'Warning',
    group: 'tipos',
    run: (options) => toast.warning('2 plantillas en revisión', options),
  },
  {
    label: 'Promise',
    group: 'tipos',
    run: (options) =>
      toast.promise(new Promise<void>((resolve) => setTimeout(resolve, 2500)), {
        ...options,
        loading: 'Reintentando importación',
        success: 'Importación iniciada',
        error: 'No se pudo reintentar',
      }),
  },
  {
    label: 'Promise que falla',
    group: 'tipos',
    run: (options) =>
      toast.promise(
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('Twilio no respondió')), 2500)
        ),
        {
          ...options,
          loading: 'Reintentando importación',
          success: 'Importación iniciada',
          error: (error: Error) => `No se pudo reintentar: ${error.message}`,
        }
      ),
  },
  {
    label: 'Texto largo',
    group: 'contenido',
    run: (options) =>
      toast.error(
        'No pudimos sincronizar el estado de la plantilla con Meta. Reintenta en unos minutos o revisa la conexión con Twilio.',
        options
      ),
  },
  {
    label: 'Descripción + acción',
    group: 'contenido',
    run: (options) =>
      toast.success('Campaña programada', {
        ...options,
        description: 'Sale mañana a las 9:00 con 1,240 contactos.',
        action: { label: 'Ver campaña', onClick: () => undefined },
      }),
  },
  {
    label: 'Llamada entrante (inbox)',
    group: 'reales',
    run: (options) =>
      toast.info('Llamada entrante', {
        ...options,
        id: 'dev-incoming-ring',
        description: (
          <button
            type="button"
            className="text-left text-sm hover:underline cursor-pointer"
            onClick={() => toast.dismiss('dev-incoming-ring')}
          >
            De Carmen Ruiz
          </button>
        ),
        duration: Infinity,
        dismissible: false,
        closeButton: true,
        action: {
          label: 'Atender',
          actionButtonStyle: { marginLeft: 8, marginRight: 4 },
          onClick: () => toast.dismiss('dev-incoming-ring'),
        },
        classNames: {
          toast: '!w-auto !max-w-[min(100vw-2rem,24rem)]',
          content: '!flex-none cursor-pointer',
          actionButton:
            '!ml-2 !mr-0 !shrink-0 !border !border-info/40 !bg-info/15 !px-3 !py-1 !text-info !font-medium !shadow-none hover:!bg-info/25',
          closeButton:
            '!border-info/30 !bg-info/10 !text-info hover:!bg-info/20',
        },
      }),
  },
  {
    label: 'bottom-right (file-upload)',
    group: 'reales',
    run: (options) =>
      toast.error('Archivo no válido', {
        ...options,
        position: 'bottom-right',
        duration: 3000,
      }),
  },
]
