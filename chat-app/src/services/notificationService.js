export const setupNotifications = (onMessage) => {
  const eventSource = new EventSource("http://localhost:3001/events");

  eventSource.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onMessage(message);
  };

  return () => {
    eventSource.close();
  };
};
