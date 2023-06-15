import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from './assets'

// ----------------------------------------------------------------------

const LICENSES = ['Standard', 'Standard Plus', 'Extended']

export const _homePlans = [...Array(3)].map((_, index) => ({
  commons: ['One end products', '12 months updates', '6 months of support'],
  icons: [
    'https://minimal-assets-api.vercel.app/assets/images/home/ic_sketch.svg',
    'https://minimal-assets-api.vercel.app/assets/images/home/ic_figma.svg',
    'https://minimal-assets-api.vercel.app/assets/images/home/ic_js.svg',
    'https://minimal-assets-api.vercel.app/assets/images/home/ic_ts.svg',
  ],
  license: LICENSES[index],
  options: [
    'JavaScript version',
    'TypeScript version',
    'Design Resources',
    'Commercial applications',
  ],
}))

export const _pricingPlans = [
  {
    caption: 'forever',
    icon: <PlanFreeIcon />,
    labelAction: 'current plan',
    lists: [
      { isAvailable: true, text: '3 prototypes' },
      { isAvailable: true, text: '3 boards' },
      { isAvailable: false, text: 'Up to 5 team members' },
      { isAvailable: false, text: 'Advanced security' },
      { isAvailable: false, text: 'Permissions & workflows' },
    ],
    price: 0,
    subscription: 'basic',
  },
  {
    caption: 'saving $24 a year',
    icon: <PlanStarterIcon />,
    labelAction: 'choose starter',
    lists: [
      { isAvailable: true, text: '3 prototypes' },
      { isAvailable: true, text: '3 boards' },
      { isAvailable: true, text: 'Up to 5 team members' },
      { isAvailable: false, text: 'Advanced security' },
      { isAvailable: false, text: 'Permissions & workflows' },
    ],
    price: 4.99,
    subscription: 'starter',
  },
  {
    caption: 'saving $124 a year',
    icon: <PlanPremiumIcon />,
    labelAction: 'choose premium',
    lists: [
      { isAvailable: true, text: '3 prototypes' },
      { isAvailable: true, text: '3 boards' },
      { isAvailable: true, text: 'Up to 5 team members' },
      { isAvailable: true, text: 'Advanced security' },
      { isAvailable: true, text: 'Permissions & workflows' },
    ],
    price: 9.99,
    subscription: 'premium',
  },
]
