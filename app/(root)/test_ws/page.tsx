"use client";
import { useEffect, useState, FormEvent } from "react";
import { socket } from "../../socket";

interface ChatMessage {
  text: string;
  userId: string;
  timestamp: string;
  username: string;  // Add username to message interface
}

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isUsernameSet, setIsUsernameSet] = useState<boolean>(false);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      console.log("Some Info about the current user that is")
      socket.io.engine.on("upgrade", (transport: any) => {
        setTransport(transport.name);
      });
    }
    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }
    function onMessage(message: ChatMessage) {
      setMessages(prev => [...prev, message]);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
    };
  }, []);

  const handleUsernameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
      // Emit a username set event to the server if needed
      socket.emit("setUsername", username);
    }
  };

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit("message", { text: newMessage, username });
      setNewMessage("");
    }
  };

  if (!isUsernameSet) {

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl">Enter your username</h2>
          <form onSubmit={handleUsernameSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="rounded border p-2"
              autoFocus
            />
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4">
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
        <p>Username: {username}</p>
      </div>
      <div className="mb-4 h-96 overflow-y-auto rounded-lg border p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 rounded p-2 ${
              msg.userId === socket.id ? 'ml-auto bg-blue-100' : 'bg-gray-100'
            } max-w-[80%]`}
          >
            <p className="text-xs font-bold">{msg.username}</p>
            <p className="text-sm">{msg.text}</p>
            <span className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded border p-2"
        />
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}