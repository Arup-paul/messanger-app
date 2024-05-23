import {Link} from "@inertiajs/react";
import {ArrowLeftIcon} from "@heroicons/react/16/solid/index.js";
import UserAvatar from "@/Components/App/UserAvatar.jsx";
import GroupAvatar from "@/Components/App/GroupAvatar.jsx";

const ConversationHeader = ({ selectConversation }) => {
    console.log(selectConversation)
    return (
        <>
            {
                selectConversation && (
                    <div className="p-2 flex justify-between items-center border-b border-slate-700">
                         <div className="flex items-center gap-3">
                             <Link
                                 href={route('dashboard')}
                                 className="text-slate-200"
                                >
                                <ArrowLeftIcon className="w-6"/>
                             </Link>
                             {
                                 selectConversation.is_user && (
                                     <UserAvatar user={selectConversation} />
                                 )
                             }
                             {
                                 selectConversation.is_group &&  <GroupAvatar />
                             }
                             <div>
                                 <h3>{selectConversation.name}</h3>
                                 {
                                     selectConversation.is_group && (
                                            <p className="text-xs text-slate-200">
                                                {selectConversation.users.length} members
                                            </p>
                                        )
                                 }
                             </div>
                         </div>
                    </div>
                )
            }
        </>
    )
}


export default ConversationHeader
