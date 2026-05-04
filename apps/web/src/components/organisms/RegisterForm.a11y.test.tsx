import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { RegisterForm } from './RegisterForm'

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <main>
        <RegisterForm />
      </main>
    </MemoryRouter>,
  )
}

describe('RegisterForm — acessibilidade WCAG 2 AA', () => {
  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
