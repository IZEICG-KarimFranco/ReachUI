'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/actions/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/overlays/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/inputs/field'
import { Input } from '@/components/ui/inputs/input'
import { useAuthStore } from '@/features/auth/store/auth'
import { useAgentStore } from '@/features/inbox/store/agent'
import {
  createSignUpStep3Schema,
  type SignUpStep3Data,
} from '@/lib/schemas/auth'
import { createOrganizationWithOwner } from '@/services/organization'
import { Slug } from '@/components/shared/slug'
import { Spinner } from '@/components/ui/feedback/spinner'
import { Plus } from 'lucide-react'

type DialogCreateOrganizationProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode | null
}

export function DialogCreateOrganization({
  open,
  onOpenChange,
  trigger,
}: DialogCreateOrganizationProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const { user, setCurrentOrganization } = useAuthStore()

  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined
  const dialogOpen = isControlled ? Boolean(open) : internalOpen

  const form = useForm<SignUpStep3Data>({
    resolver: zodResolver(createSignUpStep3Schema(t)),
    defaultValues: {
      organization_name: '',
      organization_slug: '',
    },
  })

  const handleDialogStateChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    if (!nextOpen) {
      form.reset()
      setIsLoading(false)
    }
    onOpenChange?.(nextOpen)
  }

  useEffect(() => {
    if (!dialogOpen) {
      form.reset()
      setIsLoading(false)
    }
  }, [dialogOpen, form])

  const handleSubmit = async (data: SignUpStep3Data) => {
    if (!user?.id) {
      toast.error(t('auth.sign_in.error.no_user'))
      return
    }

    setIsLoading(true)
    let organizationId: string
    try {
      const organization = await createOrganizationWithOwner(
        data.organization_name,
        data.organization_slug
      )
      organizationId = organization.id
    } catch {
      toast.error(t('no_organization.create.error'))
      setIsLoading(false)
      return
    }

    toast.success(t('no_organization.create.success'))

    useAgentStore.getState().reset()
    await setCurrentOrganization(organizationId).catch(() => undefined)
    window.location.assign('/configuration#organization')
  }

  return (
    <FormProvider {...form}>
      <Dialog open={dialogOpen} onOpenChange={handleDialogStateChange}>
        {trigger !== null && (
          <DialogTrigger asChild>
            {trigger ?? (
              <Button variant="outline">
                <Plus className="size-4" />
                {t('configuration.organization.create')}
              </Button>
            )}
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-sm">
          <form
            className="flex flex-col gap-6 max-w-sm w-full"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <DialogHeader>
              <DialogTitle>
                {t('configuration.organization.create')}
              </DialogTitle>
              <DialogDescription>
                {t('configuration.organization.create_description')}
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Controller
                name="organization_name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="organization_name">
                      {t('auth.sign_up.organization_name')}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="organization_name"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder={t(
                        'auth.sign_up.organization_name_placeholder'
                      )}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="organization_slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex-1 sm:min-w-64"
                  >
                    <FieldLabel htmlFor="slug">
                      {t('auth.sign_up.slug')}
                    </FieldLabel>
                    <Slug {...field} sourceFieldName="organization_name" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isLoading}>
                  {t('common.cancel')}
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('common.creating') : t('common.create')}
                {isLoading && <Spinner />}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
