import getConversations from "../actions/getConversations";
import ConversationListWrapper from "./components/ConversationListWrapper";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  return (
    <>
      <ConversationListWrapper initialItems={conversations} />
      {children}
    </>
  );
}
