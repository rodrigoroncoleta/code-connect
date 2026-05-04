import { AuthBanner } from '../organisms/AuthBanner'
import { RegisterForm } from '../organisms/RegisterForm'
import { AuthTemplate } from '../templates/AuthTemplate'

export function RegisterPage() {
  return (
    <AuthTemplate banner={<AuthBanner src="/banner.png" alt="Banner code connect" />}>
      <RegisterForm />
    </AuthTemplate>
  )
}
