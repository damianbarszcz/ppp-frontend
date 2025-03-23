import React from "react";

interface MsgSuccessProps {
    message: string
    type: string
}

const Message: React.FC<MsgSuccessProps> = ({ message,type } : MsgSuccessProps )  => {
    return (
        <div className={`${type == 'success' ?  'global--bg-success' : 'global--bg-error'} text-center p-3`} role="alert">
            <span className="global--text-white font-body text-sm font-medium">{message}</span>
        </div>
    );
};

export default Message;