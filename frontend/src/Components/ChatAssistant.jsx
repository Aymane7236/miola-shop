import React, { useState, useRef, useEffect } from 'react';
import axios from '../axiosConfig';
import { Container, Form, Button, Spinner } from 'react-bootstrap';

function ChatAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chat', { question });
      setMessages(prev => [...prev, { role: 'assistant', text: response.data.answer }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Erreur : impossible de contacter le serveur. Vérifiez que le backend et Ollama sont démarrés.',
          error: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Container className="py-3" style={{ maxWidth: '800px' }}>
      <h3 className="text-white mb-4">
        Assistant IA — MIOLA Shop
      </h3>

      <div
        style={{
          backgroundColor: '#1a1d20',
          borderRadius: '8px',
          padding: '16px',
          minHeight: '400px',
          maxHeight: '400px',
          overflowY: 'auto',
          marginBottom: '16px',
          border: '1px solid #3a3f44'
        }}
      >
        {messages.length === 0 && (
          <p className="text-muted text-center mt-5">
            Posez-moi une question sur l'inventaire des voitures...
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              style={{
                maxWidth: '75%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user'
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px',
                backgroundColor: msg.role === 'user'
                  ? '#0d6efd'
                  : msg.error ? '#5c2020' : '#2a2d30',
                color: '#fff',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="d-flex justify-content-start mb-3">
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '18px 18px 18px 4px',
                backgroundColor: '#2a2d30',
                color: '#adb5bd'
              }}
            >
              <Spinner animation="border" size="sm" className="me-2" />
              Le modèle réfléchit...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="d-flex gap-2">
        <Form.Control
          type="text"
          placeholder="Posez votre question sur les voitures..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          style={{
            backgroundColor: '#2a2d30',
            border: '1px solid #3a3f44',
            color: '#fff'
          }}
        />
        <Button
          variant="primary"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{ minWidth: '100px' }}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Envoyer'}
        </Button>
      </div>
      <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
        Appuyez sur Entrée pour envoyer · llama3.2:1b peut prendre 3-10 secondes
      </p>
    </Container>
  );
}

export default ChatAssistant;
