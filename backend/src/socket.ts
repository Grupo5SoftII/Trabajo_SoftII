import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export class SocketServer {
  private io: SocketIOServer;
  // Map socketId -> { socketId, userId, role, usuario }
  private sockets: Map<string, { socketId: string; userId?: string; role?: string; usuario?: string }> = new Map();
  // Map room -> Set of socketIds
  private rooms: Map<string, Set<string>> = new Map();

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

      // store basic socket info
      this.sockets.set(socket.id, { socketId: socket.id });

      // Handle room creation/joining - accept either roomId string or payload { room, user }
      socket.on('join_room', (payload: any) => {
        try {
          let room: string;
          let user: any = null;
          if (typeof payload === 'string') {
            room = payload;
          } else if (payload && typeof payload === 'object') {
            room = payload.room || payload.roomId || payload.room_id || payload.roomId;
            user = payload.user || payload.usuario || payload.userInfo || null;
            // also support payload.room being the code
            if (!room && payload.roomCode) room = payload.roomCode;
          } else {
            console.warn('join_room received unknown payload', payload);
            return;
          }
          if (!room) return;

          socket.join(room);
          console.log(`User ${socket.id} joined room ${room}`);

          // update maps
          const known = this.sockets.get(socket.id) || { socketId: socket.id };
          if (user) {
            known.userId = user.id || user.usuario || user.userId || known.userId;
            known.role = (user.role || user.tipo || '').toString().toUpperCase();
            known.usuario = user.usuario || user.nombre || known.usuario;
            this.sockets.set(socket.id, known);
          }

          const roomSet = this.rooms.get(room) || new Set<string>();
          roomSet.add(socket.id);
          this.rooms.set(room, roomSet);

          // Broadcast user_joined with richer format including user info if available
          const broadcastPayload: any = {
            socketId: socket.id,
            userId: known.userId || socket.id,
            user: {
              id: known.userId || socket.id,
              usuario: known.usuario || null,
              role: known.role || null
            },
            message: `${known.usuario || known.userId || socket.id} joined room ${room}`
          };
          this.io.to(room).emit('user_joined', broadcastPayload);
        } catch (e) {
          console.error('join_room handler error', e);
        }
      });

      // Handle chat messages
      socket.on('send_message', (data: { room: string; message: string }) => {
        this.io.to(data.room).emit('receive_message', {
          userId: socket.id,
          message: data.message,
          timestamp: new Date()
        });
      });

      // Handle private messages - expect { to: userIdOrSocketId, room, content }
      socket.on('private_message', (data: { to: string; room?: string; content?: string }) => {
        try {
          const to = data?.to;
          const content = data?.content || data?.message;
          if (!to || !content) return;

          // find socket id for target: prefer socketId match, else match known.userId
          let targetSocketId: string | null = null;
          if (this.sockets.has(to)) targetSocketId = to; // direct socket id
          else {
            // search by userId
            for (const [sid, info] of this.sockets.entries()) {
              if (info.userId && info.userId.toString() === to.toString()) {
                targetSocketId = sid;
                break;
              }
            }
          }

          const senderInfo = this.sockets.get(socket.id) || { socketId: socket.id };
          const senderId = senderInfo.userId || socket.id;

          if (targetSocketId) {
            this.io.to(targetSocketId).emit('private_message', { from: senderId, to: to, content });
          } else {
            // target not found; optionally you could emit back an error
            socket.emit('private_message_error', { to, error: 'target_not_found' });
          }
        } catch (e) {
          console.error('private_message handler error', e);
        }
      });

      // Handle leaving room
      socket.on('leave_room', (payload: any) => {
        try {
          let room: string;
          if (typeof payload === 'string') room = payload;
          else room = payload?.room || payload?.roomId;
          if (!room) return;
          socket.leave(room);
          console.log(`User ${socket.id} left room ${room}`);

          // remove from room map
          const roomSet = this.rooms.get(room);
          if (roomSet) {
            roomSet.delete(socket.id);
            this.rooms.set(room, roomSet);
          }

          const info = this.sockets.get(socket.id) || { socketId: socket.id };
          const payloadOut = {
            socketId: socket.id,
            userId: info.userId || socket.id,
            user: { id: info.userId || socket.id, usuario: info.usuario || null, role: info.role || null },
            message: `${info.usuario || info.userId || socket.id} left room ${room}`
          };
          this.io.to(room).emit('user_left', payloadOut);
        } catch (e) {
          console.error('leave_room handler error', e);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        try {
          console.log('User disconnected:', socket.id);
          // remove from any rooms and notify
          const info = this.sockets.get(socket.id) || { socketId: socket.id };
          // iterate rooms
          for (const [room, set] of this.rooms.entries()) {
            if (set.has(socket.id)) {
              set.delete(socket.id);
              this.rooms.set(room, set);
              const payloadOut = {
                socketId: socket.id,
                userId: info.userId || socket.id,
                user: { id: info.userId || socket.id, usuario: info.usuario || null, role: info.role || null },
                message: `${info.usuario || info.userId || socket.id} disconnected from room ${room}`
              };
              this.io.to(room).emit('user_left', payloadOut);
            }
          }
          this.sockets.delete(socket.id);
        } catch (e) {
          console.error('disconnect handler error', e);
        }
      });
    });
  }

  // Method to broadcast to a specific room
  public broadcastToRoom(room: string, event: string, data: any) {
    this.io.to(room).emit(event, data);
  }
}