import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";

const initialState = {
  items: [],
  subtotal: 0,
  tax: 0,
  finalTotal: 0,
  status: "idle",
  error: null,
};

const getErrorMessage = (error) =>
  error.response?.data?.message || "Unable to update your cart.";

const applyCart = (state, cart = {}) => {
  state.items = cart.items || [];
  state.subtotal = cart.subtotal || 0;
  state.tax = cart.tax || 0;
  state.finalTotal = cart.finalTotal || 0;
};

export const loadCart = createAsyncThunk(
  "cart/load",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/cart");
      return data.cart;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const addProductToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/cart/add", {
        productId,
        quantity,
      });
      return data.cart;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const setCartQuantity = createAsyncThunk(
  "cart/setQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(`/cart/${productId}`, {
        quantity,
      });
      return data.cart;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const removeCartProduct = createAsyncThunk(
  "cart/remove",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete("/cart/remove", {
        data: { productId },
      });
      return data.cart;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const emptyCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.delete("/cart/clear");
      return data.cart;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      applyCart(state);
      state.status = "idle";
      state.error = null;
    },
    clearCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const requests = [
      loadCart,
      addProductToCart,
      setCartQuantity,
      removeCartProduct,
      emptyCart,
    ];

    requests.forEach((request) => {
      builder
        .addCase(request.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(request.fulfilled, (state, action) => {
          applyCart(state, action.payload);
          state.status = "succeeded";
        })
        .addCase(request.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload || "Unable to update your cart.";
        });
    });
  },
});

export const { clearCartState, clearCartError } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state) => state.cart.subtotal;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;
