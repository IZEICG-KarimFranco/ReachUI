import { afterEach, describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/feedback/alert'

const statusTones = ['info', 'success', 'warning', 'signal'] as const
const allTones = ['info', 'success', 'warning', 'error', 'signal'] as const

describe('Alert component contract', () => {
  describe('tone', () => {
    it.each(statusTones)('%s is announced as a non-urgent status', (tone) => {
      render(
        <Alert
          tone={tone}
          title="Twilio conectado."
          description="La verificación tardó 184 ms."
        />
      )
      const alert = screen.getByRole('status')
      expect(alert.getAttribute('data-slot')).toBe('alert')
      expect(alert.getAttribute('data-tone')).toBe(tone)
      expect(alert.textContent).toBe(
        'Twilio conectado.La verificación tardó 184 ms.'
      )
    })

    it('error is announced as an urgent alert', () => {
      render(
        <Alert
          tone="error"
          title="Sync falló"
          description="No pudimos actualizar la plantilla."
        />
      )
      const alert = screen.getByRole('alert')
      expect(alert.getAttribute('data-tone')).toBe('error')
      expect(alert.textContent).toBe(
        'Sync fallóNo pudimos actualizar la plantilla.'
      )
      expect(screen.queryByRole('status')).toBeNull()
    })

    it('signal is announced as a non-urgent status with the title above the text', () => {
      render(
        <Alert
          tone="signal"
          title="Sesión"
          description="Tu sesión usa el correo del SSO."
        />
      )
      const alert = screen.getByRole('status')
      expect(alert.getAttribute('data-tone')).toBe('signal')
      expect(alert.textContent).toBe('SesiónTu sesión usa el correo del SSO.')
      expect(screen.queryByRole('alert')).toBeNull()
    })

    it.each(allTones)(
      '%s marks the alert with a decorative icon, not a dot',
      (tone) => {
        const { container } = render(<Alert tone={tone} description="Texto" />)
        expect(container.querySelector('[data-slot="status-dot"]')).toBeNull()
        const icon = container.querySelector('svg')
        expect(icon?.getAttribute('aria-hidden')).toBe('true')
      }
    )

    it('renders only the description when there is no title', () => {
      render(<Alert tone="info" description="Solo texto" />)
      const alert = screen.getByRole('status')
      expect(screen.queryByText('Solo texto')).not.toBeNull()
      expect(alert.querySelector('[data-slot="alert-title"]')).toBeNull()
      expect(alert.textContent).toBe('Solo texto')
    })

    it('renders only the title when there is no description', () => {
      render(<Alert tone="warning" title="Solo título" />)
      const alert = screen.getByRole('status')
      expect(alert.querySelector('[data-slot="alert-description"]')).toBeNull()
      expect(alert.textContent).toBe('Solo título')
    })

    it('puts the title before the description in bold', () => {
      render(<Alert tone="warning" title="Título." description="Detalle" />)
      const body = screen
        .getByRole('status')
        .querySelector('[data-slot="alert-body"]')
      expect(body?.children).toHaveLength(2)
      expect(body?.firstElementChild?.textContent).toBe('Título.')
      expect(body?.lastElementChild?.textContent).toBe('Detalle')
      expect(body?.firstElementChild?.tagName).toBe('SPAN')
      expect(body?.firstElementChild?.className).toContain('font-bold')
    })

    it('renders children below the description', () => {
      render(
        <Alert tone="info" title="Título." description="Detalle">
          <button type="button">Reintentar</button>
        </Alert>
      )
      const body = screen
        .getByRole('status')
        .querySelector('[data-slot="alert-body"]')
      expect(body?.children).toHaveLength(3)
      expect(body?.children[1]?.textContent).toBe('Detalle')
      expect(body?.lastElementChild).toBe(
        screen.getByRole('button', { name: 'Reintentar' })
      )
    })

    it('forwards className and native attributes to the root', () => {
      render(
        <Alert
          tone="info"
          id="twilio-alert"
          className="mb-4"
          description="Texto"
        />
      )
      const alert = screen.getByRole('status')
      expect(alert.id).toBe('twilio-alert')
      expect(alert.className).toContain('mb-4')
    })
  })

  describe('action', () => {
    afterEach(() => window.history.pushState({}, '', '/'))

    it('does not render the action slot when no action is given', () => {
      const { container } = render(<Alert tone="warning" description="Texto" />)
      expect(container.querySelector('[data-slot="alert-action"]')).toBeNull()
    })

    it('renders the action as a focusable link with its label and href', () => {
      render(
        <Alert
          tone="warning"
          title="2 plantillas en revisión."
          description="Meta suele responder en menos de 24 h."
          action={{ label: 'Ver plantillas', href: '/templates' }}
        />
      )
      const link = screen.getByRole('link', { name: 'Ver plantillas' })
      expect(link.getAttribute('href')).toBe('/templates')

      link.focus()
      expect(document.activeElement).toBe(link)
    })

    it('navigates internal routes in place, without a page reload', () => {
      render(
        <Alert
          tone="info"
          description="Texto"
          action={{ label: 'Ver plantillas', href: '/templates' }}
        />
      )
      const link = screen.getByRole('link', { name: 'Ver plantillas' })

      expect(fireEvent.click(link)).toBe(false)
      expect(window.location.pathname).toBe('/templates')
    })

    it.each(['#detalles', 'https://example.com'])(
      'leaves %s to the browser',
      (href) => {
        render(
          <Alert
            tone="info"
            description="Texto"
            action={{ label: 'Detalles', href }}
          />
        )
        const link = screen.getByRole('link', { name: 'Detalles' })

        expect(fireEvent.click(link)).toBe(true)
        expect(window.location.pathname).toBe('/')
      }
    )
  })

  describe('legacy variant', () => {
    it('keeps rendering the compound alert as role="alert" without tone', () => {
      const { container } = render(
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No se pudo guardar.</AlertDescription>
        </Alert>
      )
      const alert = screen.getByRole('alert')
      expect(alert.getAttribute('data-slot')).toBe('alert')
      expect(alert.hasAttribute('data-tone')).toBe(false)
      expect(
        alert.querySelector('[data-slot="alert-title"]')?.textContent
      ).toBe('Error')
      expect(
        alert.querySelector('[data-slot="alert-description"]')?.textContent
      ).toBe('No se pudo guardar.')
      expect(container.querySelector('[data-slot="status-dot"]')).toBeNull()
    })

    it('keeps a string title as the HTML attribute', () => {
      render(
        <Alert variant="destructive" title="Error">
          Falló
        </Alert>
      )
      expect(screen.getByRole('alert').getAttribute('title')).toBe('Error')
    })

    it.each([
      ['default', 'text-ink'],
      ['destructive', 'bg-error/10'],
      ['warning', 'bg-live/10'],
      ['info', 'bg-info/10'],
      ['success', 'bg-success/10'],
      ['primary', 'bg-signal/10'],
    ] as const)(
      'paints the %s variant with Reach tokens only',
      (variant, expected) => {
        render(<Alert variant={variant}>Texto</Alert>)
        const className = screen.getByRole('alert').className
        expect(className).toContain(expected)
        expect(className).not.toMatch(
          /\b(primary|destructive|warning|card-foreground)\b/
        )
      }
    )
  })
})
