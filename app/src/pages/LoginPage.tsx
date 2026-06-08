import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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
import { LogIn } from 'lucide-react'

const schema = z.object({
  email: z.string().min(1, 'errors.required').email('errors.invalidEmail'),
  password: z.string().min(1, 'errors.required'),
})

type FormData = z.infer<typeof schema>

export function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'

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
        await login(data)
        toast.success(t('auth.loginSuccess'))
        void navigate(from, { replace: true })
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
            <CardTitle>{t('auth.loginTitle')}</CardTitle>
            <CardDescription>{t('auth.loginDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="flex flex-col gap-4">
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
                  autoComplete="current-password"
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t('auth.loggingIn')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="size-4" />
                    {t('auth.login')}
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">
                {t('auth.register')}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  )
}
