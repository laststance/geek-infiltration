import mock from '../Mock'

// ----------------------------------------------------------------------

export const _bankingContacts = [...Array(5)].map((_, index) => ({
  id: mock.id(index),
  name: mock.name.fullName(index),
  avatar: mock.image.avatar(index + 4),
  email: mock.email(index),
}))

export const _bankingQuickTransfer = [...Array(12)].map((_, index) => ({
  id: mock.id(index),
  name: mock.name.fullName(index),
  avatar: mock.image.avatar(index),
  email: mock.email(index),
}))

export const _bankingCreditCard = [
  {
    id: mock.id(2),
    balance: 23432.03,
    cardHolder: mock.name.fullName(2),
    cardNumber: '**** **** **** 3640',
    cardType: 'mastercard',
    cardValid: '11/22',
  },
  {
    id: mock.id(3),
    balance: 18000.23,
    cardHolder: mock.name.fullName(3),
    cardNumber: '**** **** **** 8864',
    cardType: 'visa',
    cardValid: '11/25',
  },
  {
    id: mock.id(4),
    balance: 2000.89,
    cardHolder: mock.name.fullName(4),
    cardNumber: '**** **** **** 7755',
    cardType: 'mastercard',
    cardValid: '11/22',
  },
]

export const _bankingRecentTransitions = [
  {
    id: mock.id(2),
    name: mock.name.fullName(2),
    amount: 811.45,
    avatar: mock.image.avatar(8),
    category: 'Annette Black',
    date: 1627556358365,
    message: 'Receive money from',
    status: 'in_progress',
    type: 'Income',
  },
  {
    id: mock.id(3),
    name: mock.name.fullName(3),
    amount: 436.03,
    avatar: mock.image.avatar(9),
    category: 'Courtney Henry',
    date: 1627556329038,
    message: 'Payment for',
    status: 'completed',
    type: 'Expenses',
  },
  {
    id: mock.id(4),
    name: mock.name.fullName(4),
    amount: 82.26,
    avatar: mock.image.avatar(12),
    category: 'Theresa Webb',
    date: 1627556339677,
    message: 'Payment for',
    status: 'failed',
    type: 'Receive',
  },
  {
    id: mock.id(5),
    name: null,
    amount: 480.73,
    avatar: null,
    category: 'Beauty & Health',
    date: 1627547330510,
    message: 'Payment for',
    status: 'completed',
    type: 'Expenses',
  },
  {
    id: mock.id(6),
    name: null,
    amount: 11.45,
    avatar: null,
    category: 'Books',
    date: 1627556347676,
    message: 'Payment for',
    status: 'in_progress',
    type: 'Expenses',
  },
]
