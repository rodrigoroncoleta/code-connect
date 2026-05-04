import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { FormField } from './FormField'

describe('FormField — acessibilidade WCAG 2 AA', () => {
  it('input de texto com label não deve ter violações', async () => {
    const { container } = render(
      <main>
        <form>
          <FormField id="email" label="Email" type="email" placeholder="usuario@exemplo.com" />
        </form>
      </main>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('input de senha com label não deve ter violações', async () => {
    const { container } = render(
      <main>
        <form>
          <FormField id="password" label="Senha" type="password" placeholder="••••••" />
        </form>
      </main>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
