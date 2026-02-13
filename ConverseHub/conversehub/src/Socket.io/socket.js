import { io } from "socket.io-client";
import { store } from "../Redux/Store/Store";
import { addLocalMessage } from "../Redux/Features/SendMessage";

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: true,
  auth: {
    token: localStorage.getItem('token')
  }
});

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

// export const join = (userId) => {
//   if (socket.connected) {
//     socket.emit("join", userId);
//   } else {
//     socket.once("connect", () => {
//       socket.emit("join", userId);
//     });
//   }
// };

socket.on("new_message", (message) => {
  const msg = message.msg || message;

  const myId =
    JSON.parse(localStorage.getItem("SigninUser"))?.id ||
    JSON.parse(localStorage.getItem("SignupUser"))?.id;

  if (msg.sender_id === myId) return;

  store.dispatch(
    addLocalMessage({
      id: msg.id,
      chat_id: msg.chat_id,
      text: msg.text,
      image_url:
        typeof msg.image_url === "string"
          ? JSON.parse(msg.image_url)
          : msg.image_url,
      is_star: false,
      is_pin: false,
      replyTo: msg.reply_to || null,
      sender_id: msg.sender_id,
      createdAt: msg.createdAt,
    })
  );
});



export const getSocket = () => socket;

export default socket;