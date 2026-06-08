import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { PageTransition } from '@/components/layout/PageTransition'
import { UserPlus } from 'lucide-react'

const schema = z.object({
  name: z.string().min(1, 'errors.required'),
  email: z.string().min(1, 'errors.required').email('errors.invalidEmail'),
  password: z.string().min(6, 'auth.passwordTooShort'),
  confirmPassword: z.string().min(1, 'errors.required'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'auth.passwordsDontMatch',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export function RegisterPage() {
  const { t } = useTranslation()
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true)

    const submit = async () => {
      try {
        await registerUser({ name: data.name, email: data.email, password: data.password })
        toast.success(t('auth.registerSuccess'))
        void navigate('/', { replace: true })
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t('errors.generic'))
      } finally {
        setIsSubmitting(false)
      }
    }

    void submit()
  }

  return (
    <PageTransition>
      <div className="mx-auto mt-12 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>{t('auth.registerTitle')}</CardTitle>
            <CardDescription>{t('auth.registerDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="flex flex-col gap-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  {t('auth.name')}
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('auth.namePlaceholder')}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  {...register('name')}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-destructive">
                    {t(errors.name.message as string)}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  {t('auth.email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email')}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-destructive">
                    {t(errors.email.message as string)}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium">
                  {t('auth.password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                />
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-destructive">
                    {t(errors.password.message as string)}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                  {t('auth.confirmPassword')}
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="mt-1 text-sm text-destructive">
                    {t(errors.confirmPassword.message as string)}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t('auth.registering')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="size-4" />
                    {t('auth.register')}
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                {t('auth.login')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  )
}
