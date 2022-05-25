import { memo } from 'react'

const Menu = () => {
  return (
    <div>
      <ul>
        <li>Comment</li>
        <li>Issue/PR/Discussion</li>
      </ul>
    </div>
  )
}

export default memo(Menu)
