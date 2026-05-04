import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Checkbox } from './Checkbox'

describe('Checkbox — acessibilidade WCAG 2 AA', () => {
  it('com label não deve ter violações', async () => {
    const { container } = render(
      <main>
        <Checkbox id="terms" label="Aceito os termos de uso" checked={false} onChange={() => {}} />
      </main>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
