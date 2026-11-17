export const COMMON_REGEX = {
  NO_SPACES: /^\S+$/,
  NO_LEADING_TRAILING_SPACES: /^\S.*\S$|^\S$/,
}

export const PASSWORD_REGEX = {
  MIN_LENGTH: /.{12,}/,
  LOWERCASE: /[a-z]/,
  UPPERCASE: /[A-Z]/,
  NUMBER: /[0-9]/,
  SPECIAL_CHAR: /[!@#$%^&*()\-_=+[\]{};'\\:"|<>?,./`~]/,
}

export const ORGANIZATION_REGEX = {
  NAME: /^[a-zA-Z0-9ÑñÁÉÍÓÚáéíóú ]+$/,
  SLUG: /^[a-zA-Z0-9-]+$/,
}
