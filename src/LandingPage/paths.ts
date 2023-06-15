// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`
}

const ROOTS_AUTH = '/auth'
const ROOTS_DASHBOARD = '/dashboard'

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  root: ROOTS_AUTH,
  verify: path(ROOTS_AUTH, '/verify'),
}

export const PATH_PAGE = {
  about: '/about-us',
  comingSoon: '/coming-soon',
  components: '/components',
  contact: '/contact-us',
  faqs: '/faqs',
  maintenance: '/maintenance',
  page404: '/404',
  page500: '/500',
  payment: '/payment',
  pricing: '/pricing',
}

export const PATH_DASHBOARD = {
  blog: {
    newPost: path(ROOTS_DASHBOARD, '/blog/new-post'),
    post: path(ROOTS_DASHBOARD, '/blog/post/:title'),
    postById: path(
      ROOTS_DASHBOARD,
      '/blog/post/apply-these-7-secret-techniques-to-improve-event'
    ),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    root: path(ROOTS_DASHBOARD, '/blog'),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  chat: {
    conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    root: path(ROOTS_DASHBOARD, '/chat'),
  },
  eCommerce: {
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    editById: path(
      ROOTS_DASHBOARD,
      '/e-commerce/product/nike-blazer-low-77-vintage/edit'
    ),
    invoice: path(ROOTS_DASHBOARD, '/e-commerce/invoice'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    newProduct: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    product: path(ROOTS_DASHBOARD, '/e-commerce/product/:name'),
    productById: path(
      ROOTS_DASHBOARD,
      '/e-commerce/product/nike-air-force-1-ndestrukt'
    ),
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
  },
  general: {
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    app: path(ROOTS_DASHBOARD, '/app'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
  },
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  mail: {
    all: path(ROOTS_DASHBOARD, '/mail/all'),
    root: path(ROOTS_DASHBOARD, '/mail'),
  },
  root: ROOTS_DASHBOARD,
  user: {
    account: path(ROOTS_DASHBOARD, '/user/account'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    editById: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    newUser: path(ROOTS_DASHBOARD, '/user/new'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    root: path(ROOTS_DASHBOARD, '/user'),
  },
}

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction'
