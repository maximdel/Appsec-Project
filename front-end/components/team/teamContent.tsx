import EditButtons from '@components/EditButtons';
import Header from '@components/header/header';
import LatestMatches from '@components/team/latestMatches';
import { Team, User, UserStorage } from '@types';
import { TrashIcon } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

const TeamContent = ({
    team,
    editedTeam,
    setEditedTeam,
    isEditing,
    isAddingPlayer,
    setIsAddingPlayer,
    selectedUser,
    setSelectedUser,
    loggedInUser,
    username,
    users,
    handleEditToggle,
    handleAddPlayer,
    handleRemovePlayer,
    handleSave,
    handleSwitchCoach,
}: {
    team: Team | undefined;
    editedTeam: Team | null;
    setEditedTeam: (team: Team | null) => void;
    isEditing: boolean;
    isAddingPlayer: boolean;
    setIsAddingPlayer: (val: boolean) => void;
    selectedUser: User | null;
    loggedInUser: UserStorage | null;
    username: string | string[] | undefined;

    setSelectedUser: (user: User | null) => void;
    users: User[] | undefined;
    handleEditToggle: () => void;
    handleAddPlayer: () => void;
    handleRemovePlayer: (userId: number) => void;
    handleSave: () => void;
    handleSwitchCoach: () => Promise<void>;
}) => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{`${t('app.title')} - ${t('team.title')}`}</title>
                <meta name="description" content={t('team.details')} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
                <h1 className="text-2xl font-bold text-gray-800">{t('team.teamDetails')}</h1>

                {team ? (
                    <div className="flex flex-col lg:flex-row max-w-6xl w-full gap-8 mt-6">
                        <div className="flex flex-col lg:w-2/3 gap-6">
                            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {t('team.name')}
                                </h2>
                                {isEditing ? (
                                    <input
                                        className="w-full p-2 border rounded-lg"
                                        value={editedTeam?.name || ''}
                                        onChange={(e) =>
                                            setEditedTeam({
                                                ...editedTeam,
                                                name: e.target.value,
                                            } as Team)
                                        }
                                    />
                                ) : (
                                    <p className="text-gray-600">{team.name}</p>
                                )}
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {t('team.description')}
                                </h2>
                                {isEditing ? (
                                    <textarea
                                        className="w-full p-2 border rounded-lg"
                                        value={editedTeam?.description || ''}
                                        onChange={(e) =>
                                            setEditedTeam({
                                                ...editedTeam,
                                                description: e.target.value,
                                            } as Team)
                                        }
                                        placeholder={t('team.enterDescription')}
                                    />
                                ) : (
                                    <p className="text-gray-600">{team.description}</p>
                                )}
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {t('team.coach')}
                                </h2>
                                {isEditing ? (
                                    <div className="flex items-center gap-4">
                                        <select
                                            className="w-full p-2 border rounded-lg"
                                            value={editedTeam?.coach?.id || ''}
                                            onChange={(e) => {
                                                const selectedCoach = users?.find(
                                                    (user) => user.id === parseInt(e.target.value)
                                                );
                                                setEditedTeam({
                                                    ...editedTeam,
                                                    coach: selectedCoach || null,
                                                } as Team);
                                            }}
                                        >
                                            <option value="">{t('team.selectCoach')}</option>
                                            {users?.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.firstName} {user.lastName}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleSwitchCoach}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            {t('buttons.validate')}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-600">
                                            {team.coach?.firstName} {team.coach?.lastName}
                                        </p>
                                        <p className="text-gray-500">
                                            {team.coach?.description || ''}
                                        </p>
                                    </>
                                )}
                            </div>
                            {team.id && <LatestMatches teamId={Number(team.id)} />}
                        </div>

                        <div className="lg:w-1/3">
                            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                    {t('team.players')}
                                </h2>
                                {team.players && team.players.length > 0 ? (
                                    <ul className="space-y-2">
                                        {team.players.map((player) => (
                                            <li
                                                key={player.id}
                                                className="flex items-center justify-between text-gray-700 hover:text-gray-900"
                                            >
                                                <span>
                                                    {player.firstName} {player.lastName}
                                                </span>
                                                {isEditing && (
                                                    <button
                                                        onClick={() =>
                                                            player.id !== undefined &&
                                                            handleRemovePlayer(player.id)
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">{t('team.noPlayers')}</p>
                                )}
                                {isEditing && (
                                    <div className="mt-4">
                                        <button
                                            onClick={() => setIsAddingPlayer(!isAddingPlayer)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            {isAddingPlayer
                                                ? t('buttons.cancel')
                                                : t('buttons.addPlayer')}
                                        </button>
                                        {isAddingPlayer && (
                                            <div className="mt-4">
                                                <select
                                                    className="w-full p-2 border rounded-lg"
                                                    onChange={(e) => {
                                                        const selected = users?.find(
                                                            (user) =>
                                                                user.id === parseInt(e.target.value)
                                                        );
                                                        setSelectedUser(selected || null);
                                                    }}
                                                >
                                                    <option value="">{t('team.selectUser')}</option>
                                                    {users?.map((user) => (
                                                        <option key={user.id} value={user.id}>
                                                            {user.firstName} {user.lastName}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={handleAddPlayer}
                                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                >
                                                    {t('buttons.addToTeam')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 mt-8">{t('team.loadingDetails')}</p>
                )}
                {loggedInUser &&
                    (loggedInUser.username === username || loggedInUser.role === 'ADMIN') && (
                        <EditButtons
                            isEditing={isEditing}
                            handleEditToggle={handleEditToggle}
                            handleSave={handleSave}
                        />
                    )}
            </div>
        </>
    );
};

export default TeamContent;
