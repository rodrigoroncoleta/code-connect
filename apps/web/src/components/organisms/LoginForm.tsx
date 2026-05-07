import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../atoms/Button'
import { FormField } from '../molecules/FormField'
import { RememberRow } from '../molecules/RememberRow'
import { SocialLogin } from '../molecules/SocialLogin'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await login(email, password)
      navigate('/feed')
    } catch {
      setError('Email ou senha inválidos.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-6 w-full max-w-sm" onSubmit={handleSubmit}>
      <div>
        <h1 className="text-3xl font-semibold text-offwhite mb-2">Login</h1>
        <p className="text-xl text-offwhite">Boas-vindas! Faça seu login.</p>
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

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando…' : 'Login →'}
      </Button>

      <SocialLogin />

      <p className="text-lg text-offwhite">
        Ainda não tem conta?{' '}
        <Link to="/register" className="text-accent hover:underline font-medium">
          Crie seu cadastro! →
        </Link>
      </p>
    </form>
  )
}
