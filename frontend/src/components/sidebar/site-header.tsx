import { Separator } from '@/components/ui/layout/separator'
import { SidebarTrigger } from '@/components/ui/layout/sidebar'
import { ModeToggle } from '@/components/theme/mode-toggle'
import { useTranslation } from 'react-i18next'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/navigation/breadcrumb'
import { pages } from '@/lib/app'

export function SiteHeader() {
  const { t } = useTranslation()
  return (
    <header className="flex h-(--header-height) mt-2 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-sidebar/60 rounded-2xl">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  {
                    pages(t).campaigns.find(
                      (item) => item.url === window.location.pathname
                    )?.title
                  }
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
