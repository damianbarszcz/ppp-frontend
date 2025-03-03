import React from "react";

interface MsgSuccessProps {
    message: string
}

const MsgSuccess: React.FC<MsgSuccessProps> = ({ message } : MsgSuccessProps )  => {
    return (
        <div className="global--bg-success text-center p-3" role="alert">
            <span className="global--text-white font-body text-sm font-medium">{message}</span>
        </div>
    );
};

export default MsgSuccess;