// routes
// components
import { PATH_AFTER_LOGIN } from './config'
// components
import Iconify from './Iconify'
import { PATH_AUTH, PATH_DOCS, PATH_PAGE } from './paths'

// ----------------------------------------------------------------------

const ICON_SIZE = {
  height: 22,
  width: 22,
}

const menuConfig = [
  {
    icon: <Iconify icon={'eva:home-fill'} {...ICON_SIZE} />,
    path: '/',
    title: 'LandingPage',
  },
  {
    icon: <Iconify icon={'ic:round-grain'} {...ICON_SIZE} />,
    path: PATH_PAGE.components,
    title: 'Components',
  },
  {
    children: [
      {
        items: [
          { path: PATH_PAGE.about, title: 'About us' },
          { path: PATH_PAGE.contact, title: 'Contact us' },
          { path: PATH_PAGE.faqs, title: 'FAQs' },
          { path: PATH_PAGE.pricing, title: 'Pricing' },
          { path: PATH_PAGE.payment, title: 'Payment' },
          { path: PATH_PAGE.maintenance, title: 'Maintenance' },
          { path: PATH_PAGE.comingSoon, title: 'Coming Soon' },
        ],
        subheader: 'Other',
      },
      {
        items: [
          { path: PATH_AUTH.loginUnprotected, title: 'Login' },
          { path: PATH_AUTH.registerUnprotected, title: 'Register' },
          { path: PATH_AUTH.resetPassword, title: 'Reset password' },
          { path: PATH_AUTH.verify, title: 'Verify code' },
        ],
        subheader: 'Authentication',
      },
      {
        items: [
          { path: PATH_PAGE.page404, title: 'Page 404' },
          { path: PATH_PAGE.page500, title: 'Page 500' },
        ],
        subheader: 'Error',
      },
      {
        items: [{ path: PATH_AFTER_LOGIN, title: 'Dashboard' }],
        subheader: 'Dashboard',
      },
    ],
    icon: <Iconify icon={'eva:file-fill'} {...ICON_SIZE} />,
    path: '/pages',
    title: 'Pages',
  },
  {
    icon: <Iconify icon={'eva:book-open-fill'} {...ICON_SIZE} />,
    path: PATH_DOCS,
    title: 'Documentation',
  },
]

export default menuConfig
