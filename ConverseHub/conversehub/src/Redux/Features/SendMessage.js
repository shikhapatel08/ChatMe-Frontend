import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

export const SendMessage = createAsyncThunk(
    'message/SendMessage',
    async ({ chatId, messageText, file, replyTo }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("chatId", chatId);
            formData.append("text", messageText);
            if(replyTo !== null && replyTo !== undefined) {
                formData.append("replyTo", replyTo)
            }

            if (file && file.length > 0) {
                file.forEach((f) => {
                    formData.append("images", f);
                });
            }

            const res = await axios.post(
                `${BASE_API}/api/v1/message/send`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // "Content-Type": "multipart/form-data",
                    },
                }
            );

            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);


export const FetchMessages = createAsyncThunk(
    'message/FetchMessages',
    async (chatId, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_API}/api/v1/message/${chatId}`,
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

export const ReadMsg = createAsyncThunk(
    'message/ReadMsg',
    async (msgId, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${BASE_API}/api/v1/message/read/${msgId}`,
                {},
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

export const StarMsg = createAsyncThunk(
    'message/StarMsg',
    async (msgId, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${BASE_API}/api/v1/message/star/${msgId}`,
                {},
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

export const PinMsg = createAsyncThunk(
    'message/PinMsg',
    async (msgId, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${BASE_API}/api/v1/message/pin/${msgId}`,
                {},
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

const MessageSlice = createSlice({
    name: 'message',
    initialState: {
        error: null,
        loading: false,
        messages: [],
    },
    reducers: {
        addLocalMessage: (state, action) => {
            state.messages = [...state.messages, action.payload];
        },
        Starmsg: (state, action) => {
            const msgId = action.payload;
            const msg = state.messages.find(m => Number(m.id) === Number(msgId));
            if (msg) {
                msg.is_star = !msg.is_star;
            }
        },
        Pinmsg: (state, action) => {
            const msgId = action.payload;
            const msg = state.messages.find(m => Number(m.id) === Number(msgId));
            if (msg) {
                msg.is_pin = !msg.is_pin;

            }
        },
        MarkChatAsReadLocal: (state, action) => {
            const chatId = action.payload;

            state.messages.forEach(msg => {
                if (msg.chatId === chatId) {
                    msg.is_read = true;
                }
            });
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(SendMessage.pending, (state) => {
                state.loading = true;
            })
            .addCase(SendMessage.fulfilled, (state) => {
                state.loading = false;
                // const msg = action.payload;
                // state.messages.push({
                //     // ...msg,
                //     chatId: msg.msg?.chatId || msg.msg?.chat_id || msg.chat?.id,
                //     createdAt: msg.createdAt || msg.created_at || new Date().toISOString()
                // });
            })
            .addCase(SendMessage.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(FetchMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                const rawMessages = action.payload.messages || action.payload;

                const msgMap = {};
                rawMessages.forEach(m => {
                    msgMap[m.id] = m;
                });

                state.messages = rawMessages.map(m => {
                    let parsedImages = [];

                    if (m.image_url) {
                        if (Array.isArray(m.image_url)) {
                            parsedImages = m.image_url;
                        } else if (typeof m.image_url === "string") {
                            try {
                                parsedImages = JSON.parse(m.image_url);
                            } catch (error) {
                                parsedImages = [m.image_url];
                                console.log("Error parsing image_url:", error)
                            }
                        }
                    }

                    return {
                        ...m,
                        chatId: m.chatId || m.chat_id,
                        image_url: parsedImages,

                        replyTo: m.reply_to ? msgMap[m.reply_to] : null,
                    };
                });
            })

            .addCase(FetchMessages.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(ReadMsg.fulfilled, (state, action) => {
                const updatedMsg = action.payload.message || action.payload.msg;
                state.messages = state.messages.map((msg) =>
                    msg.id === updatedMsg.id ? updatedMsg : msg
                );
            })

            .addCase(StarMsg.fulfilled, (state, action) => {
                const updatedMsg = action.payload.message || action.payload.msg;
                state.messages = state.messages.map((msg) =>
                    msg.id === updatedMsg.id ? updatedMsg : msg
                );
            })

            .addCase(PinMsg.fulfilled, (state, action) => {
                const updatedMsg = action.payload.message || action.payload.msg;
                state.messages = state.messages.map((msg) =>
                    msg.id === updatedMsg.id ? updatedMsg : msg
                );
            })
    },
});


export const { addLocalMessage, Starmsg, Pinmsg, MarkChatAsReadLocal } = MessageSlice.actions;
export default MessageSlice.reducer;