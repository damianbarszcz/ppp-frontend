export const API_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_NEST_URL || 'http://localhost:8000',
    endpoints: {
        //Auth routes
        auth:{
            handleLogin: '/api/auth/login',
            handleRegister: '/api/auth/register',
        },
        //User routes
        user:{
            fetchMentor: '/api/users/username/'
        },

        //Profile routes
        profile:{
            getProspectorProfile: '/api/prospector-profile/get/user/',
            updateProspectorProfile: '/api/prospector-profile/update/user/',
            publishProspectorProfile: '/api/prospector-profile/create',
        },

        //Settings routes
        settings:{
            changeName: '/api/settings/personal-data/name',
            changeUsername: '/api/settings/personal-data/username',
            changeBiogram: '/api/settings/personal-data/biogram',
            changePassword: '/api/settings/personal-data/password',
        },
        //Article routes
        article:{
            getArticles: '/api/articles/mentor/',
            createArticle: '/api/articles/create',
        },
        //Follower routes
        follower:{
            getFollowers: '/api/followers/',
        },
        //ManagePlan routes
        managePlan:{
            createMentorPlusSession: '/api/subscriptions/mentor-plus-session',
            handlePayment: '/api/subscriptions/process-payment',
        },

        //Notification routes
        notification:{
            fetchNotify: '/api/notification/',
        },


        //Contact routes
        contact:{
            fetchYourContacts: '/api/contact/accepted/user/',
            fetchYourInvitations: '/api/contact/pending/user/',
            getReceivedInvitations: '/api/contact/invitations/user/',
            sendContactInvitation: '/api/contact/invitation/send/',
            acceptContactInvitation: '/api/contact/invitation/accept/',
            rejectContactInvitation: '/api/contact/invitation/reject/',
        },

        //Team routes
        team:{
            fetchTeams: '/api/team/user/',
            handleCreateTeam: '/api/team/create',
            fetchSingleTeam: '/api/team/',
        },

        //Channel routes
        channel:{
            fetchTeamMessages: '/api/message/team/',
            fetchActiveParticipants: '/api/channel/team/active-participants/',
            joinChannel: '/api/channel/team/join/',
            leaveChannel: '/api/channel/team/leave/',
            sendMessage: '/api/message/team/',
        }
    },
} as const;