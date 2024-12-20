import { getApiConfig } from '../config/api';

interface ApiClientOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;
  private accessToken: string;

  constructor() {
    const config = getApiConfig();
    this.baseUrl = config.BASE_URL;
    this.accessToken = config.ACCESS_TOKEN;
  }

  private getUrl(endpoint: string, params: Record<string, string> = {}): string {
    const queryParams = new URLSearchParams({
      ...params,
      accessToken: this.accessToken,
    });
    return `${this.baseUrl}${endpoint}?${queryParams.toString()}`;
  }

  async request<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
    const { params = {}, headers = {}, ...fetchOptions } = options;
    
    try {
      const response = await fetch(this.getUrl(endpoint, params), {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
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

      return response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  }
}

export const apiClient = new ApiClient();