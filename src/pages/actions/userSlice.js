import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";

export const getUser = createAsyncThunk("userSlice/getUser", async () => {
  const response = await api.get("/users/get_user");
  return response.data;
});

const initialState = {};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUsers: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.user = {};
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.user = payload?.data;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = {};
      });
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
