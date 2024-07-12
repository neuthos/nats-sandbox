const API_URL = "http://localhost:3001";

export const login = async (username) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username}),
  });
  return response.json();
};

export const getTopics = async () => {
  const response = await fetch(`${API_URL}/topics`);
  return response.json();
};

export const sendMessage = async (topicId, message, sender) => {
  const response = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({topicId, message, sender}),
  });
  return response.json();
};
