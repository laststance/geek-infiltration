import mock from '../Mock'

import { randomInArray } from './funcs'

// ----------------------------------------------------------------------

export const _bookings = [...Array(5)].map((_, index) => ({
  id: mock.id(index),
  name: mock.name.fullName(index),
  avatar: mock.image.avatar(index),
  checkIn: mock.time(index),
  checkOut: mock.time(index),
  phoneNumber: mock.phoneNumber(index),
  roomType: randomInArray(['double', 'king', 'single']),
  status: randomInArray(['pending', 'un_paid', 'paid']),
}))

export const _bookingsOverview = [...Array(3)].map((_, index) => ({
  quantity: mock.number.percent(index) * 1000,
  status: ['Pending', 'Cancel', 'Done'][index],
  value: mock.number.percent(index),
}))

export const _bookingReview = [...Array(5)].map((_, index) => ({
  id: mock.id(index),
  name: mock.name.fullName(index),
  avatar: mock.image.avatar(index),
  description: mock.text.description(index),
  postedAt: mock.time(index),
  rating: mock.number.rating(index),
  tags: ['Great Sevice', 'Recommended', 'Best Price'],
}))

export const _bookingNew = [...Array(5)].map((_, index) => ({
  id: mock.id(index),
  name: mock.name.fullName(index),
  avatar: mock.image.avatar(index),
  bookdAt: mock.time(index),
  cover: `https://minimal-assets-api.vercel.app/assets/images/rooms/room-${
    index + 1
  }.jpg`,
  person: '3-5',
  roomNumber: 'A-21',
  roomType: randomInArray(['double', 'king', 'single']),
}))
