import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../atoms/Button'
import { Checkbox } from '../atoms/Checkbox'
import { FormField } from '../molecules/FormField'
import { SocialLogin } from '../molecules/SocialLogin'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div>
        <h1 className="text-3xl font-semibold text-offwhite mb-2">Cadastro</h1>
        <p className="text-xl text-offwhite">Olá! Preencha seus dados.</p>
      </div>

      <div className="flex flex-col gap-4">
        <FormField
          id="name"
          label="Nome"
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="Digite seu email"
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
        <Checkbox
          id="remember"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          label="Lembrar-me"
        />
      </div>

      <Button variant="primary" type="submit">
        Cadastrar →
      </Button>

      <SocialLogin />

      <p className="text-lg text-offwhite">
        Já tem conta?{' '}
        <Link to="/" className="text-accent hover:underline font-medium">
          Faça seu login! →
        </Link>
      </p>
    </div>
  )
}
