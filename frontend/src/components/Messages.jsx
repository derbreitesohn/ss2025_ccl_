import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const API_BASE_URL = 'http://localhost:3000';

let socket;

function Messages() {
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const chatEndRef = useRef(null);
    const location = useLocation();

    // Fetch current user
    useEffect(() => {
        axios.get(`${API_BASE_URL}/users/me`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    // Fetch recent chats
    useEffect(() => {
        if (!user) return;
        axios.get(`${API_BASE_URL}/messages/recent`, { withCredentials: true })
            .then(res => setChats(res.data.chats || []))
            .finally(() => setLoading(false));
    }, [user]);

    // Pre-select chat if ?user= is present in URL (runs even if no chats)
    useEffect(() => {
        if (!user) return;
        const params = new URLSearchParams(location.search);
        const userParam = params.get('user');
        if (userParam) {
            const otherUserId = Number(userParam);
            const chat = chats.find(
                c => (c.sender_id === user.id && c.receiver_id === otherUserId) ||
                    (c.receiver_id === user.id && c.sender_id === otherUserId)
            );
            if (chat) {
                setSelectedChat({ otherUserId, otherUsername: chat.other_username || `User ${otherUserId}` });
            } else {
                setSelectedChat({ otherUserId, otherUsername: `User ${otherUserId}` });
            }
        }
    }, [chats, location.search, user]);

    // Fetch chat history when a chat is selected
    useEffect(() => {
        if (!selectedChat || !user) return;
        axios.get(`${API_BASE_URL}/messages/history/${selectedChat.otherUserId}`, { withCredentials: true })
            .then(res => setChatHistory(res.data.history || []));
    }, [selectedChat, user]);

    // Setup Socket.IO
    useEffect(() => {
        if (!user) return;
        socket = io(API_BASE_URL, { withCredentials: true });
        socket.emit('register', user.id);

        socket.on('private_message', (msg) => {
            if (selectedChat && msg.senderId === selectedChat.otherUserId) {
                setChatHistory(prev => [...prev, {
                    sender_id: msg.senderId,
                    receiver_id: user.id,
                    content: msg.content,
                    timestamp: msg.timestamp
                }]);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [user, selectedChat]);

    // Scroll to bottom on new message
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedChat) return;
        socket.emit('private_message', {
            senderId: user.id,
            receiverId: selectedChat.otherUserId,
            content: message
        });
        setChatHistory(prev => [...prev, {
            sender_id: user.id,
            receiver_id: selectedChat.otherUserId,
            content: message,
            timestamp: new Date().toISOString()
        }]);
        setMessage('');
    };

    if (loading) return <div><Navbar /><p>Loading...</p></div>;
    if (!user) return <div><Navbar /><p>Please log in to view messages.</p></div>;

    return (
        <div style={{ background: '#fff', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', height: 'calc(100vh - 80px)', background: '#ffffff', padding: '0 0', marginTop: 0 }}>
                {/* Sidebar */}
                <div style={{ width: '370px', borderRight: '1.5px solid #e5e5e5', background: '#fff', overflowY: 'auto', borderRadius: '18px 0 0 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', margin: '32px 0 32px 32px', height: 'calc(100vh - 144px)' }}>
                    <h2 style={{ padding: '28px 24px 18px 24px', margin: 0, borderBottom: '1.5px solid #e5e5e5', fontWeight: 700, fontSize: '1.3rem' }}>Messages</h2>
                    <div>
                        {(!chats || chats.length === 0) && !selectedChat && <p style={{ padding: '24px' }}>No recent chats.</p>}
                        {selectedChat && !chats.some(
                            c => (c.sender_id === user.id && c.receiver_id === selectedChat.otherUserId) ||
                                (c.receiver_id === user.id && c.sender_id === selectedChat.otherUserId)
                        ) && (
                            <div
                                style={{
                                    padding: '18px 24px',
                                    background: '#E0E7FF',
                                    borderBottom: '1px solid #eee',
                                    borderRadius: '12px',
                                    margin: '8px 12px'
                                }}
                            >
                                <strong>{selectedChat.otherUsername}</strong>
                                <div style={{ color: '#888', fontSize: '0.95rem', marginTop: '4px' }}>
                                    Start a new chat!
                                </div>
                            </div>
                        )}
                        {chats.map(chat => {
                            const otherUserId = chat.sender_id === user.id ? chat.receiver_id : chat.sender_id;
                            const otherUsername = chat.other_username || `User ${otherUserId}`;
                            return (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChat({ otherUserId, otherUsername })}
                                    style={{
                                        padding: '18px 24px',
                                        cursor: 'pointer',
                                        background: selectedChat && selectedChat.otherUserId === otherUserId ? '#E0E7FF' : '#fff',
                                        borderBottom: '1px solid #eee',
                                        borderRadius: selectedChat && selectedChat.otherUserId === otherUserId ? '12px' : '0',
                                        margin: '8px 12px',
                                        fontWeight: selectedChat && selectedChat.otherUserId === otherUserId ? 700 : 500
                                    }}
                                >
                                    <strong>{otherUsername}</strong>
                                    <div style={{ color: '#888', fontSize: '0.95rem', marginTop: '4px' }}>
                                        {chat.content.length > 30 ? chat.content.slice(0, 30) + '...' : chat.content}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Chat Window */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: '0 18px 18px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', margin: '32px 32px 32px 0', height: 'calc(100vh - 144px)' }}>
                    <div style={{ padding: '28px 32px 18px 32px', borderBottom: '1.5px solid #e5e5e5', background: '#fff', borderRadius: '0 18px 0 0', fontWeight: 700, fontSize: '1.2rem' }}>
                        {selectedChat ? selectedChat.otherUsername : 'Select a chat'}
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#f4f4fa' }}>
                        {selectedChat ? (
                            chatHistory.length === 0 ? (
                                <p style={{ color: '#888' }}>No messages yet.</p>
                            ) : (
                                chatHistory.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start',
                                            marginBottom: '18px'
                                        }}
                                    >
                                        <div style={{
                                            background: msg.sender_id === user.id ? '#7C3AED' : '#E0E7FF',
                                            color: msg.sender_id === user.id ? '#fff' : '#222',
                                            borderRadius: '16px',
                                            padding: '12px 22px',
                                            maxWidth: '60%',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                                            fontSize: '1.05rem',
                                            wordBreak: 'break-word'
                                        }}>
                                            {msg.content}
                                            <div style={{ fontSize: '0.8rem', color: msg.sender_id === user.id ? '#e0e0e0' : '#888', marginTop: '4px', textAlign: 'right' }}>
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                        ) : (
                            <p style={{ color: '#888' }}>Select a chat to start messaging.</p>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    {/* Message Input */}
                    <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', padding: '18px 32px', borderTop: '1.5px solid #e5e5e5', background: '#fff', borderRadius: '0 0 18px 0' }}>
                        <input
                            type="text"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            style={{ flex: 1, padding: '12px 18px', borderRadius: '24px', border: '1.5px solid #e5e5e5', fontSize: '1.1rem', outline: 'none', marginRight: '12px', background: '#f9f9ff' }}
                        />
                        <button type="submit" style={{ background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, cursor: 'pointer', boxShadow: '0 2px 8px rgba(124,60,237,0.10)' }}>
                            <span role="img" aria-label="Send">➤</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Messages;
