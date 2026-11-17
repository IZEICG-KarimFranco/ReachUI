'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  MessageSquareDashed,
  RefreshCcw,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/actions/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/overlays/dialog'

const STORAGE_KEY = 'reach_feature_templates_v1_seen'

interface TemplatesLaunchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TemplatesLaunchModal({
  open,
  onOpenChange,
}: TemplatesLaunchModalProps) {
  const { t } = useTranslation()

  useEffect(() => {
    if (open) {
      localStorage.setItem(STORAGE_KEY, 'true')
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t('changelog.v122.title')}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t('templates.launch_modal.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-md bg-primary/20 text-primary">
                <MessageSquareDashed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold">
                  {t('changelog.v122.features.templates.title')}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('changelog.v122.features.templates.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-md bg-primary/20 text-primary">
                <RefreshCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold">
                  {t('changelog.v122.features.twilioSync.title')}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('changelog.v122.features.twilioSync.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-md bg-primary/20 text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold">
                  {t('changelog.v122.features.campaignGuard.title')}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('changelog.v122.features.campaignGuard.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('templates.launch_modal.close')}
          </Button>
          <Button onClick={() => onOpenChange(false)} asChild>
            <a href="/templates">
              {t('templates.launch_modal.explore_templates')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} asChild>
            <a
              href="/changelog"
              className="text-muted-foreground hover:text-foreground"
            >
              {t('templates.launch_modal.view_changelog')}
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
