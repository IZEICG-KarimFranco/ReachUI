'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, List, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/actions/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/overlays/dialog'

const STORAGE_KEY = 'reach_feature_contacts_v1_seen'

interface ContactsLaunchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactsLaunchModal({
  open,
  onOpenChange,
}: ContactsLaunchModalProps) {
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
            {t('changelog.v120.description')}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t('contacts.launch_modal.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-md bg-primary/20 text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold">
                  {t('changelog.v120.features.contacts.title')}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('changelog.v120.features.contacts.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-md bg-primary/20 text-primary">
                <List className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold">
                  {t('changelog.v120.features.lists.title')}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('changelog.v120.features.lists.description')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-md bg-primary/20 text-primary">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold">
                  {t('changelog.v120.features.segments.title')}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('changelog.v120.features.segments.description')}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {t('changelog.v120.features.integration.description')}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('contacts.launch_modal.close')}
          </Button>
          <Button onClick={() => onOpenChange(false)} asChild>
            <a href="/contacts">
              {t('contacts.launch_modal.explore_contacts')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} asChild>
            <a
              href="/changelog"
              className="text-muted-foreground hover:text-foreground"
            >
              {t('contacts.launch_modal.view_changelog')}
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
