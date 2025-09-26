import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/app/libs/pusher";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const session = await getServerSession(request, response, authOptions);

    if (!session?.user?.email) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const socketId = request.body.socket_id;
    const channel = request.body.channel_name;

    if (!socketId || !channel) {
      return response.status(400).json({ error: "Missing socket_id or channel_name" });
    }

    const data = {
      user_id: session.user.email, 
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

    return response.send(authResponse);
  } catch (error) {
    console.error("Pusher auth error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}