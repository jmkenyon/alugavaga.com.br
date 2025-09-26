import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.userId) {
      return new NextResponse("Missing userId", { status: 400 });
    }

    const { userId } = body;

    // Find existing conversation
    const existingConversations = await prisma.conversation.findMany({
      where: {
        userIds: {
          hasEvery: [currentUser.id, userId], // ✅ better than equals
        },
      },
    });

    if (existingConversations.length > 0) {
      return NextResponse.json(existingConversations[0]);
    }

    // Create new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [{ id: currentUser.id }, { id: userId }],
        },
      },
      include: { users: true },
    });

    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation)
      }
    })

    return NextResponse.json(newConversation);
  } catch (error) {
    console.error("❌ Conversation creation failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}