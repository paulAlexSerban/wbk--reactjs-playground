type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Each asynchronous function is used for making GET, POST, PUT and DELETE requests to a given URL. It attempts
 * to fetch data from the server and returns the data as a specified type T. If the
 * response is not successful, it throws an error with details about the status.
 */
class HttpRequestFacade {
    async get<T>(url: string): Promise<T> {
        return this.fetchRequest<T>(url, 'GET');
    }

    async post<T>(url: string, data: unknown): Promise<T> {
        return this.fetchRequest<T>(url, 'POST', data);
    }

    async put<T>(url: string, data: unknown): Promise<T> {
        return this.fetchRequest<T>(url, 'PUT', data);
    }

    async delete<T>(url: string): Promise<T> {
        return this.fetchRequest<T>(url, 'DELETE');
    }

    private async fetchRequest<T>(url: string, method: HttpMethod, data: unknown = null): Promise<T> {
        try {
            const options: RequestInit = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return (await response.json()) as T;
        } catch (error) {
            // Handle or rethrow the error as required by your application
            console.error('HttpRequestFacade Error:', error);
            throw error;
        }
    }
}

export default HttpRequestFacade;

/**
 * Benefits of Using a Facade for HTTP Requests:
 *
 * Simplicity: The facade simplifies the usage of fetch API by abstracting the complexity of making different types of HTTP requests.
 * Consistency: It provides a consistent way to handle common tasks like setting headers, converting to JSON, and error handling.
 * Reusability: The facade can be reused across different parts of your application, making your code DRY (Don't Repeat Yourself).
 * Flexibility: If in the future you need to change the underlying implementation (for example, switching from fetch to another HTTP library), you only need to change it in the facade, not throughout your application.
 * Error Handling: Centralizes error handling logic, making it easier to manage and modify.
 * Remember, the key goal of the Facade Pattern is to hide the complexity of the system and provide an easier to use interface.
 */
