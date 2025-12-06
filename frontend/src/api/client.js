import { API_BASE_URL } from './config';

/**
 * Enhanced API Client with standardized error handling
 * Handles new backend response format
 */
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      // Handle new standardized response format
      if (!response.ok) {
        // Backend returns: { success: false, message: "...", error_code: "..." }
        throw new Error(data.message || data.error || `HTTP ${response.status}`);
      }

      // Backend returns: { success: true, data: {...}, message: "..." }
      return { 
        data: data.data || data, 
        message: data.message,
        status: response.status,
        success: data.success
      };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'DELETE' });
  }

  postFormData(endpoint, formData) {
    return fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: formData,
    }).then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP ${response.status}`);
      }
      return { 
        data: data.data || data,
        message: data.message,
        status: response.status,
        success: data.success
      };
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Example usage component
function ApiExample() {
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);

  const testApi = async () => {
    try {
      // Old format: { AccountID: "...", AccountPass: "..." }
      // New format: { account_id: "...", account_pass: "..." }
      const response = await apiClient.post('/login/', {
        account_id: 'test123',
        account_pass: 'password'
      });
      
      // Response: { data: {...}, message: "Success", success: true }
      setResult(response.data);
      console.log(response.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Refactored API Client</h2>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-blue-900 mb-2">Key Changes:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Handles new standardized response format</li>
          <li>✓ Snake_case field names (account_id vs AccountID)</li>
          <li>✓ Improved error handling with error codes</li>
          <li>✓ Success/message extraction from responses</li>
        </ul>
      </div>
      
      <button 
        onClick={testApi}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Test API Call
      </button>

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}

export default ApiExample;