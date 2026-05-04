import { useState } from 'react'
import { Button } from '../atoms/Button'
import { FormField } from '../molecules/FormField'
import { RememberRow } from '../molecules/RememberRow'
import { SocialLogin } from '../molecules/SocialLogin'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div>
        <h1 className="text-3xl font-bold text-[#e5e5e5] mb-2">Login</h1>
        <p className="text-[#9ca3af]">Boas-vindas! Faça seu login.</p>
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          id="email"
          label="Email ou usuário"
          type="text"
          placeholder="usuario123"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          id="password"
          label="Senha"
          type="password"
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <RememberRow
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
      </div>

      <Button variant="primary" type="submit">
        Login →
      </Button>

      <SocialLogin />

      <p className="text-center text-sm text-[#9ca3af]">
        Ainda não tem conta?{' '}
        <a href="#" className="text-[#22c55e] hover:underline font-medium">
          Crie seu cadastro! 📋
        </a>
      </p>
    </div>
  )
}
