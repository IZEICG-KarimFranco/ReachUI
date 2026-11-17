import * as React from 'react'
import { CheckIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import * as RPNInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/selection/command'
import { useFieldContext } from '@/components/ui/inputs/field'
import { Input } from '@/components/ui/inputs/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/overlays/popover'
import {
  getCountryLabels,
  getCountrySearchValue,
} from '@/components/ui/lib/phone-input'
import { cn } from '@/lib/utils'

type PhoneInputProps = Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value' | 'ref'
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void
  }

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<
    React.ComponentRef<typeof RPNInput.default>,
    PhoneInputProps
  >(({ className, onChange, value, disabled, readOnly, ...props }, ref) => {
    const { i18n } = useTranslation()
    const field = useFieldContext()

    return (
      <RPNInput.default
        ref={ref}
        className={cn('group/phone flex', className)}
        disabled={disabled ?? field?.disabled}
        readOnly={readOnly ?? field?.readOnly}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        labels={getCountryLabels(i18n.language)}
        smartCaret={false}
        international={true}
        withCountryCallingCode={true}
        defaultCountry="MX"
        value={value || undefined}
        // react-phone-number-input emite `undefined` mientras el número no es válido.
        onChange={(value) => onChange?.(value || ('' as RPNInput.Value))}
        {...props}
      />
    )
  })
PhoneInput.displayName = 'PhoneInput'

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => (
  <Input className={cn('rounded-s-none', className)} {...props} ref={ref} />
))
InputComponent.displayName = 'InputComponent'

type CountryEntry = { label: string; value: RPNInput.Country | undefined }

type CountrySelectProps = {
  disabled?: boolean
  readOnly?: boolean
  value: RPNInput.Country
  options: CountryEntry[]
  onChange: (country: RPNInput.Country) => void
}

const CountrySelect = ({
  disabled,
  readOnly,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)
  const selectedLabel = countryList.find(
    (option) => option.value === selectedCountry
  )?.label
  const locked = disabled || readOnly

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={locked}
          aria-label={
            selectedLabel
              ? `${t('common.country')}: ${selectedLabel}`
              : t('common.country')
          }
          data-slot="phone-input-country"
          className={cn(
            'group/trigger flex h-[42px] shrink-0 items-center gap-2 rounded-s-control border border-e-0 border-control bg-inset px-3 text-ink outline-none',
            'transition-[border-color,box-shadow,background-color] duration-150 ease-out',
            'hover:border-line-strong focus-ring-field focus:z-10',
            'group-has-[input[aria-invalid=true]]/phone:border-error',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-control'
          )}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedLabel ?? selectedCountry}
          />
          {!locked && (
            <span
              aria-hidden="true"
              className="text-xs text-muted transition-transform duration-150 group-data-[state=open]/trigger:rotate-180"
            >
              ▾
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-72 overflow-hidden p-0"
      >
        <Command>
          <CommandInput placeholder={t('common.search_placeholder')} />
          <CommandList>
            <CommandEmpty>{t('common.no_results')}</CommandEmpty>
            <CommandGroup>
              {countryList.map(({ value, label }) =>
                value ? (
                  <CountrySelectOption
                    key={value}
                    country={value}
                    countryName={label}
                    selected={value === selectedCountry}
                    onSelect={() => {
                      onChange(value)
                      setIsOpen(false)
                    }}
                  />
                ) : null
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selected: boolean
  onSelect: () => void
}

const CountrySelectOption = ({
  country,
  countryName,
  selected,
  onSelect,
}: CountrySelectOptionProps) => (
  <CommandItem
    value={getCountrySearchValue(country, countryName)}
    onSelect={onSelect}
    data-checked={selected || undefined}
  >
    <FlagComponent country={country} countryName={countryName} />
    <span className="min-w-0 flex-1 truncate">{countryName}</span>
    <span className="text-xs text-muted tabular-nums">
      {`+${RPNInput.getCountryCallingCode(country)}`}
    </span>
    <CheckIcon
      aria-hidden="true"
      className={cn(
        'size-4 text-signal-contrast',
        selected ? 'opacity-100' : 'opacity-0'
      )}
    />
  </CommandItem>
)

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="flex h-4 w-6 shrink-0 overflow-hidden rounded-[2px] bg-line [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}

export { PhoneInput }
