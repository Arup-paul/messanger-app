import {usePage}  from  "@inertiajs/react";
import UserAvatar from "@/Components/App/UserAvatar.jsx";
import {formatMessageDateLong} from "@/helpers.jsx";
import ReactMarkdown from 'react-markdown';
import MessageAttachments from "./MessageAttachments";


const MessageItem = ({ message,attachmentClick }) => {
    const currentUser = usePage().props.auth.user;



    return (
        <>
          <div className={
              "chat " + (message.user_id === currentUser.id ? "chat-end" : "chat-start")
          }>
              {
                  <UserAvatar user={message.sender}/>
              }

              <div className="chat-header">
                  {
                      message.sender_id !== currentUser.id
                        ? message.sender.name
                          : ""
                  }
                  <time className="text-xs opacity-50 ml-2">
                      {formatMessageDateLong(message.created_at)}
                  </time>
              </div>

              <div className={
                  "chat-bubble relative " +
                  (message.sender_id === currentUser.id
                    ? " chat-bubble-primary" : "")
              }>
                  <div className="chat-message">
                      <div className="chat-message-content">
                          <ReactMarkdown>{message?.message}</ReactMarkdown>
                      </div>
                      <MessageAttachments
                          attachments={message.attachments}
                          attachmentClick={attachmentClick}
                          />
                  </div>

              </div>

          </div>
        </>
    )
}

export default MessageItem;
