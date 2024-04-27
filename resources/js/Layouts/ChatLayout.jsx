import {usePage} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {useEffect, useState} from "react";

const ChatLayout = ({ children }) => {
   const page = usePage();
   const selectedConversation = page.props.selectedConversation;
   const conversations = page.props.conversations;
   const [localConversations,setLocalConversations] = useState(conversations);
   const [sortedConversations,setSortedConversations] = useState([]);
   const [onlineUsers,setOnlineUsers] = useState({});

   const isUsersOnline = (userId) =>  onlineUsers[userId];


   useEffect(() => {
      Echo.join('online')
          .here((users) => {
              const onlineUsersObj = Object.fromEntries(users.map((user) => [user.id,user]));

              setOnlineUsers((prevOnlineUsers) => {
                  return {...prevOnlineUsers,...onlineUsersObj}
              })
          })
          .joining((user) => {
             setOnlineUsers((prevOnlineUsers) => {
                const updateUsers = {...prevOnlineUsers};
                updateUsers[user.id] = user;
                return updateUsers;
             });
          })
          .leaving((user) => {
              setOnlineUsers((prevOnlineUsers) => {
                  const updateUsers = {...prevOnlineUsers};
                  delete updateUsers[user.id];
                  return updateUsers;
              });
          })
          .error((error) => {
              console.error(error);
          })

       return () => {
            Echo.leave('online');
       }
   },[])

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a,b) => {
                if(a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                }else if (a.blocked_at){
                    return 1;
                }else if (b.blocked_at){
                    return -1;
                }

                if (a.last_message_date && b.last_message_date){
                    return  b.last_message_date.localCOmpare(a.last_message_date);
                }else if(a.last_message_date){
                    return -1;
                }else if(b.last_message_date){
                    return 1;
                }else {
                    return 0;
                }
            }),
        )
    },[localConversations])

    useEffect(() => {
        setLocalConversations(conversations)
    },[conversations])

   return (
      <>
       Chatlayout
          <div>{children}</div>
      </>
   );

};




export default ChatLayout;
