// ============================================
// Chat Functionality
// ============================================

let currentConnectionId = null;
let currentReceiverId = null;
let pollInterval = null;
let currentConnections = [];

// ============================================
// Load Conversations
// ============================================

async function loadConversations(selectedConnectionId = null) {
    try {
        const userId = currentUser ? currentUser.id : '';
        const response = await fetch(`/api/chat/connections?user_id=${userId}`);
        const data = await response.json();

        if (data.success) {
            const container = document.getElementById('conversations-list');
            container.innerHTML = '';

            if (data.connections.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-center py-4">No connections yet</p>';
                return [];
            }

            currentConnections = data.connections;
            let autoSelect = null;
            data.connections.forEach(conn => {
                const convDiv = document.createElement('div');
                convDiv.className = 'p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition';
                convDiv.onclick = () => selectConversation(conn.connection_id, conn.user_id, conn.name);

                convDiv.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            ${conn.name.charAt(0)}
                        </div>
                        <div class="flex-1">
                            <p class="font-semibold text-gray-800 dark:text-gray-200">${conn.name}</p>
                            <p class="text-sm text-gray-500">${conn.role.charAt(0).toUpperCase() + conn.role.slice(1)}</p>
                        </div>
                    </div>
                `;

                container.appendChild(convDiv);

                if (selectedConnectionId && conn.connection_id === selectedConnectionId) {
                    autoSelect = conn;
                }
            });

            if (autoSelect) {
                selectConversation(autoSelect.connection_id, autoSelect.user_id, autoSelect.name);
            }
            return currentConnections;
        } else {
            showMessage(data.message, 'error');
            return [];
        }
    } catch (error) {
        console.error('Error loading connections:', error);
        showMessage('Failed to load connections', 'error');
        return [];
    }
}

// ============================================
// Select Conversation
// ============================================

function selectConversation(connectionId, receiverId, receiverName) {
    currentConnectionId = connectionId;
    currentReceiverId = receiverId;

    document.getElementById('chat-with').textContent = `Chat with ${receiverName}`;
    document.getElementById('chat-header').classList.remove('hidden');
    document.getElementById('chat-input').classList.remove('hidden');

    loadMessages();

    // Start polling for new messages
    if (pollInterval) clearInterval(pollInterval);
    pollInterval = setInterval(loadMessages, 2000);
}

// ============================================
// Load Messages
// ============================================

async function loadMessages() {
    if (!currentConnectionId) return;

    try {
        const userId = currentUser ? currentUser.id : '';
        const response = await fetch(`/api/chat/messages/${currentConnectionId}?user_id=${userId}`);
        const data = await response.json();

        if (data.success) {
            const container = document.getElementById('messages-container');
            container.innerHTML = '';

            if (!data.messages || data.messages.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-center py-4">Start Conversation</p>';
                return;
            }

            data.messages.forEach(msg => {
                try {
                    const msgDiv = document.createElement('div');
                    if (!currentUser || !currentUser.id) {
                        console.warn('currentUser not properly initialized');
                        return;
                    }
                    
                    const isSent = msg.sender_id === currentUser.id;
                    msgDiv.className = `flex ${isSent ? 'justify-end' : 'justify-start'}`;

                    msgDiv.innerHTML = `
                        <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isSent ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}">
                            <p>${msg.message}</p>
                            <p class="text-xs mt-1 opacity-70">${new Date(msg.timestamp).toLocaleString()}</p>
                        </div>
                    `;

                    container.appendChild(msgDiv);
                } catch (msgError) {
                    console.error('Error rendering message:', msgError, msg);
                }
            });

            // Scroll to bottom
            container.scrollTop = container.scrollHeight;
        } else {
            console.error('Messages API error:', data);
            showMessage(data.message || 'Failed to load messages', 'error');
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        showMessage('Failed to load messages', 'error');
    }
}

// ============================================
// Send Message
// ============================================

async function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();

    if (!message || !currentConnectionId || !currentReceiverId) return;

    try {
        const userId = currentUser ? currentUser.id : '';
        const response = await fetch('/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                connection_id: currentConnectionId,
                receiver_id: currentReceiverId,
                sender_id: userId,
                message: message
            })
        });

        const data = await response.json();

        if (data.success) {
            input.value = '';
            loadMessages(); // Refresh messages immediately
        } else {
            showMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showMessage('Failed to send message', 'error');
    }
}

// ============================================
// Event Listeners
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Load conversations when page loads
    if (document.getElementById('chat-page')) {
        const params = new URLSearchParams(window.location.search);
        const selectedConnection = params.get('connection');
        loadConversations(selectedConnection);
    }

    // Send message on button click
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    // Send message on Enter key
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// ============================================
// Cleanup on page change
// ============================================

function cleanupChat() {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
    currentConnectionId = null;
    currentReceiverId = null;
}