import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/layout/separator'
import remarkGfm from 'remark-gfm'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/overlays/sheet'
import { useDocContent } from '@/hooks/use-doc-content'

interface MarkdownHelpSheetProps {
  docKey: string
  title?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function DocContent({ state }: { state: ReturnType<typeof useDocContent> }) {
  const { t } = useTranslation()

  if (state.status === 'error') {
    return <p className="text-sm text-live font-medium">{state.message}</p>
  }

  if (state.status === 'success') {
    return (
      <article
        className={cn(
          'prose dark:prose-invert max-w-none text-ink',

          'prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 text-ink',
          'prose-h2:mt-6 prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-2 text-ink',
          'prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2 text-ink',

          'prose-a:text-signal-contrast hover:prose-a:underline font-medium',
          'prose-code:bg-control/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-control prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none',
          'prose-pre:bg-control/40 prose-pre:border prose-pre:border-line prose-pre:p-3 prose-pre:rounded-control text-xs',

          'prose-table:block prose-table:overflow-x-auto prose-table:text-xs',
          'prose-th:bg-control/40 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:whitespace-nowrap prose-th:text-muted border-b border-line',
          'prose-td:px-3 prose-td:py-2 prose-td:whitespace-nowrap prose-td:border-b prose-td:border-line'
        )}
      >
        <Markdown remarkPlugins={[remarkGfm]}>{state.markdown}</Markdown>
      </article>
    )
  }

  return <p className="text-sm text-muted">{t('common.loading')}</p>
}

export function MarkdownHelpSheet({
  docKey,
  title,
  open = false,
  onOpenChange,
}: MarkdownHelpSheetProps) {
  const { t } = useTranslation()

  const docState = useDocContent(docKey, open)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="max-w-[600px] sm:max-w-[660px] flex flex-col h-full overflow-hidden *:data-[slot=sheet-close]:hidden"
      >
        <SheetHeader className="flex flex-row items-center justify-between gap-3">
          <SheetTitle className="text-md font-bold">
            {title ?? t('common.help')}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {t('help.panel_description')}
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <div className="flex-1 overflow-y-auto p-4">
          <DocContent state={docState} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
