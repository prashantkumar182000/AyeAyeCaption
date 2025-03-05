import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  videoUrl: '',
  captions: [], // Array of { text, startTime, endTime }
};

const captionsSlice = createSlice({
  name: 'captions',
  initialState,
  reducers: {
    setVideoUrl: (state, action) => {
      state.videoUrl = action.payload;
    },
    addCaption: (state, action) => {
      state.captions.push(action.payload);
    },
    editCaption: (state, action) => {
      const { index, caption } = action.payload;
      state.captions[index] = caption;
    },
    deleteCaption: (state, action) => {
      const index = action.payload;
      state.captions.splice(index, 1);
    },
  },
});

export const { setVideoUrl, addCaption, editCaption, deleteCaption } = captionsSlice.actions;
export default captionsSlice.reducer;