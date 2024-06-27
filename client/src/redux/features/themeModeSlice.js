import { createSlice } from "@reduxjs/toolkit";
//set up default theme is dark
export const themeModeSlice = createSlice({
  name: "ThemeMode",
  initialState: {
    themeMode: "dark",
  },
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
  },
});

export const { setThemeMode } = themeModeSlice.actions;

export default themeModeSlice.reducer;
