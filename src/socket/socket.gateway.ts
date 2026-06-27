import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: [
            "http://192.168.1.12:3003",
            "http://localhost:3003",
        ],
        credentials: true,
    },
})
export class SocketGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log("Connected:", client.id);
    }

    handleDisconnect(client: Socket) {
        console.log("Disconnected:", client.id);
    }

    // User joins their own room after login
    @SubscribeMessage("join")
    joinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() body: { userId: string },
    ) {
        client.join(body.userId);

        console.log(`User ${body.userId} joined room`);
    }

    // Called from AdminService
    sendNotification(receiverId: string, notification: any) {
        this.server.to(receiverId).emit("notification", notification);

        console.log(
            `Notification sent to ${receiverId}`
        );
    }

    // Optional: Send notification to everyone
    sendNotificationToAll(notification: any) {
        this.server.emit("notification", notification);
    }
}