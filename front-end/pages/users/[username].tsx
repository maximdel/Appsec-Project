import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import TeamService from '@services/TeamService';
import UserService from '@services/UserService';
import { Team, User, UserStorage } from '@types';
import LoadingScreen from '@components/loadingScreen';
import ErrorScreen from '@components/errorScreen';
import UserContent from '@components/users/userContent';

const UserPage = () => {
    const router = useRouter();
    const { username } = router.query;
    const { t } = useTranslation();
    const [loggedInUser, setLoggedInUser] = useState<UserStorage | null>(null);
    const [editedUser, setEditedUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchUser = async (username: string): Promise<User> => {
        const response = await UserService.getUserByUsername(username);
        if (!response.ok) {
            const errorMessage = response.status === 401 ? t('permissions.unauthorized') : '';
            throw new Error(errorMessage);
        }
        return response.json();
    };

    const fetchTeams = async (): Promise<Team[]> => {
        const response = await TeamService.getAllTeams();
        if (!response.ok) {
            const errorMessage = response.status === 401 ? t('permissions.unauthorized') : '';
            throw new Error(errorMessage);
        }
        return response.json();
    };

    const {
        data: teams,
        error: teamsError,
        isLoading: isTeamsLoading,
    } = useSWR<Team[]>(isEditing ? `fetchTeams-editing` : null, fetchTeams, {
        refreshInterval: isEditing ? 5000 : 0,
    });

    const {
        data: user,
        isLoading: isUserLoading,
        error: userError,
    } = useSWR<User>(username ? `fetchUser-${username}` : null, () => fetchUser(String(username)), {
        refreshInterval: 10000,
    });

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            if (user) {
                setEditedUser(user);
            }
        } else {
            setEditedUser(null);
        }
    };

    const handleSave = async () => {
        try {
            if (editedUser && JSON.stringify(user) !== JSON.stringify(editedUser)) {
                const response = await UserService.updateUser(editedUser);
                if (response.ok) {
                    await response.json();
                    mutate(`fetchUser-${username}`, editedUser, false);
                    setEditedUser(null);
                    setIsEditing(false);
                } else {
                    const { message } = await response.json();
                    alert(message || t('user.failedToUpdate'));
                }
            } else {
                setIsEditing(false);
                setEditedUser(null);
            }
        } catch {
            alert(t('user.updateError'));
        }
    };

    if (isUserLoading || isTeamsLoading) {
        return <LoadingScreen />;
    }

    if (userError || teamsError) {
        return <ErrorScreen userError={userError} teamsError={teamsError} />;
    }

    return (
        <UserContent
            user={user}
            isEditing={isEditing}
            editedUser={editedUser}
            setEditedUser={setEditedUser}
            teams={teams}
            loggedInUser={loggedInUser}
            username={username}
            handleEditToggle={handleEditToggle}
            handleSave={handleSave}
        />
    );
};

export default UserPage;

export const getServerSideProps = async (context: { locale: any }) => {
    const { locale } = context;
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};
