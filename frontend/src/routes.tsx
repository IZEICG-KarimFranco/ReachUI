import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

import { MOCK_PAGES } from '@/pages/dev/mock/mock-pages'

type PageModule = { default: ComponentType }

interface MockRoute {
  path: string
  Component: LazyExoticComponent<ComponentType>
  nest: boolean
}

export const MOCK_INDEX_PATH = '/dev/mock'

const NESTED_PATHS: readonly string[] = ['/dev/mock/app-shell']

const pageModules = import.meta.glob<PageModule>('./pages/dev/mock/*.tsx')

function toRoute(path: string, slug: string): MockRoute {
  const loader = pageModules[`./pages/dev/mock/${slug}.tsx`]
  if (!loader) throw new Error(`Mock page not found for ${path}`)
  return { path, Component: lazy(loader), nest: NESTED_PATHS.includes(path) }
}

export const MOCK_ROUTES: readonly MockRoute[] = [
  toRoute(MOCK_INDEX_PATH, 'index'),
  ...MOCK_PAGES.map(({ path }) =>
    toRoute(path, path.slice(MOCK_INDEX_PATH.length + 1))
  ),
]
