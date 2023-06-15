// components
import Iconify from '../Iconify'
//
import mock from '../Mock'

// ----------------------------------------------------------------------

export const _analyticPost = [...Array(5)].map((_, index) => ({
  description: mock.text.description(index),
  id: mock.id(index),
  image: mock.image.cover(index),
  postedAt: mock.time(index),
  title: mock.text.title(index),
}))

export const _analyticOrderTimeline = [...Array(5)].map((_, index) => ({
  id: mock.id(index),
  time: mock.time(index),
  title: [
    '1983, orders, $4220',
    '12 Invoices have been paid',
    'Order #37745 from September',
    'New order placed #XF-2356',
    'New order placed #XF-2346',
  ][index],
  type: `order${index + 1}`,
}))

export const _analyticTraffic = [
  {
    icon: (
      <Iconify
        icon={'eva:facebook-fill'}
        color="#1877F2"
        width={32}
        height={32}
      />
    ),
    name: 'FaceBook',
    value: 323234,
  },
  {
    icon: (
      <Iconify
        icon={'eva:google-fill'}
        color="#DF3E30"
        width={32}
        height={32}
      />
    ),
    name: 'Google',
    value: 341212,
  },
  {
    icon: (
      <Iconify
        icon={'eva:linkedin-fill'}
        color="#006097"
        width={32}
        height={32}
      />
    ),
    name: 'Linkedin',
    value: 411213,
  },
  {
    icon: (
      <Iconify
        icon={'eva:twitter-fill'}
        color="#1C9CEA"
        width={32}
        height={32}
      />
    ),
    name: 'Twitter',
    value: 443232,
  },
]
