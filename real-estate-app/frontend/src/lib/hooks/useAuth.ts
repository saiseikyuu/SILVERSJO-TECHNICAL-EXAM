'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [role, setRole] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token')
    const storedRole = localStorage.getItem('user_role')

    if (!storedToken) {
      router.push('/login')
      return
    }

    setToken(storedToken)
    setRole(storedRole)
    setLoading(false)
  }, [router])

  return { role, token, loading }
}
