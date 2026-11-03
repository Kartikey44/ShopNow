export const normalizeApiBaseUrl = (server) => {
  const baseUrl = server?.trim().replace(/\/+$/, "");
  if (!baseUrl) return baseUrl;

  return /\/api$/i.test(baseUrl) ? baseUrl : `${baseUrl}/api`;
};
