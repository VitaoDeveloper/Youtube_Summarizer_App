import { createContext, use, useCallback, useEffect, useReducer, type ReactNode } from 'react'
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
  const [token, setToken] = useLocalStorage<string | null>('auth_token', null)
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

    getMe()
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
      setToken(res.token)
      dispatch({ type: 'SIGN_IN', user: res.user })
    },
    [setToken],
  )

  const register = useCallback(
    async (dto: RegisterDto) => {
      const res = await apiRegister(dto)
      setToken(res.token)
      dispatch({ type: 'SIGN_IN', user: res.user })
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
