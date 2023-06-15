import mock from '../Mock'

// ----------------------------------------------------------------------

const COUNTRY = ['de', 'en', 'fr', 'kr', 'us']

const CATEGORY = ['CAP', 'Branded Shoes', 'Headphone', 'Cell Phone', 'Earings']

const PRODUCT_NAME = [
  'Small Granite Computer',
  'Small Rubber Mouse',
  'Awesome Rubber Hat',
  'Sleek Cotton Sausages',
  'Rustic Wooden Chicken',
]

export const _ecommerceSalesOverview = [...Array(3)].map((_, index) => ({
  amount: mock.number.price(index) * 100,
  label: ['Total Profit', 'Total Income', 'Total Expenses'][index],
  value: mock.number.percent(index),
}))

export const _ecommerceBestSalesman = [...Array(5)].map((_, index) => ({
  avatar: mock.image.avatar(index + 8),
  category: CATEGORY[index],
  email: mock.email(index),
  flag: `https://minimal-assets-api.vercel.app/assets/icons/ic_flag_${COUNTRY[index]}.svg`,
  id: mock.id(index),
  name: mock.name.fullName(index),
  rank: `Top ${index + 1}`,
  total: mock.number.price(index),
}))

export const _ecommerceLatestProducts = [...Array(5)].map((_, index) => ({
  colors: (index === 0 && ['#2EC4B6', '#E71D36', '#FF9F1C', '#011627']) ||
    (index === 1 && ['#92140C', '#FFCF99']) ||
    (index === 2 && [
      '#0CECDD',
      '#FFF338',
      '#FF67E7',
      '#C400FF',
      '#52006A',
      '#046582',
    ]) ||
    (index === 3 && ['#845EC2', '#E4007C', '#2A1A5E']) || ['#090088'],
  id: mock.id(index),
  image: mock.image.product(index),
  name: PRODUCT_NAME[index],
  price: mock.number.price(index),
  priceSale: index === 0 || index === 3 ? 0 : mock.number.price(index),
}))

export const _ecommerceNewProducts = [...Array(5)].map((_, index) => ({
  id: mock.id(index),
  image: mock.image.product(index),
  name: [
    'Nike Air Max 97',
    'Nike Zoom Gravity',
    'Nike DBreak-Type',
    'Kyrie Flytrap 3 EP Basketball Shoe',
    'Nike Air Max Fusion Men',
  ][index],
}))
