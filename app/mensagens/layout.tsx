import getConversations from "../actions/getConversations";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  return (
      <div className="h-full">
        <ConversationList initialItems={conversations} />
        {children}
      </div>
  );
}
