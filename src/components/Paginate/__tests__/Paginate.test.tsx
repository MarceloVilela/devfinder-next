import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import Paginate from '../index'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

const mockedUseRouter = useRouter as jest.Mock
const mockedUsePathname = usePathname as jest.Mock
const mockedUseSearchParams = useSearchParams as jest.Mock

describe('Paginate', () => {
  const push = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseRouter.mockReturnValue({ push })
    mockedUsePathname.mockReturnValue('/user')
    mockedUseSearchParams.mockReturnValue(new URLSearchParams())
    window.scrollTo = jest.fn()
  })

  it('navega via URL (?page=N) quando handlePaginate não é passado', () => {
    render(<Paginate page={1} totalItems={100} itemsPerPage={30} />)

    fireEvent.click(screen.getByText('2'))

    expect(push).toHaveBeenCalledWith('/user?page=2')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('preserva outros query params já presentes na URL ao paginar', () => {
    mockedUseSearchParams.mockReturnValue(new URLSearchParams('tab=liked'))
    render(<Paginate page={1} totalItems={100} itemsPerPage={30} />)

    fireEvent.click(screen.getByText('2'))

    expect(push).toHaveBeenCalledWith('/user?tab=liked&page=2')
  })

  it('usa o callback local em vez de navegar quando handlePaginate é passado', () => {
    const handlePaginate = jest.fn()
    render(
      <Paginate page={1} totalItems={100} itemsPerPage={30} handlePaginate={handlePaginate} />
    )

    fireEvent.click(screen.getByText('2'))

    expect(handlePaginate).toHaveBeenCalledWith(2)
    expect(push).not.toHaveBeenCalled()
  })

  it('esconde a seta "início" na primeira página', () => {
    const { container } = render(<Paginate page={1} totalItems={150} itemsPerPage={30} />)

    expect(container.querySelector('.begin')).not.toBeInTheDocument()
    expect(container.querySelector('.end')).toBeInTheDocument()
  })

  it('esconde a seta "fim" na última página', () => {
    const { container } = render(<Paginate page={5} totalItems={150} itemsPerPage={30} />)

    expect(container.querySelector('.end')).not.toBeInTheDocument()
    expect(container.querySelector('.begin')).toBeInTheDocument()
  })
})
