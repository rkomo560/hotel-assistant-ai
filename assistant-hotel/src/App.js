import React, { useState, useEffect, useRef } from "react";

function Message({ message }) {
  const isUser = message.sender === "user";
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        margin: "10px 15px",
      }}
    >
      <div
        style={{
          backgroundColor: isUser ? "#004080" : "#e5e5e5",
          color: isUser ? "white" : "black",
          padding: "12px 18px",
          borderRadius: "15px",
          maxWidth: "70%",
          whiteSpace: "pre-wrap",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          fontSize: "15px",
        }}
        role="log"
        aria-live="polite"
      >
        {!isUser && (
          <span style={{ marginRight: "8px" }} aria-hidden="true">
            🛎️
          </span>
        )}
        {message.text}
        <div
          style={{
            fontSize: "12px",
            color: isUser ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.5)",
            marginTop: "5px",
            textAlign: "right",
          }}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}

function TypingAnimation() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        margin: "10px 15px",
      }}
    >
      <div
        style={{
          backgroundColor: "#e5e5e5",
          padding: "12px 18px",
          borderRadius: "15px",
          maxWidth: "70%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: "8px" }} aria-hidden="true">
          🛎️
        </span>
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            backgroundColor: "#555",
            borderRadius: "50%",
            margin: "0 2px",
            animation: "dotFlashing 1s infinite alternate",
          }}
        ></span>
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            backgroundColor: "#555",
            borderRadius: "50%",
            margin: "0 2px",
            animation: "dotFlashing 1s infinite alternate 0.3s",
          }}
        ></span>
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            backgroundColor: "#555",
            borderRadius: "50%",
            margin: "0 2px",
            animation: "dotFlashing 1s infinite alternate 0.6s",
          }}
        ></span>
      </div>
    </div>
  );
}

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Questions prédéfinies pour les clients de l'hôtel
  const suggestedQuestions = [
    "Quels sont les horaires du petit-déjeuner ?",
    "Comment réserver une séance au spa ?",
    "Y a-t-il une navette pour l'aéroport ?",
  ];

  // Auto-scroll vers le dernier message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const envoyerQuestion = async (q) => {
    if (q.trim() === "") return;

    // Ajouter la question à l'historique avec timestamp
    const newMessages = [
      ...messages,
      { sender: "user", text: q, timestamp: Date.now() },
    ];
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      const data = await response.json();
      setMessages((msgs) => [
        ...msgs,
        { sender: "assistant", text: data.answer, timestamp: Date.now() },
      ]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "assistant",
          text: "⚠️ Une erreur est survenue. Veuillez réessayer.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (q) => {
    envoyerQuestion(q);
  };

  const clearHistory = () => {
    setMessages([]);
  };

  return (
    <div style={{ margin: "40px", fontFamily: "Arial, sans-serif", maxWidth: "800px" }}>
      <h1 style={{ color: "#004080", fontSize: "24px" }}>
        Assistant IA – Hôtel Marriott Jnan Palace, Fès
      </h1>

      {/* Suggestions de questions */}
      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {suggestedQuestions.map((q, index) => (
          <button
            key={index}
            onClick={() => handleSuggestedQuestion(q)}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "20px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#e0e0e0")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
            aria-label={`Poser la question : ${q}`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Bouton pour effacer l'historique */}
      <button
        onClick={clearHistory}
        style={{
          padding: "8px 12px",
          fontSize: "14px",
          backgroundColor: "#ff4d4d",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "15px",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#e63939")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#ff4d4d")}
        aria-label="Effacer l'historique des messages"
      >
        Effacer l'historique
      </button>

      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          height: "500px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
          marginBottom: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
        }}
      >
        {messages.map((msg, i) => (
          <Message key={i} message={msg} />
        ))}
        {loading && <TypingAnimation />}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          envoyerQuestion(question);
        }}
        style={{ display: "flex", gap: "10px" }}
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Posez votre question ici"
          style={{
            flex: 1,
            padding: "12px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#004080")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          aria-label="Champ de saisie pour poser une question"
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            backgroundColor: loading ? "#cccccc" : "#004080",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#003366")}
          onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "#004080")}
          aria-label="Envoyer la question"
        >
          Envoyer
        </button>
      </form>

      {/* CSS pour l'animation des points */}
      <style>
        {`
          @keyframes dotFlashing {
            0% { opacity: 0.2; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default App;