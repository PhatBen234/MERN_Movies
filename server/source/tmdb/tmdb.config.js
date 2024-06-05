const baseUrl = process.env.TMDB_BASE_URL;
const key = process.env.TMDB_KEY;

if (!baseUrl || !key) {
  throw new Error(
    "TMDB_BASE_URL or TMDB_KEY is not defined in environment variables."
  );
}

const getUrl = (endpoint, params = {}) => {
  if (typeof endpoint !== "string" || !endpoint.startsWith("/")) {
    throw new Error("Invalid endpoint format");
  }

  const qs = new URLSearchParams(params);
  return `${baseUrl}${endpoint}?api_key=${key}&${qs}`;
};

export default { getUrl };
