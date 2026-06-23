import { createContext, use, useCallback, useEffect, useReducer, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { login as apiLogin, register as apiRegister, getMe, logout as apiLogout } from '@/api/auth'
import type { User, LoginDto, RegisterDto } from '@/types/api'

type AuthState = {
  user: User | null
  isLoading: boolean
}

type AuthAction =
  | { type: 'LOADING_DONE' }
  | { type: 'SESSION_LOADED'; user: User }
  | { type: 'SESSION_FAILED' }
  | { type: 'SIGN_IN'; user: User }
  | { type: 'SIGN_OUT' }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOADING_DONE':
      return { ...state, isLoading: false }
    case 'SESSION_LOADED':
      return { user: action.user, isLoading: false }
    case 'SESSION_FAILED':
      return { user: null, isLoading: false }
    case 'SIGN_IN':
      return { user: action.user, isLoading: false }
    case 'SIGN_OUT':
      return { user: null, isLoading: false }
    default:
      return state
  }
}

type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (dto: LoginDto) => Promise<void>
  register: (dto: RegisterDto) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | null>('auth_token', null, true)
  const [{ user, isLoading }, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
  })

  useEffect(() => {
    if (!token) {
      dispatch({ type: 'LOADING_DONE' })
      return
    }

    let cancelled = false
    let userId: string

    try {
      const claims = jwtDecode<{ sub: string }>(token)
      userId = claims.sub
    } catch {
      setToken(null)
      dispatch({ type: 'SESSION_FAILED' })
      return
    }

    if (!userId) {
      setToken(null)
      dispatch({ type: 'SESSION_FAILED' })
      return
    }

    getMe(userId)
      .then(fetchedUser => {
        if (!cancelled) dispatch({ type: 'SESSION_LOADED', user: fetchedUser })
      })
      .catch(() => {
        if (!cancelled) {
          setToken(null)
          dispatch({ type: 'SESSION_FAILED' })
        }
      })

    return () => {
      cancelled = true
    }
  }, [token, setToken])

  const login = useCallback(
    async (dto: LoginDto) => {
      const res = await apiLogin(dto)
      setToken(res.token ?? null)

      const claims = jwtDecode<{ sub: string }>(res.token!)
      const user = await getMe(claims.sub)
      dispatch({ type: 'SIGN_IN', user })
    },
    [setToken],
  )

  const register = useCallback(
    async (dto: RegisterDto) => {
      const res = await apiRegister(dto)
      setToken(res.token ?? null)
      dispatch({
        type: 'SIGN_IN',
        user: { id: res.id, name: res.name, email: res.email },
      })
    },
    [setToken],
  )

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      setToken(null)
      dispatch({ type: 'SIGN_OUT' })
    }
  }, [setToken])

  return (
    <AuthContext value={{ user, token, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  const ctx = use(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
