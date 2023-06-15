import mock from '../Mock'

// ----------------------------------------------------------------------

export const _bankingContacts = [...Array(5)].map((_, index) => ({
  avatar: mock.image.avatar(index + 4),
  email: mock.email(index),
  id: mock.id(index),
  name: mock.name.fullName(index),
}))

export const _bankingQuickTransfer = [...Array(12)].map((_, index) => ({
  avatar: mock.image.avatar(index),
  email: mock.email(index),
  id: mock.id(index),
  name: mock.name.fullName(index),
}))

export const _bankingCreditCard = [
  {
    balance: 23432.03,
    cardHolder: mock.name.fullName(2),
    cardNumber: '**** **** **** 3640',
    cardType: 'mastercard',
    cardValid: '11/22',
    id: mock.id(2),
  },
  {
    balance: 18000.23,
    cardHolder: mock.name.fullName(3),
    cardNumber: '**** **** **** 8864',
    cardType: 'visa',
    cardValid: '11/25',
    id: mock.id(3),
  },
  {
    balance: 2000.89,
    cardHolder: mock.name.fullName(4),
    cardNumber: '**** **** **** 7755',
    cardType: 'mastercard',
    cardValid: '11/22',
    id: mock.id(4),
  },
]

export const _bankingRecentTransitions = [
  {
    amount: 811.45,
    avatar: mock.image.avatar(8),
    category: 'Annette Black',
    date: 1627556358365,
    id: mock.id(2),
    message: 'Receive money from',
    name: mock.name.fullName(2),
    status: 'in_progress',
    type: 'Income',
  },
  {
    amount: 436.03,
    avatar: mock.image.avatar(9),
    category: 'Courtney Henry',
    date: 1627556329038,
    id: mock.id(3),
    message: 'Payment for',
    name: mock.name.fullName(3),
    status: 'completed',
    type: 'Expenses',
  },
  {
    amount: 82.26,
    avatar: mock.image.avatar(12),
    category: 'Theresa Webb',
    date: 1627556339677,
    id: mock.id(4),
    message: 'Payment for',
    name: mock.name.fullName(4),
    status: 'failed',
    type: 'Receive',
  },
  {
    amount: 480.73,
    avatar: null,
    category: 'Beauty & Health',
    date: 1627547330510,
    id: mock.id(5),
    message: 'Payment for',
    name: null,
    status: 'completed',
    type: 'Expenses',
  },
  {
    amount: 11.45,
    avatar: null,
    category: 'Books',
    date: 1627556347676,
    id: mock.id(6),
    message: 'Payment for',
    name: null,
    status: 'in_progress',
    type: 'Expenses',
  },
]
