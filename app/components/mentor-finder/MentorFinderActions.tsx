import React  from "react";
import Button from "@/app/components/ui/Button";

interface MentorFinderActionsProps{
    isFollowing: boolean;
    userHasSubscription: boolean;
    onFollowToggle: () => void;
    handleSubscribe: () => void;
}

const MentorFinderActions : React.FC<MentorFinderActionsProps> = ({
        isFollowing,
        onFollowToggle,
        handleSubscribe,
        userHasSubscription
} : MentorFinderActionsProps) => {

    return (
        <div className="w-full max-w-6xl mx-auto flex items-center justify-end transform -translate-y-[75px]">
            <div className="mr-5">
                {
                    userHasSubscription ? (
                        <Button type="button" uiType='light' size="smallSize">Subskrybujesz</Button>
                    ) :(
                        <Button type="button" uiType='dark-outline' size="smallSize" onClick={handleSubscribe}> Subskrybuj</Button>
                    )
                }
            </div>

            <div>
                <Button type="button" uiType={`${isFollowing ? 'light' : 'primary'}`} size="smallSize" onClick={onFollowToggle}>{ isFollowing ? 'Obserwujesz' : 'Obserwuj'}</Button>
            </div>
        </div>
    );
}

export default MentorFinderActions;