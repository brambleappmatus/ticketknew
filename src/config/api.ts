export function getApiConfig() {
  const stored = localStorage.getItem('ticketSystemSettings');
  const settings = stored ? JSON.parse(stored) : {
    instanceUrl: 'mstanotest.daktela.com',
    apiKey: 'ffc90793e8738b0e648da603985c5f334cc4caf5',
  };

  return {
    BASE_URL: '/api/v6',
    ACCESS_TOKEN: settings.apiKey,
  };
}