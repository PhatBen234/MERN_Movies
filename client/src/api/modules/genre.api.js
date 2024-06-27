import publicClient from "../client/public.client";
// interact with genre API in backend
const genreEndpoints = {
  list: ({ mediaType }) => `${mediaType}/genres`, //mediaType:movie,tv
};

const genreApi = {
  getList: async ({ mediaType }) => {
    try {
      const response = await publicClient.get(
        genreEndpoints.list({ mediaType })
      );

      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default genreApi;
