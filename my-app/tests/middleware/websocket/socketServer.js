// websocket/socketServer.js
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class WebSocketServer {
    constructor(httpServer) {
        this.wss = new WebSocket.Server({ server: httpServer });
        this.clients = new Map();

        this.wss.on('connection', (ws, req) => {
            // Authentication middleware
            this.authenticateClient(ws, req);

            ws.on('message', (message) => {
                this.handleMessage(ws, message);
            });

            ws.on('close', () => {
                this.removeClient(ws);
            });
        });
    }

    authenticateClient(ws, req) {
        const token = this.extractToken(req);
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            this.clients.set(ws, decoded.id);
        } catch (error) {
            ws.close();
        }
    }

    extractToken(req) {
        const authHeader = req.headers['sec-websocket-protocol'];
        return authHeader && authHeader.split(' ')[1];
    }

    // Broadcast to all clients or specific users
    broadcast(event, data, targetUserId = null) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                const clientUserId = this.clients.get(client);
                
                if (!targetUserId || clientUserId === targetUserId) {
                    client.send(JSON.stringify({
                        event,
                        data
                    }));
                }
            }
        });
    }

    // Handle real-time events
    handleMessage(ws, message) {
        const parsedMessage = JSON.parse(message);
        const userId = this.clients.get(ws);

        switch (parsedMessage.type) {
            case 'PROJECT_UPDATE':
                this.handleProjectUpdate(userId, parsedMessage.data);
                break;
            case 'JOIN_ROOM':
                this.handleRoomJoin(userId, parsedMessage.roomId);
                break;
        }
    }

    handleProjectUpdate(userId, projectData) {
        // Logic for project updates
        this.broadcast('PROJECT_UPDATED', projectData);
    }
}

module.exports = WebSocketServer;