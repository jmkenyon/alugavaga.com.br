import { useEffect } from "react";
import useActiveList from "./useActiveList";
import { pusherClient } from "../libs/pusher";
import { Channel, Members } from "pusher-js";

type PresenceMemberLike = {
  id: string;
  info: unknown;
};

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();

  useEffect(() => {
    // Subscribe to the presence channel
    const channel: Channel = pusherClient.subscribe("presence-messenger");

    // When subscription succeeds, populate initial members
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers: string[] = [];
      members.each((member: PresenceMemberLike) => {
        initialMembers.push(member.id);
      });
      console.log("Initial members:", initialMembers);
      set(initialMembers);
    });

    // Bind member added
    channel.bind("pusher:member_added", (member: PresenceMemberLike) => {
      console.log("Member added:", member.id);
      add(member.id);
    });

    // Bind member removed
    channel.bind("pusher:member_removed", (member: PresenceMemberLike) => {
      console.log("Member removed:", member.id);
      remove(member.id);
    });

    // Cleanup on unmount
    return () => {
        pusherClient.unsubscribe("presence-messenger");
      };
    }, [set, add, remove]);
  };
  
  export default useActiveChannel;