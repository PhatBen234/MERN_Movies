const favoriteUtils = {
   // Method to check if a mediaId exists in the listFavorites array
  check: ({ listFavorites, mediaId }) =>
    listFavorites &&
    listFavorites.find((e) => e.mediaId.toString() === mediaId.toString()) !==
      undefined,
};

export default favoriteUtils;
