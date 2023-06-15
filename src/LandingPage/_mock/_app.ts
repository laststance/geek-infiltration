import { noCase } from 'change-case'

// mock
import mock from '../Mock'

import { randomNumberRange, randomInArray } from './funcs'

// ----------------------------------------------------------------------

export const _appRelated = [
  'Chrome',
  'Drive',
  'Dropbox',
  'Evernote',
  'Github',
].map((appName, index) => ({
  id: mock.id(index),
  name: appName,
  price:
    index === 0 || index === 2 || index === 4 ? 0 : mock.number.price(index),
  rating: mock.number.rating(index),
  review: randomNumberRange(999, 99999),
  shortcut: `https://minimal-assets-api.vercel.app/assets/icons/ic_${noCase(
    appName
  )}.svg`,
  system: (index === 2 && 'Windows') || (index === 4 && 'Windows') || 'Mac',
}))

export const _appInstalled = ['de', 'en', 'fr', 'kr', 'us'].map(
  (country, index) => ({
    android: randomNumberRange(999, 99999),
    apple: randomNumberRange(999, 99999),
    flag: `https://minimal-assets-api.vercel.app/assets/icons/ic_flag_${country}.svg`,
    id: mock.id(index),
    name: ['Germany', 'England', 'France', 'Korean', 'USA'][index],
    windows: randomNumberRange(999, 99999),
  })
)

export const _appAuthors = [...Array(3)].map((_, index) => ({
  avatar: mock.image.avatar(index),
  favourite: randomNumberRange(9999, 19999),
  id: mock.id(index),
  name: mock.name.fullName(index),
}))

export const _appInvoices = [...Array(5)].map((_, index) => ({
  category: randomInArray(['Android', 'Mac', 'Windows']),
  id: `${Date.now() + index}`,
  price: mock.number.price(index),
  status: randomInArray(['paid', 'out_of_date', 'in_progress']),
}))

export const _appFeatured = [...Array(3)].map((_, index) => ({
  description: mock.text.title(index),
  id: mock.id(index),
  image: mock.image.feed(index),
  title: [
    'Harry Potter and the Deathly Hallows - Part 2',
    'Disney Zombies 2',
    'Lightroom mobile - Koloro',
  ][index],
}))
