import { Database } from "@nozbe/watermelondb"
import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { DatabaseService, MessageRepository } from "app/database"

interface DatabaseContextType {
  database: Database | null
  messageRepo: MessageRepository | null
  isLoading: boolean
  error: Error | null
}

const DatabaseContext = createContext<DatabaseContextType | null>(null)

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [database, setDatabase] = useState<Database | null>(null)
  const [messageRepo, setMessageRepo] = useState<MessageRepository | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const dbService = new DatabaseService()
        const db = dbService.getDatabase()
        setDatabase(db)
        setMessageRepo(new MessageRepository(db))
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    initDatabase().then(r => console.log(r))
  }, [])

  const value = useMemo(
    () => ({
      database,
      messageRepo,
      isLoading,
      error,
    }),
    [database, messageRepo, isLoading, error],
  )

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>
}

// Custom hook để sử dụng context
export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext)
  if (!context) {
    throw new Error("useDatabaseContext must be used within DatabaseProvider")
  }
  return context
}
