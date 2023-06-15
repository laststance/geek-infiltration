import mock from '../Mock'

import { randomNumberRange, randomInArray } from './funcs'

// ----------------------------------------------------------------------

export const _userAbout = {
  company: mock.company(1),
  country: mock.address.country(1),
  cover: mock.image.cover(1),
  email: mock.email(1),
  facebookLink: `https://www.facebook.com/caitlyn.kerluke`,
  follower: randomNumberRange(999, 99999),
  following: randomNumberRange(999, 99999),
  id: mock.id(1),
  instagramLink: `https://www.instagram.com/caitlyn.kerluke`,
  linkedinLink: `https://www.linkedin.com/in/caitlyn.kerluke`,
  position: 'UI Designer',
  quote:
    'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
  role: 'Manager',
  school: mock.company(2),
  twitterLink: `https://www.twitter.com/caitlyn.kerluke`,
}

export const _userFollowers = [...Array(18)].map((_, index) => ({
  avatarUrl: mock.image.avatar(index),
  country: mock.address.country(index),
  id: mock.id(index),
  isFollowed: mock.boolean(index),
  name: mock.name.fullName(index),
}))

export const _userFriends = [...Array(18)].map((_, index) => ({
  avatarUrl: mock.image.avatar(index),
  id: mock.id(index),
  name: mock.name.fullName(index),
  role: mock.role(index),
}))

export const _userGallery = [...Array(12)].map((_, index) => ({
  id: mock.id(index),
  imageUrl: mock.image.cover(index),
  postAt: mock.time(index),
  title: mock.text.title(index),
}))

export const _userFeeds = [...Array(3)].map((_, index) => ({
  author: {
    avatarUrl: mock.image.avatar(1),
    id: mock.id(8),
    name: 'Caitlyn Kerluke',
  },
  comments: (index === 2 && []) || [
    {
      author: {
        avatarUrl: mock.image.avatar(randomInArray([2, 3, 4, 5, 6]) || 2),
        id: mock.id(8),
        name: mock.name.fullName(index + 5),
      },
      createdAt: mock.time(2),
      id: mock.id(7),
      message: 'Praesent venenatis metus at',
    },
    {
      author: {
        avatarUrl: mock.image.avatar(randomInArray([7, 8, 9, 10, 11]) || 7),
        id: mock.id(10),
        name: mock.name.fullName(index + 6),
      },
      createdAt: mock.time(3),
      id: mock.id(9),
      message:
        'Etiam rhoncus. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed lectus.',
    },
  ],
  createdAt: mock.time(index),
  id: mock.id(index),
  isLiked: true,
  media: mock.image.feed(index),
  message: mock.text.sentence(index),
  personLikes: [...Array(36)].map((_, index) => ({
    avatarUrl: mock.image.avatar(index + 2),
    name: mock.name.fullName(index),
  })),
}))

export const _userCards = [...Array(24)].map((_, index) => ({
  avatarUrl: mock.image.avatar(index),
  cover: mock.image.cover(index),
  follower: randomNumberRange(999, 99999),
  following: randomNumberRange(999, 99999),
  id: mock.id(index),
  name: mock.name.fullName(index),
  position: mock.role(index),
  totalPost: randomNumberRange(999, 99999),
}))

export const _userPayment = [...Array(2)].map((_, index) => ({
  cardNumber: [
    '**** **** **** 1234',
    '**** **** **** 5678',
    '**** **** **** 7878',
  ][index],
  cardType: ['master_card', 'visa', 'master_card'][index],
  id: mock.id(index),
}))

export const _userAddressBook = [...Array(4)].map((_, index) => ({
  city: 'East Sambury',
  country: mock.address.country(index),
  id: mock.id(index),
  name: mock.name.fullName(index),
  phone: mock.phoneNumber(index),
  state: 'New Hampshire',
  street: '41256 Kamille Turnpike',
  zipCode: '85807',
}))

export const _userInvoices = [...Array(10)].map((_, index) => ({
  createdAt: mock.time(index),
  id: mock.id(index),
  price: mock.number.price(index),
}))

export const _userList = [...Array(24)].map((_, index) => ({
  address: '908 Jack Locks',
  avatarUrl: mock.image.avatar(index),
  city: 'Rancho Cordova',
  company: mock.company(index),
  country: mock.address.country(index),
  email: mock.email(index),
  id: mock.id(index),
  isVerified: mock.boolean(index),
  name: mock.name.fullName(index),
  phoneNumber: mock.phoneNumber(index),
  role: mock.role(index),
  state: 'Virginia',
  status: randomInArray(['active', 'banned']),
  zipCode: '85807',
}))
