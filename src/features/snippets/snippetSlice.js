// features/snippets/snippetSlice.js
import { createSlice } from "@reduxjs/toolkit";

const snippetSlice = createSlice({
  name: "snippet",
  initialState: {
    currentSnippet: null,
  },
  reducers: {
    setCurrentSnippet: (state, action) => {
      state.currentSnippet = action.payload;
    },
    clearCurrentSnippet: (state) => {
      state.currentSnippet = null;
    },
  },
});

export const { setCurrentSnippet, clearCurrentSnippet } = snippetSlice.actions;
export default snippetSlice.reducer;
