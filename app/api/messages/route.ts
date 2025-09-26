import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { sendEmail } from "@/app/libs/email"; // <-- our email helper

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, conversationId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create the new message
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: currentUser.id },
        },
        seen: {
          connect: { id: currentUser.id },
        },
      },
      include: { seen: true, sender: true },
    });

    // Update the conversation's lastMessageAt and messages
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        messages: { connect: { id: newMessage.id } },
      },
      include: {
        users: true,
        messages: { include: { seen: true } },
      },
    });

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    // Notify users via Pusher and send email
    updatedConversation.users.forEach((user) => {
      if (!user.email || user.id === currentUser.id) return; // skip sender

      // Pusher trigger
      pusherServer.trigger(user.email, "conversation:update", {
        id: conversationId,
        messages: [lastMessage],
      });

      // Send email asynchronously
      sendEmail(
        user.email,
        "Nova mensagem em Aluga Vaga",
        `<p>Você recebeu uma nova mensagem de <strong>${currentUser.name}</strong>:</p>
         <p>${message}</p>
         <p><a href="https://www.alugavaga.com.br/mensagens/${conversationId}">Clique aqui para responder</a></p>`
      );
    });

    // Trigger Pusher for real-time new message
    await pusherServer.trigger(conversationId, "messages:new", newMessage);

    return NextResponse.json({ newMessage });
  } catch (error) {
    console.error(error, "ERROR_MESSAGES");
    return new NextResponse("Internal Error", { status: 500 });
  }
}