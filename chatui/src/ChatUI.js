import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import './ChatUI.css';

const ChatUI = () => {

    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [sources, setSources] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // Function to handle user messages
    const handleUserMessage = async () => {

        const text = userInput.trim();

        const textWithheader = (
            <>
                <h4>Question:</h4>
                {text}{' '}
            </>
        )
        addMessageToChat('user', textWithheader);

        const response = await queryBCchatbackend(text);

        const data = response.text;
        const sources = response.sources;
        setSources(sources);

        const dataWithSources = (
            <>
                <h4>Answer:</h4>
                <div className='chat-answer'>
                    {data}{' '}
                </div>
                <br />
                <h4>Sources:</h4>
                <div className="links-container">
                    {sources.map((link, index) => (
                        <Link key={index} to={`${link.toLowerCase()}`}>
                            {link}
                        </Link>
                    ))}
                </div>
            </>
        );


        const botReply = dataWithSources; // Adjust this based on your API response structure
        const updatedMessages = [
            ...messages,
            { user: true, content: textWithheader },
            { user: false, content: botReply },
        ];
        setMessages(updatedMessages);

        //addMessageToChat('assistant', reply);
        setUserInput('');
    };

    const queryBCchatbackend = async (text) => {

        const payload = {
            "text": text
        };
        const response = await fetch('http://localhost:3001/chat/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data;
    };
    const addMessageToChat = (role, content) => {
        const newMessage = { role, content };
        setMessages([...messages, newMessage]);
    };


    return (
        <div><h2 className="chat-title">BCchat</h2> {/* Title element */}
            <div className="chat-container">

                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat-activity ${message.user ? 'user-activity' : 'bot-activity'}`}
                        >
                            <span className="chat-message">{message.content}</span>

                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <Input.TextArea
                        id="user-input"
                        rows={2}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleUserMessage();
                            }
                        }}
                    />
                    <Button type="primary" onClick={handleUserMessage} style={{ marginTop: 10 }}>
                        Ask
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatUI;


