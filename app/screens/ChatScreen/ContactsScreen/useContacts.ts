import { accountService } from "app/API/services"
import { User } from "app/API/types"
import { useEffect, useState } from "react"

export const useContacts = () => {
  const [contacts, setContacts] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    setIsLoading(true)
    try {
      const res = await accountService.getContacts()
      if (res.status === 200) {
        setContacts(res.data ?? [])
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return { data: contacts, isLoading, error, fetchContacts }
}
