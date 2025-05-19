
// Core OpenAI API function
export const callOpenAI = async (messages: any[], options: {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
} = {}): Promise<any> => {
  const apiKey = localStorage.getItem('openai_api_key');
  if (!apiKey) {
    throw new Error('API key not found');
  }

  const {
    model = 'gpt-4.1',
    temperature = 0.7
  } = options;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      response_format: {
        'type': 'json_object'
      }
    }),
    signal: options.signal
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};
