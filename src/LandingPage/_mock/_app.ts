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
  shortcut: `https://minimal-assets-api.vercel.app/assets/icons/ic_${appName}.svg`,
  system: (index === 2 && 'Windows') || (index === 4 && 'Windows') || 'Mac',
}))

export const _appInstalled = ['de', 'en', 'fr', 'kr', 'us'].map(
  (country, index) => ({
    id: mock.id(index),
    name: ['Germany', 'England', 'France', 'Korean', 'USA'][index],
    android: randomNumberRange(999, 99999),
    apple: randomNumberRange(999, 99999),
    flag: `https://minimal-assets-api.vercel.app/assets/icons/ic_flag_${country}.svg`,
    windows: randomNumberRange(999, 99999),
  }),
)

export const _appAuthors = [...Array(3)].map((_, index) => ({
  id: mock.id(index),
  name: mock.name.fullName(index),
  avatar: mock.image.avatar(index),
  favourite: randomNumberRange(9999, 19999),
}))

export const _appInvoices = [...Array(5)].map((_, index) => ({
  id: `${Date.now() + index}`,
  category: randomInArray(['Android', 'Mac', 'Windows']),
  price: mock.number.price(index),
  status: randomInArray(['paid', 'out_of_date', 'in_progress']),
}))

export const _appFeatured = [...Array(3)].map((_, index) => ({
  id: mock.id(index),
  title: [
    'Harry Potter and the Deathly Hallows - Part 2',
    'Disney Zombies 2',
    'Lightroom mobile - Koloro',
  ][index],
  description: mock.text.title(index),
  image: mock.image.feed(index),
}))
