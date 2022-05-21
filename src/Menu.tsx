import { memo } from 'react'

const Menu = () => {
  return (
    <div>
      <ul>
        <li>Issue Comment</li>
        <li>PR comment</li>
        <li>New Issue</li>
        <li>New PR</li>
        <li>New Discussion</li>
        <li>Discussion Comment</li>
        <li>commit</li>
      </ul>
    </div>
  )
}

export default memo(Menu)
