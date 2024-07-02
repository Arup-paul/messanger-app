import React from 'react';
import {isAudio, isImage, isPDF, isPreviewable, isVideo} from "@/helpers.jsx";
import {ArrowDownTrayIcon, PaperClipIcon, PlayCircleIcon} from "@heroicons/react/16/solid";

const MessageAttachments = ({attachments,attachmentClick}) => {

    console.log("attachment",attachments)
    return (
        <>
            {
                attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap justify-end gap-4 ">
                        {
                            attachments.map((attachment,ind) => (
                                <div
                                  onClick={(ev) => attachmentClick(attachment,ind)}
                                  key={attachment.id}
                                  className={
                                    `group flex flex-col items-center justify-center text-gray-500 relative cursor-pointer`
                                      + (isAudio(attachment)
                                         ? 'w-84'
                                          : 'w-32 aspect-square bg-blue-100'
                                      )
                                  }
                                >
                                    {
                                        !isAudio(attachment) && (
                                            <a
                                                onClick={(ev) => ev.stopPropagation()}
                                                // download
                                                href={attachment.url}
                                                className="z-20 opacity-100 group-hover:opacity-100
                                                 transition-all w-8 h-8 flex items-center justify-center
                                                 text-gray-100 bg-gray-700 rounded absoulate right-0 top-cursor-pointer hover:bg-gray-800
                                                "
                                            >
                                                <ArrowDownTrayIcon className="w-4 h-4" />

                                                {
                                                    isImage(attachment) && (
                                                        <img src={attachment.url}
                                                             className="object-contain aspect-square"
                                                             alt=""/>
                                                    )
                                                }
                                                {
                                                    isVideo(attachment) && (
                                                        <div className="relative flex justify-center items-center">
                                                            <PlayCircleIcon className="z-20 absoulate w-16 h-16 text-white opacity-70" />
                                                            <div className="absoulate left-0 top-0 w-full h-full bg-black.50 z-10">
                                                                <video src={attachment.url}></video>

                                                            </div>

                                                        </div>
                                                    )
                                                }
                                                {
                                                    isAudio(attachment) && (
                                                        <div className="relative flex justify-center items-center">
                                                            <audio
                                                                src={attachment.url}
                                                                controls
                                                            >

                                                            </audio>
                                                        </div>
                                                    )
                                                }

                                                {
                                                    isPDF(attachment) && (
                                                        <div className="relative flex justify-center items-center">
                                                            <div className="absoulate left-0 top-0 right-0 bottom-0">
                                                                <iframe
                                                                  src={attachment.url}
                                                                  className="w-full h-full"
                                                                ></iframe>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    !isPreviewable(attachment) && (
                                                        <a onClick={(ev) => ev.stopPropagation()}
                                                           download
                                                           href={attachment.url}
                                                           className="flx flex-col justify-center items-center"
                                                        >
                                                            <PaperClipIcon
                                                                className="w-10 h-10 mb-3" />
                                                            <small>{attachment.name}</small>

                                                        </a>
                                                    )
                                                }


                                            </a>
                                        )
                                    }

                                </div>
                            ))
                        }
                    </div>
                )
            }
        </>
    );
};

export default MessageAttachments;
