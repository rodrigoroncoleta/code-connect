import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Button } from './Button'

describe('Button — acessibilidade WCAG 2 AA', () => {
  it('variante primary não deve ter violações', async () => {
    const { container } = render(
      <main>
        <Button variant="primary">Entrar</Button>
      </main>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('variante ghost não deve ter violações', async () => {
    const { container } = render(
      <main>
        <Button variant="ghost">Cancelar</Button>
      </main>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
