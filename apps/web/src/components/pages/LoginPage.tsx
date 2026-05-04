import { AuthBanner } from '../organisms/AuthBanner'
import { LoginForm } from '../organisms/LoginForm'
import { AuthTemplate } from '../templates/AuthTemplate'

export function LoginPage() {
  return (
    <AuthTemplate banner={<AuthBanner src="/banner.png" alt="Banner code connect" />}>
      <LoginForm />
    </AuthTemplate>
  )
}
