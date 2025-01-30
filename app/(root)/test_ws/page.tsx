"use client";
import { useEffect, useState, FormEvent } from "react";
import { socket } from "../../socket";

// Define types for our message structure
interface ChatMessage {
  text: string;
  userId: string;
  timestamp: string;
}

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on("upgrade", (transport: any) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    // Handle receiving messages
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

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit("message", { text: newMessage });
      setNewMessage("");
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4">
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
      </div>

      {/* Chat Messages */}
      <div className="mb-4 h-96 overflow-y-auto rounded-lg border p-4">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-2 rounded p-2 ${
              msg.userId === socket.id 
                ? 'ml-auto bg-blue-100' 
                : 'bg-gray-100'
            } max-w-[80%]`}
          >
            <p className="text-sm">{msg.text}</p>
            <span className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>

      {/* Message Input */}
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