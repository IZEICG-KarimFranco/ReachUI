import { MarkdownHelpSheet } from '@/components/help/markdown-help-sheet'
import { useMarkdownHelperStore } from '@/features/help/store/markdown-store'

export function GlobalMarkdownHelper() {
  const isVisible = useMarkdownHelperStore((state) => state.isVisible)
  const config = useMarkdownHelperStore((state) => state.config)
  const hideHelper = useMarkdownHelperStore((state) => state.hideHelper)

  if (!isVisible || !config) {
    return null
  }

  return (
    <MarkdownHelpSheet
      docKey={config.docKey}
      title={config.title}
      open={isVisible}
      onOpenChange={(open) => {
        if (!open) {
          hideHelper()
        }
      }}
    />
  )
}
