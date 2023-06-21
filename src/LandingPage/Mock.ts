import { sub } from 'date-fns'

import { fullAddress, country } from './_mock/address'
import { boolean } from './_mock/boolean'
import { company } from './_mock/company'
import { email } from './_mock/email'
import { firstName, lastName, fullName } from './_mock/name'
import { price, rating, age, percent } from './_mock/number'
import { phoneNumber } from './_mock/phoneNumber'
import { role } from './_mock/role'
import { title, sentence, description } from './_mock/text'

const mock = {
  address: {
    country: (index: number) => country[index],
    fullAddress: (index: number) => fullAddress[index],
  },
  boolean: (index: number) => boolean[index],
  company: (index: number) => company[index],
  email: (index: number) => email[index],
  id: (index: number) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index + 1}`,
  image: {
    avatar: (index: number) =>
      `https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_${
        index + 1
      }.jpg`,
    cover: (index: number) =>
      `https://minimal-assets-api.vercel.app/assets/images/covers/cover_${
        index + 1
      }.jpg`,
    feed: (index: number) =>
      `https://minimal-assets-api.vercel.app/assets/images/feeds/feed_${
        index + 1
      }.jpg`,
    product: (index: number) =>
      `https://minimal-assets-api.vercel.app/assets/images/products/product_${
        index + 1
      }.jpg`,
  },
  name: {
    firstName: (index: number) => firstName[index],
    fullName: (index: number) => fullName[index],
    lastName: (index: number) => lastName[index],
  },
  number: {
    age: (index: number) => age[index],
    percent: (index: number) => percent[index],
    price: (index: number) => price[index],
    rating: (index: number) => rating[index],
  },
  phoneNumber: (index: number) => phoneNumber[index],
  role: (index: number) => role[index],
  text: {
    description: (index: number) => description[index],
    sentence: (index: number) => sentence[index],
    title: (index: number) => title[index],
  },
  time: (index: number) => sub(new Date(), { days: index, hours: index }),
}

export default mock
