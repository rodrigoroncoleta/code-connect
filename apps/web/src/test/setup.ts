import '@testing-library/jest-dom'
import { configureAxe, toHaveNoViolations } from 'jest-axe'
import { expect } from 'vitest'

// Registra o matcher toHaveNoViolations no expect do Vitest
expect.extend(toHaveNoViolations)

// Configura axe globalmente para WCAG 2 nível AA
configureAxe({
  rules: {},
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  },
})
