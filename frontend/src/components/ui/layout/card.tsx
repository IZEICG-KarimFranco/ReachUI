import * as React from 'react'

import { Surface } from '@/components/ui/layout/surface'
import { cn } from '@/lib/utils'

/** Contenedor (plate o pane). `divided` dibuja una línea entre sus hijos directos, de borde a borde. */
function Card({
  className,
  divided = false,
  ...props
}: React.ComponentProps<typeof Surface> & { divided?: boolean }) {
  return (
    <Surface
      data-slot="card"
      data-divided={divided}
      className={cn(
        'flex flex-col',
        divided && 'divide-y divide-line',
        className
      )}
      {...props}
    />
  )
}

/** Fila de cabecera: `flex justify-between`. Sin estilos de texto; el consumidor define título y acción. */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'flex items-center justify-between gap-2 px-4 py-3',
        className
      )}
      {...props}
    />
  )
}

/** Columna flexible de la cabecera: agrupa título, meta (en línea) y descripción (en su propia línea). */
function CardHeading({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-heading"
      className={cn(
        'flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5 [&>[data-slot=card-description]]:basis-full',
        className
      )}
      {...props}
    />
  )
}

/** Título de la card: `h3` por defecto; `level` cambia el nivel del heading. */
function CardTitle({
  className,
  level = 3,
  ...props
}: React.ComponentProps<'h3'> & { level?: 2 | 3 | 4 }) {
  const Heading = `h${level}` as 'h2' | 'h3' | 'h4'
  return (
    <Heading
      data-slot="card-title"
      className={cn('text-xs font-semibold break-words text-ink', className)}
      {...props}
    />
  )
}

/** Dato corto en línea con el título (conteo, ID). `mono` para identificadores. */
function CardMeta({
  className,
  mono = false,
  ...props
}: React.ComponentProps<'span'> & { mono?: boolean }) {
  return (
    <span
      data-slot="card-meta"
      data-mono={mono}
      className={cn(
        'text-xs text-muted',
        mono && 'font-mono text-xs tracking-[0.04em]',
        className
      )}
      {...props}
    />
  )
}

/** Texto descriptivo; dentro de `CardHeading` ocupa su propia línea bajo el título. */
function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-xs text-muted', className)}
      {...props}
    />
  )
}

// LEGACY: borrar al terminar la migración del rediseño (T02–T06); el header es flex y la acción va como hijo directo
function CardAction(props: React.ComponentProps<'div'>) {
  return <div data-slot="card-action" {...props} />
}

/** Cuerpo libre (`p-4`). `centered` centra un texto plano; alto mínimo y texto los pone el consumidor. No lleva `CardItem` dentro. */
function CardContent({
  className,
  centered = false,
  ...props
}: React.ComponentProps<'div'> & { centered?: boolean }) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        'min-w-0 p-4',
        centered && 'grid place-items-center text-center',
        className
      )}
      {...props}
    />
  )
}

/** Fila de lista (`px-4 py-3`). Va como hijo directo de `Card` para que `divided` la separe; no se anida en `CardContent`. */
function CardItem({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-item"
      className={cn('min-w-0 px-4 py-3', className)}
      {...props}
    />
  )
}

/** Fila de pie: `flex`, sin alineación ni texto por defecto (`justify-end` y estilos los define el consumidor). */
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center gap-2 px-4 py-3', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardHeading,
  CardFooter,
  CardTitle,
  CardMeta,
  CardAction,
  CardDescription,
  CardContent,
  CardItem,
}
