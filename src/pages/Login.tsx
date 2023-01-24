import { memo } from 'react'

const Login: React.FC = memo(() => {
  return (
    <div>
      <h1>Login</h1>
      <a
        href={`https://github.com/login/oauth/authorize?scope=user&client_id=${
          import.meta.env.VITE_CLIENT_ID
        }&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`}
      >
        GitHub Login
      </a>
    </div>
  )
})
Login.displayName = 'Login'
export default Login
