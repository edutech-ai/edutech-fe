// Mock API delay để simulate network request
const MOCK_DELAY = 800; // ms

export const delay = (ms: number = MOCK_DELAY): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const mockApiResponse = async <T>(
  data: T,
  delayMs?: number
): Promise<T> => {
  await delay(delayMs);
  return data;
};

export const mockApiError = async (
  message: string,
  delayMs?: number
): Promise<never> => {
  await delay(delayMs);
  throw new Error(message);
};
