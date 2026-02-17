import {
  Autocomplete,
  Avatar,
  Box,
  CircularProgress,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material'
import React, { memo, useMemo } from 'react'

import { useGetViewerFollowingQuery } from '@/generated/graphql'

/**
 * A GitHub user from the authenticated viewer's following list.
 * @example
 * const user: FollowingUser = { login: 'octocat', name: 'The Octocat', avatarUrl: 'https://...' }
 */
export interface FollowingUser {
  /** GitHub username (unique identifier) */
  login: string
  /** Display name (may be null/undefined if user hasn't set one) */
  name?: string | null
  /** Avatar image URL from GitHub CDN */
  avatarUrl: string
}

export interface UserAutocompleteProps {
  /** Current selected/typed username */
  value: string
  /** Callback when selection changes — receives the login string */
  onChange: (value: string) => void
  /** Whether to show error styling */
  error?: boolean
  /** Helper text for validation feedback */
  helperText?: string
}

/**
 * Filters following users by matching input against both name and login (case-insensitive).
 * @param options - Array of FollowingUser to filter
 * @param inputValue - The text the user typed
 * @returns Filtered array of matching users
 * @example
 * filterFollowingUsers([{ login: 'octocat', name: 'The Octocat', avatarUrl: '...' }], 'octo')
 * // => [{ login: 'octocat', name: 'The Octocat', avatarUrl: '...' }]
 */
export function filterFollowingUsers(
  options: FollowingUser[],
  inputValue: string,
): FollowingUser[] {
  if (!inputValue) return options
  const lower = inputValue.toLowerCase()
  return options.filter(
    (option) =>
      option.login.toLowerCase().includes(lower) ||
      (option.name?.toLowerCase().includes(lower) ?? false),
  )
}

/**
 * Autocomplete dropdown showing GitHub users the authenticated user follows.
 * Supports freeSolo mode for entering usernames not in the following list.
 * Integrates with react-hook-form via value/onChange props.
 */
const UserAutocomplete: React.FC<UserAutocompleteProps> = memo(
  ({ value, onChange, error, helperText }) => {
    const { data, isLoading } = useGetViewerFollowingQuery()

    const options: FollowingUser[] = useMemo(() => {
      const nodes = data?.viewer?.following?.nodes
      if (!nodes) return []
      return nodes.filter(
        (node): node is NonNullable<typeof node> => node !== null,
      )
    }, [data])

    return (
      <Autocomplete<FollowingUser, false, false, true>
        freeSolo
        options={options}
        loading={isLoading}
        value={options.find((o) => o.login === value) ?? (value || null)}
        onChange={(_event, newValue) => {
          if (typeof newValue === 'string') {
            onChange(newValue)
          } else if (newValue) {
            onChange(newValue.login)
          } else {
            onChange('')
          }
        }}
        onInputChange={(_event, newInputValue, reason) => {
          if (reason === 'input') {
            onChange(newInputValue)
          }
        }}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.login
        }
        filterOptions={(opts, state) =>
          filterFollowingUsers(opts, state.inputValue)
        }
        isOptionEqualToValue={(option, val) => {
          if (typeof val === 'string') return option.login === val
          return option.login === val.login
        }}
        noOptionsText="No suggestions available"
        loadingText="Loading..."
        renderOption={({ key, ...props }, option) => (
          <Box
            component="li"
            key={key}
            {...props}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              minHeight: 44,
              px: 1.5,
            }}
          >
            <Avatar
              src={option.avatarUrl}
              alt={`${option.login}'s avatar`}
              sx={{ width: 32, height: 32 }}
            />
            <Box>
              <Typography variant="body2">
                {option.name ?? option.login}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                @{option.login}
              </Typography>
            </Box>
          </Box>
        )}
        renderInput={({ InputProps, inputProps, ...params }) => (
          <TextField
            {...params}
            variant="standard"
            error={error}
            helperText={helperText}
            aria-label="GitHub username"
            slotProps={{
              input: {
                ...InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">@</InputAdornment>
                    {InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <>
                    {isLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {InputProps.endAdornment}
                  </>
                ),
              },
              htmlInput: inputProps,
            }}
          />
        )}
      />
    )
  },
)

UserAutocomplete.displayName = 'UserAutocomplete'

export default UserAutocomplete
