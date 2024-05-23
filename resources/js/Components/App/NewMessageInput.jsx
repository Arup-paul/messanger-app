import React, {useEffect, useRef} from 'react';

const NewMessageInput = ({value,onChange,onSend}) => {
    const input = useRef();

    const onInputKeyDown = (ev) => {
        if (ev.key === "Enter" && ev.shiftKey){
            ev.preventDefault();
            onSend();
        }
    };

    const onChangeEvent = (ev) => {
        setTimeout(() => {
            adjustHeight();
        },10)
    }

    const adjustHeight = () => {
        setTimeout(() => {
            input.current.style.height = "auto";
            input.current.style.height = input.current.scrollHeight + 1 + "px";
        },100)
    }

    useEffect(() => {
        adjustHeight()
    },[value])


    return (
        <textarea
            ref={input}
            className="input input-bordered min-w-[1080px] rounded-r-none resise-none overflow-y-auto max-h-40"
            value={value}
            onChange={onChange}
            onKeyDown={onInputKeyDown}
            onInput={(ev) => onChangeEvent(ev)}
            placeholder="Type a message..."
            rows="1"
        >
        </textarea>
    );
};

export default NewMessageInput;
