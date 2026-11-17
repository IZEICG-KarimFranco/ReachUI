import { useCallback, useState } from 'react'

type InputModality = 'keyboard' | 'pointer'

/**
 * Last input type inside a composite widget. Radix focuses menu items on pointer
 * hover and Chrome marks them `:focus-visible`; this lets the focus halo render
 * only during keyboard navigation.
 */
function useInputModality(initial: InputModality = 'keyboard') {
  const [modality, setModality] = useState<InputModality>(initial)
  const onPointer = useCallback(() => setModality('pointer'), [])
  const onKeyboard = useCallback(() => setModality('keyboard'), [])

  return { modality, onPointer, onKeyboard }
}

export { useInputModality }
export type { InputModality }
