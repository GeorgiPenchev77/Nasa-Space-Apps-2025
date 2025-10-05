const API_BASE_URL = 'http://localhost:3000';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses (like XML)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/xml')) {
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return await response.text();
      }

      // Handle JSON responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Article endpoints
  articles = {
    getTags: () => this.request('/api/articles/tags'),
    
    generateTags: (query, limit = 5) => 
      this.request('/api/articles/generate-tags', {
        method: 'POST',
        body: JSON.stringify({ query, limit })
      }),
    
    rebuildTags: () => 
      this.request('/api/articles/rebuild-tags', {
        method: 'POST'
      })
  };

  // Search endpoints
  search = {
    links: (query) => 
      this.request('/api/search/links', {
        method: 'POST',
        body: JSON.stringify({ query })
      })
  };

  // Gemini AI endpoints
  gemini = {
    chat: (message) => 
      this.request('/api/gemini/chat', {
        method: 'POST',
        body: JSON.stringify({ message })
      }),
    
    simplify: (text) => 
      this.request('/api/gemini/simplify', {
        method: 'POST',
        body: JSON.stringify({ text })
      })
  };

  // Publication endpoints
  pubs = {
    getXml: (pmcId) => 
      this.request(`/api/pubs/get-xml?pmcId=${pmcId}`)
  };
}

// Create and export a singleton instance
const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;

// Also export the class for testing purposes
export { ApiClient };