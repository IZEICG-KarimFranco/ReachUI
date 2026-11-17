import { useTranslation } from 'react-i18next'
import { Link } from 'wouter'

export default function Logo({
  size = 'large',
  withText = true,
  isLink = true,
}: {
  size?: 'small' | 'large' | number
  withText?: boolean
  isLink?: boolean
}) {
  const { t } = useTranslation()

  let sizeNumber =
    {
      small: 10,
      large: 16,
    }[size] || 16

  if (typeof size === 'number') {
    sizeNumber = size
    if (size > 16) {
      sizeNumber = 16
    }
    if (size < 5) {
      sizeNumber = 5
    }
  }

  const config = {
    height: `${sizeNumber * 4}px`,
    fontSize: `${sizeNumber * 3.4}px`,
    leading: `${sizeNumber * 2.6}px`,
    marginLeft: `${sizeNumber * 1.4}px`,
  }

  const LinkWrapper = isLink ? Link : 'div'

  return (
    <LinkWrapper
      href={isLink ? '/' : '#'}
      className="flex gap-2 items-end relative select-none"
      style={{ height: config.height, marginLeft: config.marginLeft }}
    >
      <img
        src="/icon.svg"
        alt={t('name')}
        className="absolute top-0 left-0 h-full animate-swing-drop-in -translate-x-1/3"
      />
      {withText && (
        <h1
          className="font-bold animate-fade-in-up"
          style={{
            fontSize: config.fontSize,
            lineHeight: config.leading,
          }}
        >
          {t('name')}
        </h1>
      )}
    </LinkWrapper>
  )
}
