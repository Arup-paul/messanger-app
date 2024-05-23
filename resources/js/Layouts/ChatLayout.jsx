import {usePage} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {useEffect, useState} from "react";
import {PencilSquareIcon} from "@heroicons/react/16/solid/index.js";
import TextInput from "@/Components/TextInput.jsx";
import ConversationItem from "@/Components/App/ConversationItem.jsx";

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

    const onSearch = (e) => {
       const search = e.target.value.toLowerCase();
       setLocalConversations(
              conversations.filter((conversation) => {
                  return conversation.name.toLowerCase().includes(search)
              }
       ))
    }

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
                    return  b.last_message_date.localeCompare(a.last_message_date);
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
        <div className="flex-1 w-full flex overflow-hidden">
           <div className={`transition-allow-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-hidden
            ${
                selectedConversation ? '-ml-[100%] sm:ml-0' : ' '
           }
           `}>
               <div className="flex items-center justify-between py-2 px-3 text-xl font-medium text-gray-200">
                   My Conversations
                   <div
                       className="tooltip tooltip-left"
                       data-tip="Create New Group"
                       >
                       <button
                           className="text-gray-400 hover:text-gray-200"
                            >
                           <PencilSquareIcon className="w-4 h-4 inline-block ml-2"/>
                       </button>
                   </div>
               </div>
               <div className="p-3">
                 <TextInput
                     onKeyUp={onSearch}
                     placeholder="Filter Users and groups"
                        className="w-full"
                     />
               </div>
               <div className="flex flex-col h-[700px]">

               <div className="flex-1  overflow-y-scroll  "  >
                   {
                       sortedConversations &&
                         sortedConversations.map((conversation) => (
                             <ConversationItem
                                 key={`${
                                     conversation.is_group ? 'group_' : 'user_'
                                 }${conversation.id}`}
                                 conversation={conversation}
                                 online={!!isUsersOnline(conversation.id)}
                                 selectedConversation={selectedConversation}
                              />
                         ))
                   }
               </div>
               </div>

           </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
      </>
   );

};




export default ChatLayout;
