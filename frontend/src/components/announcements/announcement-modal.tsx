'use client'

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/actions/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/overlays/dialog'
import type { ParseKeys } from 'i18next'
import { INFO_VERSIONS, type Version } from '@/lib/changelog-versions'

interface AnnouncementModalProps {
  version: Version
  open: boolean
  onOpenChange: (open: boolean) => void
  exploreHref?: string
  exploreLabelKey?: ParseKeys<'translation'>
}

export function AnnouncementModal({
  version,
  open,
  onOpenChange,
  exploreHref,
  exploreLabelKey,
}: AnnouncementModalProps) {
  const { t } = useTranslation()
  const info = INFO_VERSIONS[version]
  const storageKey = `reach_feature_${version}_seen`

  useEffect(() => {
    if (open) {
      localStorage.setItem(storageKey, 'true')
    }
  }, [open, storageKey])

  if (!info) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t(info.title)}</DialogTitle>
          <DialogDescription className="text-base">
            {t(info.description)}
          </DialogDescription>
        </DialogHeader>

        {info.items && (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-4 pr-2">
            <div className="grid gap-4">
              {info.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                >
                  <div className="p-2 rounded-md bg-primary/20 text-primary">
                    <item.Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{t(item.title)}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t(item.description)}
                    </p>
                    {item.features && (
                      <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                        {item.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span>{t(feature)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="shrink-0 flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('announcements.close')}
          </Button>
          {exploreHref && exploreLabelKey && (
            <Button onClick={() => onOpenChange(false)} asChild>
              <a href={exploreHref}>
                {t(exploreLabelKey)}
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)} asChild>
            <a
              href="/changelog"
              className="text-muted-foreground hover:text-foreground"
            >
              {t('announcements.view_changelog')}
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
