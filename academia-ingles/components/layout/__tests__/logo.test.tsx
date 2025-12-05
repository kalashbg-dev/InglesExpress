import { render, screen } from '@testing-library/react'
import { Logo } from '../logo'

describe('Logo', () => {
  it('renders the logo text', () => {
    render(<Logo />)
    expect(screen.getByText('ACADEMIA')).toBeInTheDocument()
    expect(screen.getByText('INGLÉS')).toBeInTheDocument()
  })

  it('renders a link to home', () => {
    render(<Logo />)
    const link = screen.getByRole('link', { name: /academia de inglés - inicio/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })
})
