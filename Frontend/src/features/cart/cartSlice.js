import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const incomingItem = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.id === incomingItem.id &&
          item.size === incomingItem.size &&
          item.color === incomingItem.color,
      );

      if (existingItem) {
        existingItem.quantity += incomingItem.quantity;
        return;
      }

      state.items.push({
        ...incomingItem,
        cartItemId: `${incomingItem.id}-${incomingItem.color}-${incomingItem.size}`,
      });
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.cartItemId === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.cartItemId === action.payload);
      if (!item) return;

      if (item.quantity === 1) {
        state.items = state.items.filter(
          (cartItem) => cartItem.cartItemId !== action.payload,
        );
        return;
      }

      item.quantity -= 1;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.cartItemId !== action.payload,
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addItem,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
