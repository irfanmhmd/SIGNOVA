
const API_URL = process.env.EXPO_PUBLIC_API_URL;

type ApiOptions = {
  method?: 'GET' | 'POST';
  body?: unknown;
};

export type HealthResponse = {
  status: string;
  service: string;
  version: string;
};

export type RiskExplanation = {
  riskCode: string;
  severity: string;
  title: string;
  explanation: string;
  recommendedAction: string;
  source: string;
};

async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error('API URL is missing. Check mobile .env');
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: { 'Content-Type': 'application/json' },
    ...(options.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? `API request failed: ${response.status}`,
    );
  }

  return data as T;
}

export function checkApiHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/health');
}

export function explainRisk(
  riskCode: string,
): Promise<RiskExplanation> {
  return apiRequest<RiskExplanation>('/risk/explain', {
    method: 'POST',
    body: { riskCode },
  });
}
