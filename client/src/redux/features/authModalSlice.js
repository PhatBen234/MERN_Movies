import { createSlice } from "@reduxjs/toolkit";
// set up default authModalSlice ( cửa sổ khi đăng nhập, đăng ký)
export const authModalSlice = createSlice({
  name: "AuthModal",
  initialState: {
    authModalOpen: false,
  },
  reducers: {
    setAuthModalOpen: (state, action) => {
      state.authModalOpen = action.payload;
    },
  },
});

export const { setAuthModalOpen } = authModalSlice.actions;

export default authModalSlice.reducer;
