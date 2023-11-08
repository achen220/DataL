import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface currentPlayerState {
  summonerName:string,
  region:string
}
const initialState: currentPlayerState = {
  summonerName: '',
  region: 'NA'
}
export const currentPlayerSlice = createSlice({
  name: 'currentPlayerSlice',
  initialState,
  reducers: {
    changeName: (state, action) => {
      state.summonerName = action.payload;
    },
    changeRegion: (state, action:PayloadAction) => {
      state.region = action.payload
    }
  }
})

export const {changeName} = currentPlayerSlice.actions;

export default currentPlayerSlice.reducer;