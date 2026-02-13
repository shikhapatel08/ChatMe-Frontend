/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import './ChatListPage.css'
import { useDispatch, useSelector } from 'react-redux'
import profileImg from "../../assets/Profile/profile.svg";
import { fetchMyChats, SelectedChat } from '../../Redux/Features/CreateChat';
import { BlockedUser } from '../../Redux/Features/BlockedSlice';
import { PinedUser } from '../../Redux/Features/Pinslice';
import { MuteUser } from '../../Redux/Features/MuteSlice';
import { Delete } from '../../Redux/Features/DeleteSlice';
import GlobalModal from '../../Components/Global Modal/GlobalModal';
import { useModal } from '../../Context/ModalContext';
import DeleteChatModal from '../../Components/Modal/DeleteChat';
import { toast } from 'react-toastify';
import socket, { getSocket } from "../../Socket.io/socket";
import { addLocalMessage, FetchMessages, MarkChatAsReadLocal, Pinmsg, PinMsg, ReadMsg, SendMessage, Starmsg, StarMsg } from '../../Redux/Features/SendMessage';
import BlockedChatModal from '../../Components/Modal/BlockedUser';
import { useNavigate } from 'react-router-dom';
import { ProfileUser } from '../../Redux/Features/ProfileSlice';
import { store } from "../../Redux/Store/Store";

export default function MessagePage() {
    const dispatch = useDispatch();
    const [FilePreview, setFilePreview] = useState([]);
    const [File, setFile] = useState([]);
    const [text, setText] = useState("");
    // const [typing, setTyping] = useState(false);
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const [onlineUser, setOnlineUser] = useState(new Set());
    const [replyMsg, setReplyMsg] = useState(null);
    let typingTimeout = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const { User } = useSelector(state => state.alluser);
    const user = JSON.parse(
        localStorage.getItem('SigninUser') ||
        localStorage.getItem('SignupUser')
    );
    const { messages } = useSelector(state => state.message);
    const { chats, selectedChat } = useSelector(state => state.createchat);
    const pinnedMessage = messages?.find((msg) => msg.is_pin && msg.chatId === selectedChat?.id);

    const [openMenuId, setOpenMenuId] = useState(null);
    const [openMsgMenu, setOpenMsgMenu] = useState(null);
    const dropdownRef = useRef(null);
    const chatEndRef = useRef(null);
    const chatRefs = useRef({});


    const { openModal, closeModal } = useModal();

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const toggleMsgMenu = (msgId) => {
        setOpenMsgMenu(openMsgMenu === msgId ? null : msgId);
    };

    const handleAttachClick = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 0) {
            const previews = files.map(file => URL.createObjectURL(file));

            setFilePreview(prev => [...prev, ...previews]);
            setFile(prev => [...prev, ...files]);
        }
    };


    const handleProfile = (userId) => {
        navigate(`/ProfilePage/:id`);
        dispatch(ProfileUser(userId));
    };
    useEffect(() => {
        return () => {
            if (FilePreview) URL.revokeObjectURL(FilePreview);
        };
    }, [FilePreview]);

    const removeFile = () => {
        setFile([]);
        setFilePreview([]);
        fileInputRef.current.value = null;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check chat list dropdowns
            const chatMenuOpen = chatRefs.current[openMenuId]?.contains(event.target);
            if (openMenuId && !chatMenuOpen) {
                setOpenMenuId(null);
            }

            const msgBubbleOpen = chatRefs.current[openMsgMenu]?.contains(event.target);
            if (openMsgMenu && !msgBubbleOpen) {
                setOpenMsgMenu(null);
            }

        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuId, openMsgMenu]);

    const JoinUser = user.id;

    // useEffect(() => {
    //     if (!JoinUser) return;
    //     join(JoinUser);
    // }, [JoinUser]);


    useEffect(() => {
        if (!JoinUser) return;

        dispatch(fetchMyChats());
    }, [JoinUser]);


    useEffect(() => {
        if (selectedChat?.id) {
            // dispatch(clearMessages());
            dispatch(FetchMessages(selectedChat.id));
        }
    }, [selectedChat?.id]);


    const sortedChats = [...chats || []].sort((a, b) => {
        if (a.is_pin && !b.is_pin) return -1;
        if (!a.is_pin && b.is_pin) return 1;

        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    const getChatUser = (chat, joinUserId) => {
        return chat.UserOne.id === joinUserId
            ? chat.UserTwo
            : chat.UserOne;
    };


    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end"
            });
        }
    }, [messages?.length]);
    const handelBlocked = (chat) => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <BlockedChatModal
                    onCancel={closeModal}
                    onConfirm={async () => {
                        await dispatch(BlockedUser(chat.id)).then(() => {
                            dispatch(fetchMyChats());
                        });
                        if (chat?.is_blocked) {
                            toast.success("User unblocked!");
                        } else {
                            toast.error("User blocked!");
                        }
                        closeModal();
                    }}
                />
            </GlobalModal>
        )
    };

    const handlePined = (chat) => {
        dispatch(PinedUser(chat.id)).then(() => {
            if (chat?.is_pin) {
                toast.info("Chat unpinned!");
            } else {
                toast.success("Chat pinned!");
            }
            dispatch(fetchMyChats());
        });
    };

    // Handle muting/unmuting
    const handleMuted = (chat) => {
        dispatch(MuteUser(chat.id)).then(() => {
            toast.info(chat?.is_muted ? "User unmuted!" : "User muted!");
            dispatch(fetchMyChats());
        });
    };

    // Add this once in your socket setup (not inside handleMuted)
    socket.on("new_noti", (msg) => {
        // Get the latest chat info from your store to check if muted
        const state = store.getState();
        const chat = state.chats.find((c) => c.id === msg.chat_id);

        if (!chat?.is_muted) {
            toast.success(msg.message);
        }
    });


    const handleDelete = (chat) => {
        openModal(
            <GlobalModal onClose={closeModal}>
                <DeleteChatModal
                    onCancel={closeModal}
                    onConfirm={
                        async () => {
                            await dispatch(Delete(chat.id)).then(() => {
                                dispatch(fetchMyChats());
                            })
                            toast.success('Chat deleted successfully!');
                            closeModal();
                        }
                    }
                />
            </GlobalModal>
        )
    };

    const handleSendMessage = () => {
        if (!text && (!File || File.length === 0)) return;


        dispatch(addLocalMessage({
            id: Date.now(),
            chatId: selectedChat.id,
            text,
            image_url: FilePreview,
            sender_id: user.id,
            is_star: false,
            is_pin: false,
            replyTo: replyMsg || null,
            pending: true,
            createdAt: new Date().toISOString(),
        }));

        dispatch(SendMessage({
            chatId: selectedChat.id,
            messageText: text,
            file: File,
            replyTo: replyMsg?.id || null
        }));

        setReplyMsg("");
        setText("");
        removeFile();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        if (!selectedChat?.id) return;

        const handleTypingListener = (data) => {
            const socketData = JSON.parse(data);

            if (
                Number(socketData.rid) === Number(selectedChat.id) &&
                Number(socketData.uid) !== Number(user.id)
            ) {
                setIsOtherTyping(socketData.typing);

                clearTimeout(typingTimeout.current);
                typingTimeout.current = setTimeout(() => {
                    setIsOtherTyping(false);
                }, 1000);
            }
        };

        socket.on(`${selectedChat.id}_typing`, handleTypingListener);

        return () => {
            socket.off(`${selectedChat.id}_typing`, handleTypingListener);
            clearTimeout(typingTimeout.current);
        };

    }, [selectedChat?.id, user?.id]);
    const handleTypingInput = (e) => {
        setText(e.target.value);
        if (!selectedChat?.id) return;

        const data = JSON.stringify({
            rid: selectedChat.id,
            uid: user.id,
            typing: true
        });

        socket.emit("fe_typing", data);
    };

    const removeSingleFile = (index) => {
        const newPreviews = [...FilePreview];
        const newFiles = [...File];

        URL.revokeObjectURL(newPreviews[index]);

        newPreviews.splice(index, 1);
        newFiles.splice(index, 1);

        setFilePreview(newPreviews);
        setFile(newFiles);
    };

    useEffect(() => {
        if (!user?.id) return;

        const socket = getSocket();

        socket.emit(
            "online_status",
            JSON.stringify({ uid: user.id, on: 1 })
        );

        return () => {
            socket.emit(
                "online_status",
                JSON.stringify({ uid: user.id, on: 0 })
            );
        };
    }, [user?.id]);


    // useEffect(() => {
    //     const socket = getSocket();

    //     const handleOnlineStatus = (data) => {
    //         const parsed = JSON.parse(data);

    //         setOnlineUser((prev) => {
    //             if (parsed.on === 1) {
    //                 // Add if not exists
    //                 if (!prev.includes(parsed.uid)) {
    //                     return [...prev, parsed.uid];
    //                 }
    //             } else {
    //                 // Remove user
    //                 return prev.filter((id) => id !== parsed.uid);
    //             }
    //             return prev;
    //         });
    //     };

    //     socket.on("online_status", handleOnlineStatus);

    //     return () => {
    //         socket.off("online_status", handleOnlineStatus);
    //     };
    // }, []);


    useEffect(() => {
        if (!user?.id) return;

        const socketInstance = getSocket();

        const handleConnect = () => {
            console.log("Socket connected");

            socketInstance.emit(
                "online_status",
                JSON.stringify({ uid: user.id, on: 1 })
            );
        };

        const handleOnlineUsers = (users) => {
            const normalizedUsers = users.map(id => Number(id));
            setOnlineUser(new Set(normalizedUsers));
        };

        const handleOnlineStatus = (data) => {
            const parsed =
                typeof data === "string" ? JSON.parse(data) : data;

            const userId = Number(parsed.uid);

            setOnlineUser((prev) => {
                const updated = new Set(prev);

                if (parsed.on === 1) {
                    updated.add(userId);
                } else {
                    updated.delete(userId);
                }

                return updated;
            });
        };

        socketInstance.on("connect", handleConnect);
        socketInstance.on("online_users", handleOnlineUsers);
        socketInstance.on("online_status", handleOnlineStatus);

        return () => {
            socketInstance.off("connect", handleConnect);
            socketInstance.off("online_users", handleOnlineUsers);
            socketInstance.off("online_status", handleOnlineStatus);

            socketInstance.emit(
                "online_status",
                JSON.stringify({ uid: user.id, on: 0 })
            );
        };
    }, [user?.id]);

    useEffect(() => {
        if (pinnedMessage) {
            localStorage.setItem('PinnedMsg', pinnedMessage.text);
        }
    }, [pinnedMessage]);


    useEffect(() => {
        if (selectedChat?.id && messages.is_read) {
            dispatch(ReadMsg(selectedChat.id));
        }
    }, [selectedChat?.id]);


    const handleChatList = (chat, otherUser) => {

        const chatData = {
            id: chat.id,
            User: otherUser
        };

        dispatch(SelectedChat(chatData));

        socket.emit("open_chat", {
            chatId: chat.id,
            senderId: user.id
        });
    };

    useEffect(() => {
        if (selectedChat?.id) {
            dispatch(MarkChatAsReadLocal(selectedChat.id));
        }
    }, [selectedChat?.id]);



    return (
        <>
            <div className="ChatLayout">
                <div className="Message-container">
                    <div className="Message-detail">
                        <div className="Message">
                            <div className="Message-title">
                                <h2>Messaging</h2>
                            </div>
                            <input
                                placeholder="searching..."
                                className="Message-user-searching"
                            />
                        </div>
                        {sortedChats.map((chat) => {
                            const otherUser = getChatUser(chat, JoinUser);
                            return (
                                <div className="Message-User" key={chat.id} onClick={() => handleChatList(chat, otherUser)} style={{ cursor: "pointer" }}>
                                    {!chat?.is_blocked &&
                                        <>

                                            <div className="Message-Profile-img">
                                                <img src={otherUser?.photo ? otherUser?.photo : profileImg} alt='profile' />
                                                {/* {onlineUser.has(Number(selectedChat?.User?.id)) && <span className="online-dot"></span>} */}
                                            </div>
                                            <div className="Message-Username">
                                                <h2>{otherUser?.name}</h2>
                                            </div>
                                            <div className='Message-right'>
                                                <span>{chat?.is_pin ?
                                                    (<span class="material-symbols-outlined" style={{ color: 'grey' }}>
                                                        keep
                                                    </span>) : ""}</span>
                                                <svg width="15" height="15" viewBox="0 0 24 48" xmlns="http://www.w3.org/2000/svg" onClick={(e) => { e.stopPropagation(); toggleMenu(chat.id); }} ref={dropdownRef}    >
                                                    <circle cx="12" cy="6" r="6" fill="black" />
                                                    <circle cx="12" cy="24" r="6" fill="black" />
                                                    <circle cx="12" cy="42" r="6" fill="black" />
                                                </svg>
                                                {openMenuId === chat.id && (
                                                    <div className="Dropdown-Menu">
                                                        <div className="Dropdown-Item" onMouseDown={() => handleProfile(otherUser.id)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                                                                <circle cx="12" cy="12" r="10" />
                                                                <circle cx="12" cy="9" r="3" />
                                                                <path d="M6.5 18a5.5 5.5 0 0 1 11 0" />
                                                            </svg>
                                                            View Profile
                                                        </div>
                                                        <div className="Dropdown-Item" onMouseDown={() => handlePined(chat)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                                <g transform="rotate(-35 12 12)">
                                                                    <path d="M12 3C10.9 3 10 3.9 10 5V10L7 13V14H11V21L13 19V14H17V13L14 10V5C14 3.9 13.1 3 12 3Z"
                                                                        fill="currentColor" />
                                                                </g>
                                                            </svg>
                                                            {chat?.is_pin ? 'Unpin' : 'Pin'}</div>
                                                        <div className="Dropdown-Item" onMouseDown={() => handleMuted(chat)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                                <path d="M12 4C9.8 4 8 5.8 8 8 V11.5L6.5 14V15H17.5V14L16 11.5V8 C16 5.8 14.2 4 12 4Z"
                                                                    fill="currentColor" />

                                                                <path d="M10 17a2 2 0 0 0 4 0"
                                                                    fill="currentColor" />

                                                                <line x1="7" y1="7" x2="17" y2="17"
                                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                            </svg>

                                                            {chat?.is_muted ? 'Unmute' : "Mute"}</div>
                                                        <div className="Dropdown-Item" style={{ color: 'red' }} onMouseDown={() => handelBlocked(chat)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                                                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                                                                <line x1="9" y1="9" x2="15" y2="15"
                                                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                            </svg>
                                                            {chat?.is_blocked ? 'Unblocked' : 'Blocked'}</div>
                                                        <div className="Dropdown-Item" style={{ color: 'red' }} onMouseDown={() => handleDelete(chat)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <polyline points="9 8 9 17 15 17 15 8" />
                                                                <line x1="10" y1="11" x2="10" y2="15" />
                                                                <line x1="14" y1="11" x2="14" y2="15" />
                                                                <line x1="8" y1="8" x2="16" y2="8" />
                                                                <line x1="10" y1="6" x2="14" y2="6" />
                                                            </svg>

                                                            Delete</div>
                                                    </div>
                                                )}
                                            </div>

                                        </>}

                                </div>
                            )
                        })}

                    </div>
                </div>
                <div className="ConversationPanel-container">

                    {selectedChat ?
                        (<div className="ConversationPanel-User">
                            <div className="ConversationPanel-left">
                                <div className="Message-Profile-img">
                                    <img src={selectedChat.User?.photo ? selectedChat.User?.photo : profileImg} alt='profile' onClick={() => handleProfile(selectedChat?.User?.id)} />
                                </div>
                                <div className="Message-Username">

                                    <h2>{selectedChat ? selectedChat?.User?.name : "Select a user"}</h2>
                                    <p>{onlineUser.has(Number(selectedChat?.User?.id)) ? "online" : <span style={{ color: 'red' }}>offline</span>}</p>
                                </div>
                            </div>
                            <div className="ConversationPanel-right">
                                <div className="ConversationPanel-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="6" width="13" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
                                        <path d="M16 10L21 7V17L16 14V10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                    </svg>

                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 16.92V20a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 6.18 2 2 0 0 1 5 4h3.09a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8.91 12a16 16 0 0 0 6 6l1.57-1.36a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            {pinnedMessage &&
                                <div className='pinned-msg'>
                                    <p style={{ marginLeft: '60px' }}>
                                        <span class="material-symbols-outlined" style={{ color: 'grey' }}>
                                            keep
                                        </span>
                                        {pinnedMessage.text}</p>
                                </div>
                            }

                            <div className='ConversationPanel-middle'>

                                <div className="chat-container">
                                    {messages?.map((msg) => (
                                        <div
                                            key={msg?.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // if (msg.sender_id !== JoinUser) {
                                                toggleMsgMenu(msg.id);
                                                // }
                                            }}
                                            ref={(el) => (chatRefs.current[msg.id] = el)}
                                            className={`chat-bubble ${msg.sender_id === JoinUser ? "right" : "left"}`}
                                        >
                                            {msg.replyTo && (
                                                <div
                                                    className="reply-box"
                                                    onClick={() => {
                                                        const el = chatRefs.current[msg.replyTo.id];
                                                        el?.scrollIntoView({ behavior: "smooth", block: "center" });
                                                    }}
                                                >
                                                    <span className="reply-user">
                                                        {msg.replyTo.sender_id === JoinUser
                                                            ? "You"
                                                            : selectedChat?.User?.name}
                                                    </span>

                                                    <span className="reply-msg">
                                                        {msg.replyTo.text || "📷 Image"}
                                                    </span>
                                                </div>
                                            )}


                                            {msg.text && <span className="chat-text">{msg.text}</span>}

                                            {/* Display all images if exists */}
                                            {msg.image_url && (
                                                <div className={
                                                    msg.image_url.length === 1
                                                        ? "single-image"
                                                        : "multiple-images"
                                                }
                                                >
                                                    {(typeof msg.image_url === "string"
                                                        ? JSON.parse(msg.image_url)
                                                        : msg.image_url
                                                    ).map((img, index) => (
                                                        <img
                                                            key={index}
                                                            src={img}
                                                            alt="chat"
                                                            className="chat-image"
                                                        />
                                                    ))}
                                                </div>
                                            )}



                                            <span className="chat-time">

                                                {msg.is_star && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.857L19.335 24 12 19.897 4.665 24 6 15.28 0 9.423l8.332-1.268L12 .587z" />
                                                    </svg>
                                                )}

                                                <span className="time-and-tick">

                                                    <span className="time">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>

                                                    {!msg.is_receiver && msg.sender_id === JoinUser && (
                                                        msg.is_read ? (
                                                            // BLUE DOUBLE TICK
                                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                                                <path d="M2 13L6 17L14 7" stroke="#b1d9eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M8 13L12 17L20 7" stroke="#b1d9eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        ) : (
                                                            // GRAY SINGLE TICK
                                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                                                <path d="M2 13L6 17L14 7" stroke="#b4b4b4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )
                                                    )}

                                                </span>
                                            </span>


                                            {openMsgMenu === msg.id && (
                                                <div className="Dropdown">
                                                    {msg.sender_id !== JoinUser && (
                                                        <>
                                                            <div
                                                                className="Dropdown-Item"
                                                                onMouseDown={(e) => {
                                                                    e.stopPropagation();
                                                                    dispatch(Starmsg(msg.id));
                                                                    dispatch(StarMsg(msg.id));
                                                                    setOpenMsgMenu(null);
                                                                }}
                                                            >
                                                                {msg.is_star ? 'Unstar' : 'Star'}
                                                            </div>

                                                            <div
                                                                className="Dropdown-Item"
                                                                onMouseDown={(e) => {
                                                                    e.stopPropagation();
                                                                    dispatch(Pinmsg(msg.id));
                                                                    dispatch(PinMsg(msg.id));
                                                                    setOpenMsgMenu(null);
                                                                }}
                                                            >
                                                                {msg.is_pin ? 'Unpin' : 'Pin'}
                                                            </div>
                                                        </>
                                                    )}

                                                    <div
                                                        className="Dropdown-Item"
                                                        onMouseDown={(e) => {
                                                            e.stopPropagation();
                                                            setReplyMsg(msg);
                                                            setOpenMsgMenu(null);
                                                        }}
                                                    >
                                                        Reply
                                                    </div>
                                                </div>
                                            )}


                                        </div>
                                    ))}

                                    {isOtherTyping && (
                                        <div className="typing-wrapper">
                                            <div className="typing-bubble">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    )}

                                    <div ref={chatEndRef} />
                                </div>
                            </div>
                            <div className="ConversationPanel-bottom">
                                <div className="ConversationPanel-serach">
                                    {replyMsg && (
                                        <div className="reply-preview">
                                            <div className="reply-content">
                                                <span className="reply-name">
                                                    {replyMsg.sender_id === JoinUser ? "You" : selectedChat?.User?.name}
                                                </span>
                                                <span className="reply-text">
                                                    {replyMsg.text || "📷 Image"}
                                                </span>
                                            </div>

                                            <span className="reply-close" onClick={() => setReplyMsg(null)}>✕</span>
                                        </div>
                                    )}

                                    <input
                                        type='text'
                                        placeholder="Type Your Message...   "
                                        className="ConversationPanel-serach-input"
                                        value={text}
                                        onChange={handleTypingInput}
                                        onKeyDown={handleKeyPress}
                                    />

                                    {FilePreview.length > 0 && (
                                        <div className="chat-file-preview">
                                            {FilePreview.map((preview, index) => (
                                                <div key={index} className="preview-wrapper">
                                                    <img src={preview} alt="preview" />
                                                    <button
                                                        className="remove-file-btn"
                                                        onClick={() => removeSingleFile(index)}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}



                                    <input
                                        type='file'
                                        multiple
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileUpload}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round" strokeLinejoin="round"
                                        onClick={handleAttachClick}
                                        style={{ cursor: "pointer" }}>
                                        <path d="M9 12l4.5-4.5a3 3 0 1 1 4.2 4.2L11 18a5 5 0 0 1-7.1-7.1l6.4-6.4" />
                                    </svg>


                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16" onClick={handleSendMessage}>
                                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        ) : (
                            <div className="ConversationPanel-placeholder">
                                <h2>Your messages</h2>
                                <p>Send a message to start a chat.</p>
                            </div>
                        )}
                </div>
            </div >
        </>
    )
}