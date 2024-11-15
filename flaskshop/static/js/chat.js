// Toggle chat window visibility
function toggleChat() {
  const chatWindow = document.getElementById('chatWindow');
  if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
    chatWindow.style.display = 'flex';
  } else {
    chatWindow.style.display = 'none';
  }
}

// Send message to API
async function sendChatMessage(message) {
  try {
    console.log('Sending message:', message);
    
    // Wait for the fetch response
    const response = await fetch('http://127.0.0.1:5001/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Wait for the JSON parsing
    const data = await response.json();
    console.log('Raw API response:', data); // Log the raw response
    
    if (!data || typeof data.response === 'undefined') {
      throw new Error('Invalid response format from API');
    }
    
    return data;
    
  } catch (error) {
    console.error('API Error:', error.message);
    console.error('Full error:', error);
    return null;
  }
}

// Update chat UI with new message
function updateChatUI(message, isReceived = false) {
  const messagesDiv = document.getElementById('chatMessages');
  const messageElement = document.createElement('div');
  messageElement.className = `message ${isReceived ? 'received' : 'sent'}`;
  messageElement.textContent = message;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Handle sending messages
async function handleChatMessage() {
  try {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
      updateChatUI(message);
      input.value = '';
      
      // Wait for the API response
      const response = await sendChatMessage(message);
      console.log('Processed response:', response);
      
      if (response && response.response) {
        updateChatUI(response.response, true);
      } else {
        throw new Error('Invalid or empty response from API');
      }
    }
  } catch (error) {
    console.error('Chat Error:', error.message);
    updateChatUI("Sorry, there was an error processing your message.", true);
  }
}

// Add event listener for Enter key
document.addEventListener('DOMContentLoaded', function() {
  const messageInput = document.getElementById('messageInput');
  if (messageInput) {
    messageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleChatMessage();
      }
    });
  }
}); 