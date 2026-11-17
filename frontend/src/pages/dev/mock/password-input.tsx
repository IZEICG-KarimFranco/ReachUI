import { Field } from '@/components/ui/inputs/field'
import { PasswordInput } from '@/components/ui/inputs/password-input'
import { PasswordStrenghtInput } from '@/components/ui/inputs/password-strenght-input'
import { MockSection, MockShell } from '@/pages/dev/mock/mock-shell'

const strengthCases = [
  { label: 'Contraseña — vacío', value: '' },
  { label: 'Contraseña — débil', value: 'hola123' },
  { label: 'Contraseña — media', value: 'Hola12345' },
  { label: 'Contraseña — fuerte', value: 'HolaMundo2026' },
  { label: 'Contraseña — muy fuerte', value: 'Hola-Mundo_2026!' },
]

export default function PasswordInputMockPage() {
  return (
    <MockShell
      title="PasswordInput y medidor de fuerza"
      description="Mock t02-controls.html (password-*): el botón mostrar/ocultar es tabbable y tiene nombre localizado. El medidor solo va en alta, reset y cambio de contraseña (contrato)."
    >
      <MockSection title="PasswordInput · estados dentro de Field">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Contraseña actual">
            <PasswordInput
              autoComplete="current-password"
              placeholder="········"
            />
          </Field>
          <Field label="Contraseña" required>
            <PasswordInput
              autoComplete="current-password"
              defaultValue="secreto123"
            />
          </Field>
          <Field label="Contraseña" error="Contraseña incorrecta">
            <PasswordInput
              autoComplete="current-password"
              defaultValue="malapass"
            />
          </Field>
          <Field label="Contraseña (deshabilitada)" disabled>
            <PasswordInput defaultValue="noeditable" />
          </Field>
        </div>
      </MockSection>

      <MockSection
        title="PasswordStrenghtInput · niveles del medidor"
        hint="Mismos niveles que los shots del mock; escribe en cualquiera para ver cambiar el medidor y la lista de requisitos."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {strengthCases.map((item) => (
            <Field key={item.label} label={item.label}>
              <PasswordStrenghtInput
                autoComplete="new-password"
                defaultValue={item.value}
              />
            </Field>
          ))}
        </div>
      </MockSection>
    </MockShell>
  )
}
