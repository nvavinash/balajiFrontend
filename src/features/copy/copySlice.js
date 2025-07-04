import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addToCart, deleteItemFromCart, fetchItemsByUserId, updateCart, resetCart} from './cartAPI';

const initialState = {
  items : [],
  status: 'idle',
  cartLoaded: false
};

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (item) => {
    const response = await addToCart(item);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchItemsByUserIdAsync = createAsyncThunk(
  'cart/fetchItemsByUserId',
  async() =>{
    const response = await fetchItemsByUserId();
    return response.data;
  }
)
export const updateCartAsync = createAsyncThunk(
  'cart/updateCart',
  async(userId) =>{
    const response = await updateCart(userId);
    return response.data;
  }
)

export const deleteItemFromCartAsync = createAsyncThunk(
  'cart/deleteItemFromCart',
  async(itemId)=>{
    const response = await deleteItemFromCart(itemId);
    return response.data;
  }
)

export const resetCartAsync = createAsyncThunk(
  'cart/resetCart',
  async()=>{
    const response = await resetCart();
    return response.data;
  }
)

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
  },



  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  extraReducers: (builder) => {
    builder
      .addCase(addToCartAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items.push(action.payload);
      })
      .addCase(fetchItemsByUserIdAsync.pending,(state) =>{
        state.status = 'loading';
      })
      .addCase(fetchItemsByUserIdAsync.fulfilled,(state, action)=>{
        state.status = 'idle';
        state.items = action.payload;
        state.cartLoaded = true;
      })
      .addCase(fetchItemsByUserIdAsync.rejected,(state, action)=>{
        state.status = 'idle';
        state.cartLoaded = true;
      })
      .addCase(updateCartAsync.pending,(state)=>{
        state.status = 'loading';
      })
      .addCase(updateCartAsync.fulfilled,(state,action)=>{
        state.status = 'idle';
        const index = state.items.findIndex(item => item.id === action.payload.id)
        state.items[index] = action.payload;
      })
      .addCase(deleteItemFromCartAsync.pending,(state)=>{
        state.status = 'loading';
      })
      .addCase(deleteItemFromCartAsync.fulfilled,(state,action)=>{
        state.status = "idle";
        console.log("cartSlice",action.payload.id)
        const index = state.items.findIndex(item => item.id === action.payload.id)
        state.items.splice(index,1);
      })
      .addCase(resetCartAsync.pending,(state)=>{
        state.status = "loading";
      })
      .addCase(resetCartAsync.fulfilled,(state)=>{
        state.status = "idle";
        state.items = []
      })
  },
});

// export const { increment} = cartSlice.actions;

export const selectItems = (state) => state.cart.items;
export const selectCartStatus = (state) => state.cart.status;
export const selectCartLoaded = (state) => state.cart.cartLoaded;
export default cartSlice.reducer;