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
import TeamContent from '@components/team/teamContent';

const TeamPage = () => {
    const router = useRouter();
    const { teamId } = router.query;
    const { t } = useTranslation();

    const [editedTeam, setEditedTeam] = useState<Team | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingPlayer, setIsAddingPlayer] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<UserStorage | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setLoggedInUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchTeam = async (id: number) => {
        const response = await TeamService.getTeamById(id);
        if (!response.ok) {
            const errorMessage = response.status === 401 ? t('permissions.unauthorized') : '';
            throw new Error(errorMessage);
        }
        return response.json();
    };

    const {
        data: team,
        isLoading: isTeamLoading,
        error: teamError,
    } = useSWR<Team>(teamId ? `fetchTeam-${teamId}` : null, () => fetchTeam(Number(teamId)), {
        refreshInterval: 10000,
    });

    const fetchUsersByRole = async (currentCoach: User | null) => {
        const response = await UserService.getUsersByRole('USER');
        if (!response.ok) {
            const errorMessage = response.status === 401 ? t('permissions.unauthorized') : '';
            throw new Error(errorMessage);
        }
        const users = await response.json();
        if (currentCoach && !users.some((user: User) => user.id === currentCoach.id)) {
            users.push(currentCoach);
        }
        return users;
    };

    const {
        data: users,
        error: usersError,
        isLoading: isUsersLoading,
    } = useSWR<User[]>(
        isEditing ? `fetchUsers-editing` : null,
        () => fetchUsersByRole(team?.coach || null),
        {
            refreshInterval: isEditing ? 5000 : 0,
        }
    );

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing && team) {
            setEditedTeam(team);
        } else {
            setEditedTeam(null);
        }
    };

    const handleAddPlayer = async () => {
        if (!selectedUser || !selectedUser.id) {
            alert(t('team.selectUserToAdd'));
            return;
        }
        if (!team || !team.id) {
            alert(t('team.notLoaded'));
            return;
        }
        try {
            const response = await TeamService.addPlayerToTeam(team.id, selectedUser.id);
            if (response.ok) {
                const updatedTeam = await response.json();
                mutate(`fetchTeam-${teamId}`);
                setIsAddingPlayer(false);
                setSelectedUser(null);
            } else {
                const { message } = await response.json();
                alert(message || t('team.failedToAddPlayer'));
            }
        } catch {
            alert(t('team.addPlayerError'));
        }
    };

    const handleRemovePlayer = async (userId: number) => {
        if (!team || !team.id) {
            alert(t('team.notLoaded'));
            return;
        }
        try {
            const response = await TeamService.removePlayerFromTeam(team.id, userId);
            if (response) {
                mutate(`fetchTeam-${teamId}`);
            } else {
                alert(t('team.failedToRemovePlayer'));
            }
        } catch {
            alert(t('team.removePlayerError'));
        }
    };

    const handleSwitchCoach = async () => {
        if (!editedTeam || !editedTeam.coach || !team || !team.id) {
            alert(t('team.selectCoachToSwitch'));
            return;
        }

        try {
            if (editedTeam.coach.id !== undefined) {
                const response = await TeamService.switchCoach(team.id, editedTeam.coach.id);
                if (response.ok) {
                    const updatedTeam = await response.json();
                    mutate(`fetchTeam-${teamId}`, updatedTeam);
                } else {
                    const { message } = await response.json();
                    alert(message || t('team.failedToSwitchCoach'));
                }
            } else {
                alert(t('team.selectCoachToSwitch'));
                return;
            }
        } catch (error) {
            alert(t('team.switchCoachError'));
        }
    };

    const handleSave = async () => {
        try {
            if (editedTeam && JSON.stringify(team) !== JSON.stringify(editedTeam)) {
                const response = await TeamService.updateTeam(editedTeam);
                if (response.ok) {
                    const updatedTeam = await response.json();
                    mutate(`fetchTeam-${teamId}`, updatedTeam, false);
                    setIsEditing(false);
                    setEditedTeam(null);
                } else {
                    const { message } = await response.json();
                    alert(message || t('team.failedToUpdate'));
                }
            } else {
                setIsEditing(false);
                setEditedTeam(null);
            }
        } catch {
            alert(t('team.updateError'));
        }
    };

    if (isTeamLoading || (isEditing && isUsersLoading)) {
        return <LoadingScreen />;
    }

    if (teamError || usersError) {
        return <ErrorScreen userError={teamError || usersError} teamsError={null} />;
    }

    return (
        <TeamContent
            team={team}
            editedTeam={editedTeam}
            setEditedTeam={setEditedTeam}
            isEditing={isEditing}
            isAddingPlayer={isAddingPlayer}
            setIsAddingPlayer={setIsAddingPlayer}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            users={users}
            loggedInUser={loggedInUser}
            username={loggedInUser?.username || ''}
            handleEditToggle={handleEditToggle}
            handleAddPlayer={handleAddPlayer}
            handleRemovePlayer={handleRemovePlayer}
            handleSave={handleSave}
            handleSwitchCoach={handleSwitchCoach}
        />
    );
};

export default TeamPage;

export const getServerSideProps = async (context: { locale: any }) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};
