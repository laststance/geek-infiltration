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
