// store/slices/employees.slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee } from "../types/user";
import { addEmployee, deleteEmployee, getEmployees, updateEmployee } from "@/services/employees.service";

interface EmployeesState {
    employees: Employee[];
    error: string;
    selectedEmployee: Employee | null;
    loading: boolean; // Simplified to boolean for easier UI handling
}

const initialState: EmployeesState = {
    employees: [],
    error: '',
    selectedEmployee: null,
    loading: false
}

// Thunks
export const fetchEmployeesThunk = createAsyncThunk(
    'employees/fetchEmployees',
    async (_, { rejectWithValue }) => {
        try {
            // This now awaits a Promise<Employee[]> 
            const data = await getEmployees();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch employees');
        }
    }
)

export const addEmployeeThunk = createAsyncThunk(
    'employees/addEmployee',
    async (newEmployee: Partial<Employee> | FormData, { rejectWithValue }) => {
        try {
            // Call service to add employee
            const createdEmployee = await addEmployee(newEmployee);
            return createdEmployee;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to add employee');
        }
    }
);

export const updateEmployeeThunk = createAsyncThunk(
    'employees/updateEmployee',
    async ({ id, data }: { id: string, data: Partial<Employee> | FormData }, { rejectWithValue }) => {
        try {
            // Call service to update employee
            const employee = await updateEmployee(data, id);
            return employee;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update employee');
        }
    }
);

export const deleteEmployeeThunk = createAsyncThunk(
    'employees/deleteEmployee',
    async (employeeId: string, { rejectWithValue }) => {
        try {
            // Call service to delete employee
            await deleteEmployee(employeeId);
            return employeeId;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete employee');
        }
    }
);
// Slice
const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        // Optional: Action to clear error manually
        clearError: (state) => {
            state.error = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployeesThunk.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(fetchEmployeesThunk.fulfilled, (state, action: PayloadAction<Employee[]>) => {
                state.loading = false;
                // Since the service now extracts the array, action.payload IS the array
                state.employees = action.payload;
            })
            .addCase(fetchEmployeesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                console.log("Redux Error:", action.payload);
            })
            .addCase(addEmployeeThunk.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(addEmployeeThunk.fulfilled, (state, action: PayloadAction<Employee>) => {
                state.loading = false;
                state.employees.push(action.payload);
            })
            .addCase(addEmployeeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                console.log("Redux Error:", action.payload);
            })
            .addCase(updateEmployeeThunk.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(updateEmployeeThunk.fulfilled, (state, action: PayloadAction<Employee>) => {
                state.loading = false;
                const index = state.employees.findIndex(emp => emp._id === action.payload._id);
                if (index !== -1) {
                    state.employees[index] = action.payload;
                }
            })
            .addCase(updateEmployeeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                console.log("Redux Error:", action.payload);
            }).
            addCase(deleteEmployeeThunk.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(deleteEmployeeThunk.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.employees = state.employees.filter(emp => emp._id !== action.payload);
            })
            .addCase(deleteEmployeeThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                console.log("Redux Error:", action.payload);
            });
    }
});

export const { clearError } = employeesSlice.actions;
export default employeesSlice.reducer;