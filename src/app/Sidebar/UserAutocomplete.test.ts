import { describe, it, expect } from 'vitest'

import { filterFollowingUsers, type FollowingUser } from './UserAutocomplete'

const mockUsers: FollowingUser[] = [
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
    name: 'Dan Abramov',
    avatarUrl: 'https://example.com/gaearon.png',
  },
  {
    login: 'nullname',
    name: null,
    avatarUrl: 'https://example.com/nullname.png',
  },
]

describe('filterFollowingUsers', () => {
  it('returns all users when input is empty', () => {
    const result = filterFollowingUsers(mockUsers, '')
    expect(result).toHaveLength(4)
  })

  it('filters by login substring (case-insensitive)', () => {
    const result = filterFollowingUsers(mockUsers, 'octo')
    expect(result).toHaveLength(1)
    expect(result[0].login).toBe('octocat')
  })

  it('filters by name substring (case-insensitive)', () => {
    const result = filterFollowingUsers(mockUsers, 'linus')
    expect(result).toHaveLength(1)
    expect(result[0].login).toBe('torvalds')
  })

  it('matches across both name and login', () => {
    const result = filterFollowingUsers(mockUsers, 'dan')
    expect(result).toHaveLength(1)
    expect(result[0].login).toBe('gaearon')
  })

  it('handles users with null name gracefully', () => {
    const result = filterFollowingUsers(mockUsers, 'null')
    expect(result).toHaveLength(1)
    expect(result[0].login).toBe('nullname')
  })

  it('returns empty array when no match', () => {
    const result = filterFollowingUsers(mockUsers, 'zzzzz')
    expect(result).toHaveLength(0)
  })
})
