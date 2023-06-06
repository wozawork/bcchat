import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';

import person from './person.png';
import bclogo from './bc-logo.png';
import doculogo from './documents.png';
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ marginRight: '20px' }}>
                    <img src={person} alt="Image" style={{ borderRadius:'10%' ,width: '40px', height: '40px' }} />
                </span>
                {text}{' '}
                </div>
            </>
        )
        addMessageToChat('user', textWithheader);

        const response = await queryBCchatbackend(text);

        const data = response.text;
        const sources = response.sources;
        setSources(sources);

        const dataWithSources = (
            <>
                
                
                <div className='chat-answer'>
                <span style={{ marginRight: '20px' }}>
                    <img src={bclogo} alt="Image" style={{ borderRadius:'10%' ,width: '40px', height: '40px' }} />
                </span>
                {' '}{data}
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <span style={{ marginRight: '20px' }}>
                    <img src={doculogo} alt="Image" style={{ borderRadius:'10%' ,width: '40px', height: '40px' }} />
                </span>
                <div className="links-container">
                    {sources.map((link, index) => (
                        <Link key={index} to={`${link.toLowerCase()}`}>
                            {link}
                        </Link>
                    ))}
                </div>
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
        <div>
            <div className="chat-header">   
            <h2 className="chat-title">BCchat
            </h2> 
            </div>
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


