import ChatLayout from "@/Layouts/ChatLayout.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {useCallback, useEffect, useRef, useState} from "react";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/16/solid/index.js";
import ConversationHeader from "@/Components/App/ConversationHeader.jsx";
import MessageItem from "@/Components/App/MessageItem.jsx";
import MessageInput from "@/Components/App/MessageInput.jsx";
import {useEventBus} from "@/EventBus";

function Home({ selectedConversations = null,messages = null }) {
    const [localMessages,setLocalMessages] = useState([]);
    const [noMoreMessages,setNoMoreMessages] = useState(false);
    const [scrollFromBottom,setScrollFromBottom] = useState(0);
    const messagesCtrRef = useRef(null);
    const lodMoreIntersect = useRef(null);
    const {on} = useEventBus();

    console.log("local",localMessages)

    const loadMoreMessages = useCallback(() => {
        if (noMoreMessages){
            return;
        }

        const firstMessage = localMessages[0];
        console.log("firstMessage",firstMessage)
        axios.get(route('message.loadOlder',firstMessage.id))
            .then(({data}) => {
                console.log("load more messages",data)
                if (data.data.length === 0){
                    setNoMoreMessages(true);
                    return;
                }

                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight;

                console.log("tmpScrollFromBottom",tmpScrollFromBottom)
                setScrollFromBottom(scrollHeight - scrollTop - clientHeight);

                setLocalMessages((prevMessages) =>{
                    return [...data.data.reverse(),...prevMessages];
                });

            });


    },[localMessages,noMoreMessages])




    const messageCreated = (message) => {
        if(
            selectedConversations &&
            selectedConversations.id === message.group_id &&
            selectedConversations.id == message.group_id
        ){
            setLocalMessages((prevMessages) => [...prevMessages,message]);
        }
        if (
            selectedConversations &&
            selectedConversations.is_user &&
            (selectedConversations.id === message.sender_id ||
            selectedConversations.id === message.receiver_id)
        ){
            setLocalMessages((prevMessages) => [...prevMessages,message]);
        }
    }



    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current){
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
            }
        },10);

        const offCreated = on('message.created',messageCreated);

        setScrollFromBottom(0)
        setNoMoreMessages(false);

        return () => {
            offCreated();
        }

    },[selectedConversations])


    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    },[messages])

    useEffect(() => {
        if (messagesCtrRef.current && scrollFromBottom !== null){

            messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight -
                messagesCtrRef.current.offsetHeight -
                scrollFromBottom;

      }
        if (noMoreMessages){
            return;
        }


        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {
                console.log("entry",entry)
                if (entry.isIntersecting) {
                    loadMoreMessages();
                }
            });
        }, { rootMargin: '0px 0px 250px 0px' });


            if (lodMoreIntersect.current){
               setTimeout(() => {
                   observer.observe(lodMoreIntersect.current);
               },100)
            }

            return () => {
                observer.disconnect()
            }

    },[localMessages])

    return (
      <>
          {
              !messages && (
                    <div className="flex  flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                        <div className="text-2xl md:text-4xl p-16 text-slate-200">
                            Please select a conversation to start chatting
                        </div>
                        <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block"/>
                    </div>
              )
          }


          {
                messages && (
                    <>
                       <ConversationHeader
                         selectConversation={selectedConversations}
                       />
                        <div
                            ref={messagesCtrRef}
                            className="flex-1 overflow-y-auto p-5 "
                        >
                            {
                                localMessages.length === 0 && (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="text-lg text-slare-200">
                                            No messages found
                                        </div>
                                    </div>
                                )
                            }
                            {
                                localMessages.length > 0 && (
                                   <div className="flex-1 flex flex-col h-[400px] ">
                                       <div ref={lodMoreIntersect}>     </div>

                                       {
                                             localMessages.map((message) => (
                                                  <MessageItem
                                                    key={message.id}
                                                    message={message}
                                                  />
                                             ))
                                       }


                                   </div>
                                )
                            }
                        </div>
                        <MessageInput conversation={selectedConversations}/>
                    </>
                )

          }
      </>
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout
            user={page.props.auth.user}>
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    )
}


export default Home;
