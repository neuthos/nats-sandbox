// client/src/App.js
import React, {useState, useEffect} from "react";
import Login from "./components/Login";
import TopicList from "./components/TopicList";
import Conversation from "./components/Conversation";
import MessageInput from "./components/MessageInput";
import {login, getTopics, sendMessage} from "./services/api";
import {setupNotifications} from "./services/notificationService";

function App() {
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user) {
      getTopics().then(setTopics);
      setupNotifications((newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });
    }
  }, [user]);

  const handleLogin = async (username) => {
    const response = await login(username);
    if (response.success) {
      setUser(username);
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setMessages([]); // Clear messages when changing topics
  };

  const handleSendMessage = async (message) => {
    if (selectedTopic && user) {
      await sendMessage(selectedTopic.id, message, user);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <h1>Chat App</h1>
      <p>Welcome, {user}!</p>
      <div style={{display: "flex"}}>
        <TopicList topics={topics} onSelectTopic={handleTopicSelect} />
        <div style={{flex: 1}}>
          {selectedTopic && (
            <>
              <h2>{selectedTopic.name}</h2>
              <Conversation messages={messages} />
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
