import { InfoButton } from '@/components/ui/actions/info-button'
import { useMarkdownHelperStore } from '@/features/help/store/markdown-store'

interface DocHelpButtonProps {
  docKey: string
  title?: string
  label: string
}

export function DocHelpButton({ docKey, title, label }: DocHelpButtonProps) {
  const showHelper = useMarkdownHelperStore((s) => s.showHelper)

  return (
    <InfoButton label={label} onClick={() => showHelper({ docKey, title })} />
  )
}
