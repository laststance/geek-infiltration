import { LazyMotion } from 'framer-motion'
import type { ReactNode } from 'react'

// ----------------------------------------------------------------------

const loadFeatures = async () =>
  import('./features.js').then((res) => res.default)

type Props = {
  children: ReactNode
}

export default function MotionLazyContainer({ children }: Props) {
  return (
    <LazyMotion strict features={loadFeatures}>
      {children}
    </LazyMotion>
  )
}
