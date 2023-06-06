import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import './ChatUI.css';

const ChatUI = () => {
    //const [messages, setMessages] = useState([]);

    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [sources, setSources] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const linksArray = ['Link 1', 'Link 2', 'Link 3'];
    const showModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    // Function to handle user messages
    const handleUserMessage = async () => {
        console.log("called")
        // if (userInput.trim() === '') return;

        const text = userInput.trim();
        addMessageToChat('user', text);
        //const response = await sendMessageToAPI(text);
        const response = await queryBCchatbackend(text);
        //const data = response.choices[0].text;
        const data = response.text;
        const dataWithSources = (
            <>
                {data}{' '}
                <Button onClick={showModal}>
                    sources
                </Button>
            </>
        );
        const sources = response.sources;

        const botReply = dataWithSources; // Adjust this based on your API response structure
        const updatedMessages = [
            ...messages,
            { user: true, content: userInput },
            { user: false, content: botReply },
        ];
        setMessages(updatedMessages);
        setSources(sources);
        //addMessageToChat('assistant', reply);
        setUserInput('');
    };


    const sendMessageToAPI = async (text) => {
        const payload = {
            model: 'text-davinci-003',
            prompt: `User: ${text}\nAssistant:`
        };

        // Send the payload to the OpenAI API endpoint using your preferred HTTP library
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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' // Replace with your OpenAI API key
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data;
    };
    const viewSources = () => {
        // Your function logic here
        console.log('Open sources');
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

    const handleSendMessage = async () => {
        const userInput = document.getElementById('user-input').value.trim();
        if (userInput !== '') {
            const response = await fetch('YOUR_API_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers required for your API
                },
                body: JSON.stringify({ message: userInput }),
            });
            const data = await response.json();
            const botReply = data.reply; // Adjust this based on your API response structure
            const updatedMessages = [
                ...messages,
                { user: true, content: userInput },
                { user: false, content: botReply },
            ];
            setMessages(updatedMessages);
            //document.getElementById('user-input').value = '';
        }
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
                        rows={4}
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
                <Modal visible={modalVisible} onCancel={closeModal} footer={null} width={1200} height={900}>
                    <div className="links-container">
                        {sources.map((link, index) => (
                            <Link key={index} to={`${link.toLowerCase()}`}>
                                {link}
                            </Link>
                        ))}
                    </div>

                </Modal>
            </div>
        </div>
    );
};

export default ChatUI;
