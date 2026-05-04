import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { RegisterPage } from './RegisterPage'

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  )
}

describe('RegisterPage — acessibilidade WCAG 2 AA', () => {
  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
