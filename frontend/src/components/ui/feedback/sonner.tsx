import {
  CircleCheckIcon,
  InfoIcon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

import { useToasterPosition } from '@/components/ui/hooks/use-toaster-position'
import { Spinner } from '@/components/ui/feedback/spinner'

// outline-none sets the outline style to none, so the ring needs outline-solid.
// Inside the always-dark panel the ring takes the panel accent, not the theme's.
const focusRing =
  'outline-none focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-on-panel-accent'

// The ring of the toast itself sits outside the panel, over the page. Sonner's
// unlayered `[data-sonner-toast]{outline:none}` beats utilities, hence the `!`.
const toastFocusRing =
  'outline-none focus-visible:outline-solid! focus-visible:outline-3! focus-visible:outline-offset-2! focus-visible:outline-signal-contrast!'

// Sonner hides the content of stacked toasts only in styled mode; unstyled we
// repeat it, or a tall toast overflows the front toast's height.
const hideWhenStacked = '[&[data-expanded=false][data-front=false]>*]:opacity-0'

const toastClassNames = {
  toast: `flex w-(--width) items-center gap-3 rounded-pill border border-panel-separator bg-panel py-3 pr-3 pl-4 text-xs text-on-panel shadow-pop ${hideWhenStacked} ${toastFocusRing}`,
  icon: 'relative flex size-4 shrink-0 items-center justify-center',
  content: 'flex min-w-0 flex-1 flex-col gap-0.5',
  title: 'leading-normal',
  description: 'leading-normal text-on-panel-secondary',
  actionButton: `shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold text-on-panel-accent hover:bg-panel-secondary ${focusRing}`,
  cancelButton: `shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold text-on-panel-muted hover:bg-panel-secondary ${focusRing}`,
  closeButton: `order-last flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-on-panel-muted hover:bg-panel-secondary hover:text-on-panel ${focusRing}`,
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { t } = useTranslation()
  const position = useToasterPosition()

  return (
    // The panel is dark in both app themes; Sonner's own dark theme would
    // repaint the close button and description with its palette.
    <Sonner
      theme="light"
      position={position}
      closeButton
      containerAriaLabel={t('user_menu.notifications')}
      toastOptions={{
        unstyled: true,
        classNames: toastClassNames,
        closeButtonAriaLabel: t('common.close'),
      }}
      icons={{
        success: <CircleCheckIcon className="dark size-4 text-success" />,
        info: <InfoIcon className="dark size-4 text-info" />,
        warning: <TriangleAlertIcon className="dark size-4 text-live" />,
        error: <OctagonXIcon className="dark size-4 text-error" />,
        loading: (
          <Spinner
            aria-hidden="true"
            className="size-4 text-on-panel-secondary"
          />
        ),
      }}
      {...props}
      richColors={false}
    />
  )
}

export { Toaster }
