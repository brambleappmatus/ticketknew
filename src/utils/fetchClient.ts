import { getApiConfig } from '../config/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function fetchClient(endpoint: string, options: FetchOptions = {}) {
  const config = getApiConfig();
  const { params = {}, headers = {}, ...fetchOptions } = options;
  
  // Add access token to params
  const queryParams = new URLSearchParams(params);
  queryParams.set('accessToken', config.ACCESS_TOKEN);
  
  const url = `${config.BASE_URL}${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
      credentials: 'same-origin',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error Response:', errorData);
      
      if (errorData?.error?.form) {
        const formErrors = Object.entries(errorData.error.form)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        throw new Error(`Validation error: ${formErrors}`);
      }
      
      throw new Error(
        errorData?.message || 
        errorData?.error?.message || 
        `API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error instanceof Error ? error : new Error('An unexpected error occurred');
  }
}