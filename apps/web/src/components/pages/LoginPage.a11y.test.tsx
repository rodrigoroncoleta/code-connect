import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'
import { LoginPage } from './LoginPage'

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
}

describe('LoginPage — acessibilidade WCAG 2 AA', () => {
  it('não deve ter violações de acessibilidade', async () => {
    const { container } = renderWithRouter()
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
