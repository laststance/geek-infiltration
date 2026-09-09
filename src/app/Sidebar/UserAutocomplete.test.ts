import { describe, test, expect } from 'vitest'

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
  test('returns all users when input is empty', () => {
    const result = filterFollowingUsers(mockUsers, '')
    expect(result).toHaveLength(4)
  })

  test('filters by login substring (case-insensitive)', () => {
    const result = filterFollowingUsers(mockUsers, 'octo')
    expect(result).toHaveLength(1)
    expect(result[0].login).toBe('octocat')
  })

  test('filters by name substring (case-insensitive)', () => {
    const result = filterFollowingUsers(mockUsers, 'linus')
    expect(result).toHaveLength(1)
    expect(result[0].login).toBe('torvalds')
  })

  test('matches across both name and login', () => {
    const result = filterFollowingUsers(mockUsers, 'dan')
    expect(result).toHaveLength(1)
    expect(result[0].login).toBe('gaearon')
  })

  test('handles users with null name gracefully', () => {
    const result = filterFollowingUsers(mockUsers, 'null')
    expect(result).toHaveLength(1)
    expect(result[0].login).toBe('nullname')
  })

  test('returns empty array when no match', () => {
    const result = filterFollowingUsers(mockUsers, 'zzzzz')
    expect(result).toHaveLength(0)
  })
})
