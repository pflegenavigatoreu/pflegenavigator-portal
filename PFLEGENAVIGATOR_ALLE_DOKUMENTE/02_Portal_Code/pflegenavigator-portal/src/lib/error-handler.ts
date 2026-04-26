import { NextResponse } from 'next/server'
import { PflegeNavigatorError, ErrorCode, normalizeError } from './errors'

export interface ApiErrorResponse {
  success: false
  error: {
    code: ErrorCode
    message: string
    userMessage: string
    retryable: boolean
  }
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  const normalizedError = normalizeError(error)
  
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: normalizedError.code,
      message: normalizedError.message,
      userMessage: normalizedError.userMessage,
      retryable: normalizedError.retryable
    }
  }
  
  return NextResponse.json(response, { 
    status: normalizedError.statusCode 
  })
}

export function createSuccessResponse<T>(data: T) {
  return NextResponse.json({
    success: true,
    data
  })
}
