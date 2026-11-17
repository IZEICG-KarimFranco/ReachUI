import { useMemo } from 'react'
import { COMMON_REGEX, PASSWORD_REGEX } from '@/lib/regex'

export interface PasswordEvaluation {
  hasMinLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSymbol: boolean
  hasNoSpaces: boolean
  score: number // 0 a 5
  level: 'empty' | 'weak' | 'medium' | 'strong' | 'veryStrong'
  missingCriteria: string[]
}

export function usePasswordStrength(password: string = ''): PasswordEvaluation {
  return useMemo(() => {
    if (!password) {
      return {
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSymbol: false,
        hasNoSpaces: true,
        score: 0,
        level: 'empty',
        missingCriteria: [],
      }
    }

    const hasMinLength = PASSWORD_REGEX.MIN_LENGTH.test(password)
    const hasUppercase = PASSWORD_REGEX.UPPERCASE.test(password)
    const hasLowercase = PASSWORD_REGEX.LOWERCASE.test(password)
    const hasNumber = PASSWORD_REGEX.NUMBER.test(password)
    const hasSymbol = PASSWORD_REGEX.SPECIAL_CHAR.test(password)
    const hasNoSpaces = COMMON_REGEX.NO_SPACES.test(password)

    // Solo los 5 criterios base suman puntaje (la regla sin espacios es mandatoria pero no suma)
    const criteriaMet = [
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSymbol,
    ].filter(Boolean).length

    let level: PasswordEvaluation['level'] = 'weak'
    if (criteriaMet >= 5) level = 'veryStrong'
    else if (criteriaMet === 4) level = 'strong'
    else if (criteriaMet === 3) level = 'medium'
    else level = 'weak'

    const missingCriteria: string[] = []
    if (!hasMinLength) missingCriteria.push('12_chars')
    if (!hasUppercase) missingCriteria.push('uppercase')
    if (!hasLowercase) missingCriteria.push('lowercase')
    if (!hasNumber) missingCriteria.push('number')
    if (!hasSymbol) missingCriteria.push('symbol')

    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSymbol,
      hasNoSpaces,
      score: criteriaMet,
      level,
      missingCriteria,
    }
  }, [password])
}
