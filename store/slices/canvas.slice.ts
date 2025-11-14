import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mode, Colors, tools } from "@/data/Canvas"; // Import Colors and tools

interface CanvasState {
    selectedMode: string;
    selectedColor: string; // New field
    selectedTool: string;  // New field
}

// Ensure fallbacks for initial state
const initialState: CanvasState = {
    selectedMode: mode[0] || 'canvas',
    selectedColor: Colors[0] || 'black',
    selectedTool: tools[0] || 'pen',
};

const canvasSlice = createSlice({
    name: 'canvas',
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<string>) => {
            state.selectedMode = action.payload;
        },
        // New Reducer for Color
        setColor: (state, action: PayloadAction<string>) => {
            state.selectedColor = action.payload;
        },
        // New Reducer for Tool
        setTool: (state, action: PayloadAction<string>) => {
            state.selectedTool = action.payload;
            console.log(state.selectedTool)
        },
    },
});

export const { setMode, setColor, setTool } = canvasSlice.actions;
export default canvasSlice.reducer;