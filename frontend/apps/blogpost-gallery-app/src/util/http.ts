/**
 * This asynchronous function is used for making GET requests to a given URL. It attempts
 * to fetch data from the server and returns the data as a specified type T. If the
 * response is not successful, it throws an error with details about the status.
 */
// This makes error handling more explicit and allows the caller to distinguish between a successful and unsuccessful call.
export const getData = async <T>(url: string): Promise<T | Error> => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Errors are now returned rather than thrown. This approach is often more manageable in asynchronous
            // code, where throwing errors can sometimes lead to unhandled promise rejections.
            return new Error(
                JSON.stringify({
                    status: response.status,
                    statusText: response.statusText,
                    message: `Failed to fetch data from the server.`,
                })
            );
        }

        const data = await response.json();
        // The function still casts the fetched data to type T, which is a necessary trade-off in dynamic
        // data fetching scenarios in TypeScript. The caller of the function needs to ensure the correct type is used.
        return data as T;
    } catch (error) {
        // Return the error instead of just logging it
        return error instanceof Error ? error : new Error(String(error));
    }
};
