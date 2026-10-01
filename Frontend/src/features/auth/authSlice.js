import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (registrationData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/auth/register",
        registrationData,
      );
      return data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", credentials);
      return data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const loadCurrentUser = createAsyncThunk(
  "auth/loadCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/auth/profile");
      return data.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const initialState = {
  user: null,
  status: "checking",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.error = null;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.error = null;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          [
            "auth/register/fulfilled",
            "auth/login/fulfilled",
            "auth/loadCurrentUser/fulfilled",
          ].includes(action.type),
        (state, action) => {
          state.status = "succeeded";
          state.user = action.payload;
        },
      )
      .addMatcher(
        (action) =>
          action.type !== "auth/loadCurrentUser/rejected" &&
          action.type.startsWith("auth/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "idle";
          state.error =
            action.payload || "Something went wrong. Please try again.";
        },
      );
  },
});

export const { clearAuthError } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);

export default authSlice.reducer;
