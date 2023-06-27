import { configureStore } from "@reduxjs/toolkit"
import generalSlice from './generalSlice';

const store = configureStore({
    reducer: {
        general: generalSlice.reducer
    }
});

export default store;
