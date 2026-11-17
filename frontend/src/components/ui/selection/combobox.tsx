'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Minus, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/actions/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/selection/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/overlays/popover'
import { CommandSeparator } from 'cmdk'
import { Spinner } from '@/components/ui/feedback/spinner'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps<T extends ComboboxOption = ComboboxOption> {
  options: T[]
  allOptions?: T[]
  value?: string
  onChange: (value: string) => void
  renderOption?: (option: T) => React.ReactNode
  renderValue?: (option: T) => React.ReactNode
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  showMoreText?: string
  showLessText?: string
  className?: string
  disabled?: boolean
  modal?: boolean
  withButton?: boolean
  limit?: number
  /**
   * When true, cmdk filters options client-side (default).
   * Set to false for async/server-side search where the parent
   * controls the options via `onSearchChange`.
   */
  shouldFilter?: boolean
  /**
   * Called whenever the search input value changes.
   * Use this to trigger server-side searches.
   */
  onSearchChange?: (value: string) => void
  /**
   * Show a loading spinner in the search input area.
   */
  isLoading?: boolean
}

export function Combobox<T extends ComboboxOption = ComboboxOption>({
  options,
  allOptions,
  value,
  onChange,
  renderOption,
  renderValue,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No result found.',
  showMoreText = 'Show more',
  showLessText = 'Show less',
  className,
  disabled = false,
  modal = false,
  limit,
  shouldFilter,
  onSearchChange,
  isLoading = false,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState('')
  const [showAll, setShowAll] = React.useState(false)

  const itemsToRender =
    allOptions && allOptions.length > 0 ? allOptions : options

  const selectedOption = React.useMemo(() => {
    if (!value) return undefined
    return (
      options.find((o) => o.value === value) ??
      allOptions?.find((o) => o.value === value)
    )
  }, [value, options, allOptions])

  const hasMoreItems = limit && itemsToRender.length > limit
  const isSearching = searchValue.length > 0
  const shouldLimit = limit && limit > 0 && !showAll && !isSearching
  const effectiveLimit = shouldLimit ? limit : itemsToRender.length

  const handleSearchChange = React.useCallback(
    (next: string) => {
      setSearchValue(next)
      onSearchChange?.(next)
    },
    [onSearchChange]
  )

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between min-w-0', className)}
          disabled={disabled}
        >
          {value
            ? renderValue
              ? selectedOption
                ? renderValue(selectedOption)
                : placeholder
              : (selectedOption?.label ?? placeholder)
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) max-w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command shouldFilter={shouldFilter}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={handleSearchChange}
          />
          <CommandList className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Spinner className="size-4 text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup className="min-w-max">
                  {itemsToRender.map((option, index) => (
                    <CommandItem
                      key={option.value}
                      value={`${option.label} ${option.value}`}
                      disabled={option.disabled}
                      onSelect={() => {
                        if (option.disabled) return
                        onChange(option.value === value ? '' : option.value)
                        setOpen(false)
                      }}
                      className={cn(
                        'min-w-max',
                        option.disabled &&
                          'opacity-50 cursor-not-allowed pointer-events-none',
                        shouldLimit && index >= effectiveLimit && 'hidden'
                      )}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4 shrink-0',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {renderOption ? (
                        <div className="flex-1 flex items-center min-w-max">
                          {renderOption(option)}
                        </div>
                      ) : (
                        <span className="flex-1 whitespace-nowrap text-left pr-2">
                          {option.label}
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
          {hasMoreItems && !isSearching && !isLoading && (
            <>
              <div className="border-t p-1 bg-popover"></div>
              <CommandSeparator />
              <CommandGroup>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="w-full"
                >
                  {showAll ? <Minus /> : <Plus />}
                  {showAll ? showLessText : showMoreText}
                </Button>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
