import React, {useState} from "react";
import Button from "@/app/components/ui/Button";

interface MentorFinderActionsProps{
    isFollowing: boolean;
    onFollowToggle: () => void;
    onSubscribe: () => void;
}

const MentorFinderActions : React.FC<MentorFinderActionsProps> = ({
        isFollowing,
        onFollowToggle,
        onSubscribe,
} : MentorFinderActionsProps) => {
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

    const closeSubscriptionModal = () => {
        setIsSubscriptionModalOpen(false);
    };

    const handleSubscribeFromModal = () => {
        onSubscribe();
        setIsSubscriptionModalOpen(false);
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex items-center justify-end transform -translate-y-[75px]">
            <div className="mr-5">
                <Button type="button" uiType="dark-outline" size="smallSize" onClick={onSubscribe}>Subskrybuj</Button>
            </div>

            <div>
                <Button type="button" uiType="primary" size="smallSize" onClick={onFollowToggle}>{ isFollowing ? 'Obserwowanie' : 'Obserwuj'}</Button>
            </div>
        </div>
    );
}

export default MentorFinderActions;