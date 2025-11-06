import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export class SocketServer {
  private io: SocketIOServer;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        // allow common dev origins (CRA default 3000 and the alternate 3002 we used for testing)
        origin: ["http://localhost:3000", "http://localhost:3002"],
        methods: ["GET", "POST"]
      }
    });

    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      // Handle room creation/joining
      socket.on('join_room', (roomId: string) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        
        // Notify room members
        this.io.to(roomId).emit('user_joined', {
          userId: socket.id,
          message: `User joined room ${roomId}`
        });
      });

      // Handle chat messages
      socket.on('send_message', (data: { room: string; message: string }) => {
        this.io.to(data.room).emit('receive_message', {
          userId: socket.id,
          message: data.message,
          timestamp: new Date()
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });

      // Handle leaving room
      socket.on('leave_room', (roomId: string) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
        
        // Notify room members
        this.io.to(roomId).emit('user_left', {
          userId: socket.id,
          message: `User left room ${roomId}`
        });
      });
    });
  }

  // Method to broadcast to a specific room
  public broadcastToRoom(room: string, event: string, data: any) {
    this.io.to(room).emit(event, data);
  }
}