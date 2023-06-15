import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    bookingId: null, // Add bookingId to the initial state
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            localStorage.clear();
            state.user = action.payload.others;
            state.token = action.payload.token;
        },
        register(state, action) {
            localStorage.clear();
            state.user = action.payload.others;
            state.token = action.payload.token;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.bookingId = null; // Reset bookingId when logging out
            localStorage.clear();
        },
        setBookingId(state, action) { // Add a new reducer to set bookingId
            state.bookingId = action.payload;
        },
    },
});

export const { login, register, logout, setBookingId } = authSlice.actions;

export default authSlice.reducer;
