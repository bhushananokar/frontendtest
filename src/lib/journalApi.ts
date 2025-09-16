// Journal API service for communicating with the deployed journal CRUD service

export interface JournalEntry {
  id?: string
  userId: string
  title: string
  content: string
  mood?: 'happy' | 'sad' | 'anxious' | 'calm' | 'excited' | 'angry' | 'neutral'
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  count?: number
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error?: string
  details?: string
}

class JournalApiService {
  private baseUrl: string
  private mlBaseUrl: string
  private userId: string

  constructor() {
    // Use environment variables for endpoints
    const crudEndpoint = import.meta.env.VITE_JOURNAL_CRUD_ENDPOINT
    const mlEndpoint = import.meta.env.VITE_JOURNAL_ML_ENDPOINT
    
    // Use proxy in development, direct endpoint in production
    this.baseUrl = import.meta.env.DEV 
      ? '' // Use Vite proxy in development
      : crudEndpoint
    this.mlBaseUrl = import.meta.env.DEV
      ? mlEndpoint // Use environment variable in development
      : mlEndpoint
    // For now, use a default userId - in a real app, this would come from auth
    this.userId = 'digitaltwin-user'
    
    // Debug logging for API configuration
    console.log('🔧 [API-CONFIG] Journal API Service initialized:', {
      environment: import.meta.env.DEV ? 'development' : 'production',
      crudEndpoint,
      mlEndpoint,
      baseUrl: this.baseUrl,
      mlBaseUrl: this.mlBaseUrl,
      userId: this.userId,
      envVars: {
        VITE_JOURNAL_CRUD_ENDPOINT: import.meta.env.VITE_JOURNAL_CRUD_ENDPOINT,
        VITE_JOURNAL_ML_ENDPOINT: import.meta.env.VITE_JOURNAL_ML_ENDPOINT
      },
      timestamp: new Date().toISOString()
    })
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Journal API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  // Create a new journal entry
  async createJournal(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<JournalEntry>> {
    return this.makeRequest<JournalEntry>('/api/journals', {
      method: 'POST',
      body: JSON.stringify(entry),
    })
  }

  // Get a specific journal entry by ID
  async getJournal(id: string): Promise<ApiResponse<JournalEntry>> {
    return this.makeRequest<JournalEntry>(`/api/journals/${id}`)
  }

  // Get all journals for a user with pagination
  async getUserJournals(
    userId: string = this.userId,
    limit: number = 20,
    offset: number = 0
  ): Promise<ApiResponse<JournalEntry[]>> {
    return this.makeRequest<JournalEntry[]>(
      `/api/journals/user/${userId}?limit=${limit}&offset=${offset}`
    )
  }

  // Update a journal entry
  async updateJournal(
    id: string,
    updates: Partial<Omit<JournalEntry, 'id' | 'userId' | 'createdAt'>>
  ): Promise<ApiResponse<JournalEntry>> {
    return this.makeRequest<JournalEntry>(`/api/journals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  // Delete a journal entry
  async deleteJournal(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/api/journals/${id}`, {
      method: 'DELETE',
    })
  }

  // Search journals by title, content, or tags
  async searchJournals(
    query: string,
    userId: string = this.userId,
    limit: number = 20,
    offset: number = 0
  ): Promise<ApiResponse<JournalEntry[]>> {
    const encodedQuery = encodeURIComponent(query)
    return this.makeRequest<JournalEntry[]>(
      `/api/journals/user/${userId}/search?q=${encodedQuery}&limit=${limit}&offset=${offset}`
    )
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.makeRequest<{ status: string; timestamp: string }>('/health')
  }

  // Trigger ML processing for a journal entry
  async triggerMLProcessing(
    journalId: string,
    userId: string = this.userId,
    triggerImmediate: boolean = false
  ): Promise<ApiResponse<{ message: string; processingId?: string }>> {
    const requestId = Math.random().toString(36).substring(7)
    const startTime = Date.now()
    
    console.log(`🤖 [ML-${requestId}] Starting ML processing request:`, {
      journalId,
      userId,
      triggerImmediate,
      mlBaseUrl: this.mlBaseUrl,
      timestamp: new Date().toISOString()
    })

    try {
      const url = `${this.mlBaseUrl}/process-journal`
      const requestBody = {
        journal_id: journalId,
        user_id: userId,
        trigger_immediate: triggerImmediate
      }

      console.log(`🌐 [ML-${requestId}] Making request to:`, {
        url,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
      })

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const responseTime = Date.now() - startTime
      console.log(`📡 [ML-${requestId}] Response received:`, {
        status: response.status,
        statusText: response.statusText,
        responseTime: `${responseTime}ms`,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        let errorData = {}
        try {
          errorData = await response.json()
        } catch (parseError) {
          console.warn(`⚠️ [ML-${requestId}] Failed to parse error response:`, parseError)
        }
        
        console.error(`❌ [ML-${requestId}] ML API request failed:`, {
          status: response.status,
          statusText: response.statusText,
          errorData,
          responseTime: `${responseTime}ms`
        })
        
        throw new Error((errorData as any).error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`✅ [ML-${requestId}] ML processing request successful:`, {
        data,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString()
      })
      
      return data
    } catch (error) {
      const responseTime = Date.now() - startTime
      console.error(`💥 [ML-${requestId}] ML API request failed with error:`, {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        responseTime: `${responseTime}ms`,
        journalId,
        userId,
        triggerImmediate,
        mlBaseUrl: this.mlBaseUrl,
        timestamp: new Date().toISOString()
      })
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  // Helper method to create a journal entry from date and content
  async createJournalFromDate(
    date: Date,
    content: string,
    title?: string
  ): Promise<ApiResponse<JournalEntry>> {
    const journalTitle = title || `Journal Entry - ${date.toLocaleDateString()}`
    
    return this.createJournal({
      userId: this.userId,
      title: journalTitle,
      content,
    })
  }
}

// Export a singleton instance
export const journalApi = new JournalApiService()
export default journalApi
