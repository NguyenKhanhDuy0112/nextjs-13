import { Gender } from "@/constants";
import { UserProfile } from "@/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserProfile = {
  birthday: '',
  created_at: "",
  customer_email_info: [],
  first_name: "",
  gender: Gender.Male,
  id: "",
  last_active: "",
  last_name: "",
  locations: [],
  phone: "",
  updated_at: "",
};

const profileSlice = createSlice({
  name: "profileSlice",
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      return {
        ...state,
        ...action.payload
      }
    },
  },
});

export default profileSlice.reducer;

export const {
  updateProfile
} = profileSlice.actions;
