import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

export const createOrGetChat = createAsyncThunk(
  "chat/createOrGetChat",
  async (receiverId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BASE_API}/api/v1/chat/create`,
        {
          receiverId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchMyChats = createAsyncThunk(
  "chat/fetchMyChats",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_API}/api/v1/chat/my-chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const createChatSlice = createSlice({
  name: "createchat",
  initialState: {
    loading: false,
    error: null,
    chats: [],
    selectedChat: null,
  },
  reducers: {
    SelectedChat: (state, action) => {
      const payload = action.payload;

      // Case 1 → from SearchPage (API response)
      if (payload?.data && payload?.receiver) {
        state.selectedChat = {
          id: payload.data.id,
          User: {
            id: payload.receiver.id,
            name: payload.receiver.name,
            photo: payload.receiver.photo || payload.receiver.imageUrl || null
          }
        };
      }

      // Case 2 → from ChatList click
      else if (payload?.id && payload?.User) {
        state.selectedChat = payload;
      }
    },

  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchMyChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrGetChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrGetChat.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOrGetChat.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { SelectedChat } = createChatSlice.actions;
export default createChatSlice.reducer;
