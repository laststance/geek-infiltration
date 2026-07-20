import { ThemeProvider, createTheme } from '@mui/material'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import UserAutocomplete from './UserAutocomplete'

// Mock the RTK Query hook
const mockUseGetViewerFollowingQuery = vi.fn()
vi.mock('@/generated/graphql', () => ({
  useGetViewerFollowingQuery: (...args: unknown[]) =>
    mockUseGetViewerFollowingQuery(...args),
}))

const theme = createTheme()

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

const mockFollowingData = {
  viewer: {
    following: {
      totalCount: 3,
      nodes: [
        {
          login: 'octocat',
          name: 'The Octocat',
          avatarUrl: 'https://example.com/octocat.png',
        },
        {
          login: 'torvalds',
          name: 'Linus Torvalds',
          avatarUrl: 'https://example.com/torvalds.png',
        },
        {
          login: 'gaearon',
          name: null,
          avatarUrl: 'https://example.com/gaearon.png',
        },
      ],
    },
  },
}

describe('UserAutocomplete', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loading state', () => {
    it('renders loading indicator when data is being fetched', () => {
      mockUseGetViewerFollowingQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
      })

      renderWithTheme(<UserAutocomplete value="" onChange={mockOnChange} />)

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('does not render loading indicator when data is loaded', () => {
      mockUseGetViewerFollowingQuery.mockReturnValue({
        data: mockFollowingData,
        isLoading: false,
      })

      renderWithTheme(<UserAutocomplete value="" onChange={mockOnChange} />)

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  })

  describe('rendering', () => {
    it('renders input with @ prefix and aria-label', () => {
      mockUseGetViewerFollowingQuery.mockReturnValue({
        data: mockFollowingData,
        isLoading: false,
      })

      renderWithTheme(<UserAutocomplete value="" onChange={mockOnChange} />)

      const input = screen.getByLabelText('GitHub username')
      expect(input).toBeInTheDocument()
      expect(screen.getByText('@')).toBeInTheDocument()
    })

    it('renders the GitHub username textbox with the 1Password opt-out attribute', () => {
      // Arrange
      mockUseGetViewerFollowingQuery.mockReturnValue({
        data: mockFollowingData,
        isLoading: false,
      })

      // Act
      renderWithTheme(<UserAutocomplete value="" onChange={mockOnChange} />)

      // Assert
      expect(screen.getByLabelText('GitHub username')).toHaveAttribute(
        'data-1p-ignore',
        'true',
      )
    })

    it('shows suggestions when input is focused', async () => {
      mockUseGetViewerFollowingQuery.mockReturnValue({
        data: mockFollowingData,
        isLoading: false,
      })

      renderWithTheme(<UserAutocomplete value="" onChange={mockOnChange} />)

      const input = screen.getByLabelText('GitHub username')
      await userEvent.click(input)

      // Suggestions should appear
      const listbox = screen.getByRole('listbox')
      expect(listbox).toBeInTheDocument()

      // All 3 users should be listed
      const options = within(listbox).getAllByRole('option')
      expect(options).toHaveLength(3)
    })

    it('displays avatar, name, and @login for each suggestion', async () => {
      mockUseGetViewerFollowingQuery.mockReturnValue({
        data: mockFollowingData,
        isLoading: false,
      })

      renderWithTheme(<UserAutocomplete value="" onChange={mockOnChange} />)

      await userEvent.click(screen.getByLabelText('GitHub username'))

      // Check first option has display name and @login
      expect(screen.getByText('The Octocat')).toBeInTheDocument()
      expect(screen.getByText('@octocat')).toBeInTheDocument()

      // Check user with null name falls back to login
      expect(screen.getByText('@gaearon')).toBeInTheDocument()
    })
  })

  describe('onChange callback', () => {
    it('calls onChange with login when selecting a suggestion', async () => {
      mockUseGetViewerFollowingQuery.mockReturnValue({
        data: mockFollowingData,
        isLoading: false,
      })

      renderWithTheme(<UserAutocomplete value="" onChange={mockOnChange} />)

      const input = screen.getByLabelText('GitHub username')
      await userEvent.click(input)

      // Click on "The Octocat" option
      const option = screen.getByText('The Octocat')
      await userEvent.click(option)

      // Should call onChange with the login, not the display name
      expect(mockOnChange).toHaveBeenCalledWith('octocat')
    })

    it('calls onChange with typed value in freeSolo mode', async () => {
      mockUseGetViewerFollowingQuery.mockReturnValue({
        data: mockFollowingData,
        isLoading: false,
      })

      renderWithTheme(<UserAutocomplete value="" onChange={mockOnChange} />)

      const input = screen.getByLabelText('GitHub username')
      await userEvent.type(input, 'customuser')

      // freeSolo should pass each keystroke through onChange
      expect(mockOnChange).toHaveBeenCalledWith('c')
      expect(mockOnChange).toHaveBeenLastCalledWith('customuser')
    })
  })

  describe('empty following list', () => {
    it('shows no option items when following list is empty', async () => {
      mockUseGetViewerFollowingQuery.mockReturnValue({
        data: { viewer: { following: { totalCount: 0, nodes: [] } } },
        isLoading: false,
      })

      renderWithTheme(<UserAutocomplete value="" onChange={mockOnChange} />)

      const input = screen.getByLabelText('GitHub username')
      await userEvent.click(input)

      // In freeSolo mode with no options, the listbox should not appear
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  describe('error state', () => {
    it('renders error styling and helper text when error prop is true', () => {
      mockUseGetViewerFollowingQuery.mockReturnValue({
        data: mockFollowingData,
        isLoading: false,
      })

      renderWithTheme(
        <UserAutocomplete
          value=""
          onChange={mockOnChange}
          error={true}
          helperText="required"
        />,
      )

      expect(screen.getByText('required')).toBeInTheDocument()
    })
  })

  describe('filtering', () => {
    it('filters suggestions as user types', async () => {
      mockUseGetViewerFollowingQuery.mockReturnValue({
        data: mockFollowingData,
        isLoading: false,
      })

      renderWithTheme(<UserAutocomplete value="" onChange={mockOnChange} />)

      const input = screen.getByLabelText('GitHub username')
      await userEvent.type(input, 'octo')

      const listbox = screen.getByRole('listbox')
      const options = within(listbox).getAllByRole('option')
      expect(options).toHaveLength(1)
      expect(screen.getByText('@octocat')).toBeInTheDocument()
    })

    it('filters by name as well as login', async () => {
      mockUseGetViewerFollowingQuery.mockReturnValue({
        data: mockFollowingData,
        isLoading: false,
      })

      renderWithTheme(<UserAutocomplete value="" onChange={mockOnChange} />)

      const input = screen.getByLabelText('GitHub username')
      await userEvent.type(input, 'linus')

      const listbox = screen.getByRole('listbox')
      const options = within(listbox).getAllByRole('option')
      expect(options).toHaveLength(1)
      expect(screen.getByText('@torvalds')).toBeInTheDocument()
    })
  })
})
