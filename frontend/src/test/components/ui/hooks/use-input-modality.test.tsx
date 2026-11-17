import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'

import { useInputModality } from '@/components/ui/hooks/use-input-modality'

describe('useInputModality', () => {
  it('empieza en teclado por defecto o en el valor inicial', () => {
    expect(renderHook(() => useInputModality()).result.current.modality).toBe(
      'keyboard'
    )
    expect(
      renderHook(() => useInputModality('pointer')).result.current.modality
    ).toBe('pointer')
  })

  it('cambia con la última entrada', () => {
    const { result } = renderHook(() => useInputModality())

    act(() => result.current.onPointer())
    expect(result.current.modality).toBe('pointer')

    act(() => result.current.onKeyboard())
    expect(result.current.modality).toBe('keyboard')
  })
})
