import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice.js";
import themeModeSlice from "./features/themeModeSlice.js";
import globalLoadingSlice from "./features/globalLoadingSlice.js";
import authModalSlice from "./features/authModalSlice.js";
import appStateSlice from "./features/appStateSlice.js";
//store and manage slice
const store = configureStore({
  reducer: {
    user: userSlice,
    themeMode: themeModeSlice,
    authModal: authModalSlice,
    globalLoading: globalLoadingSlice,
    appState: appStateSlice,
  },
});

export default store;
