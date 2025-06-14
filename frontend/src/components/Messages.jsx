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


    useEffect(() => {
        if (!selectedChat || !user) return;
        axios.get(`${API_BASE_URL}/messages/history/${selectedChat.otherUserId}`, { withCredentials: true })
            .then(res => setChatHistory(res.data.history || []));
    }, [selectedChat, user]);


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
        <div>
            <Navbar />
            <div style={{ display: 'flex', height: '80vh', background: '#f9f9f9' }}>
                {/* Sidebar */}
                <div style={{ width: '320px', borderRight: '1.5px solid #e5e5e5', background: '#fff', overflowY: 'auto' }}>
                    <h2 style={{ padding: '20px', margin: 0, borderBottom: '1.5px solid #e5e5e5' }}>Chats</h2>
                    {(!chats || chats.length === 0) && !selectedChat && <p style={{ padding: '20px' }}>No recent chats.</p>}
                    {/* Show preselected user */}
                    {selectedChat && !chats.some(
                        c => (c.sender_id === user.id && c.receiver_id === selectedChat.otherUserId) ||
                            (c.receiver_id === user.id && c.sender_id === selectedChat.otherUserId)
                    ) && (
                        <div
                            style={{
                                padding: '16px 20px',
                                background: '#E0E7FF',
                                borderBottom: '1px solid #eee'
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
                                    padding: '16px 20px',
                                    cursor: 'pointer',
                                    background: selectedChat && selectedChat.otherUserId === otherUserId ? '#E0E7FF' : '#fff',
                                    borderBottom: '1px solid #eee'
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
                {/* Chat Window */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f4f4fa' }}>
                    <div style={{ padding: '20px', borderBottom: '1.5px solid #e5e5e5', background: '#fff' }}>
                        <h3 style={{ margin: 0 }}>
                            {selectedChat ? `Chat with ${selectedChat.otherUsername}` : 'Select a chat'}
                        </h3>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
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
                                            marginBottom: '12px'
                                        }}
                                    >
                                        <div style={{
                                            background: msg.sender_id === user.id ? '#7C3AED' : '#fff',
                                            color: msg.sender_id === user.id ? '#fff' : '#222',
                                            borderRadius: '16px',
                                            padding: '10px 18px',
                                            maxWidth: '60%',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                                        }}>
                                            {msg.content}
                                            <div style={{ fontSize: '0.8rem', color: '#bbb', marginTop: '4px', textAlign: 'right' }}>
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
                    {/* Message input */}
                    {selectedChat && (
                        <form onSubmit={handleSend} style={{ display: 'flex', padding: '16px', background: '#fff', borderTop: '1.5px solid #e5e5e5' }}>
                            <input
                                type="text"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem',
                                    marginRight: '12px'
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '0 24px',
                                    background: '#7C3AED',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Send
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messages;