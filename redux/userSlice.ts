import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  email: string;
  uid: string;
  name?: string;
  age?: number;
  sex?: string;
}

const initialState: UserState = {
  email: '',
  uid: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.name = action.payload.name;
      state.age = action.payload.age;
      state.sex = action.payload.sex;
    },
    clearUser: (state) => {
      state.email = '';
      state.uid = '';
      state.name = undefined;
      state.age = undefined;
      state.sex = undefined;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
