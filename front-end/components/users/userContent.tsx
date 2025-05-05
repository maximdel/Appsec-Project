import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Header from '@components/header/header';
import StatsGrid from '../statsGrid';
import EditButtons from '../EditButtons';
import { User, Team, UserStorage } from '@types';

const UserContent = ({
    user,
    isEditing,
    editedUser,
    setEditedUser,
    teams,
    loggedInUser,
    username,
    handleEditToggle,
    handleSave,
}: {
    user: User | undefined;
    isEditing: boolean;
    editedUser: User | null;
    setEditedUser: (u: User | null) => void;
    teams: Team[] | undefined;
    loggedInUser: UserStorage | null;
    username: string | string[] | undefined;
    handleEditToggle: () => void;
    handleSave: () => Promise<void>;
}) => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t('app.title')}</title>
                <meta name="description" content={t('app.title')} />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center p-8 bg-gray-50 min-h-screen">
                    <div className="max-w-4xl mb-6">
                        <h1 className="text-4xl font-bold text-gray-900">
                            {user?.lastName} {user?.firstName}
                        </h1>
                    </div>
                    <div className="flex flex-col lg:flex-row max-w-6xl w-full gap-8">
                        <div className="flex justify-center lg:w-1/3">
                            <div className="w-64 h-64 bg-gray-300 rounded-lg shadow-md" />
                        </div>
                        <div className="flex flex-col lg:w-2/3 gap-6">
                            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                    {t('user.description')}
                                </h2>
                                {isEditing ? (
                                    <textarea
                                        className="w-full p-2 border rounded-lg"
                                        value={editedUser?.description || ''}
                                        onChange={(e) =>
                                            setEditedUser({
                                                ...editedUser,
                                                description: e.target.value,
                                            } as User)
                                        }
                                        placeholder={t('user.enterDescription')}
                                    />
                                ) : (
                                    <p className="text-gray-600">
                                        {user?.description || t('user.noDescription')}
                                    </p>
                                )}
                            </div>
                            {user?.playerOfTeam && (
                                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                        {t('user.team')}
                                    </h2>
                                    {isEditing ? (
                                        <select
                                            className="w-full p-2 border rounded-lg"
                                            value={editedUser?.playerOfTeam?.id || ''}
                                            onChange={(e) => {
                                                const selectedTeam = teams?.find(
                                                    (team) => team.id === parseInt(e.target.value)
                                                );
                                                setEditedUser({
                                                    ...editedUser,
                                                    playerOfTeam: selectedTeam || null,
                                                } as User);
                                            }}
                                        >
                                            <option value="">{t('user.selectTeam')}</option>
                                            {teams?.map((team) => (
                                                <option key={team.id} value={team.id}>
                                                    {team.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-gray-600">
                                            {user?.playerOfTeam?.name || t('user.noTeamAssigned')}
                                        </p>
                                    )}
                                </div>
                            )}
                            {user?.coachOfTeam && (
                                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                                    <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                        {t('user.coach')}
                                    </h2>
                                    <p className="text-gray-600">{user.coachOfTeam.name}</p>
                                </div>
                            )}
                            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                    {t('user.email')}
                                </h2>
                                {isEditing ? (
                                    <input
                                        className="w-full p-2 border rounded-lg"
                                        value={editedUser?.email || ''}
                                        onChange={(e) =>
                                            setEditedUser({
                                                ...editedUser,
                                                email: e.target.value,
                                            } as User)
                                        }
                                        placeholder={t('user.enterEmail')}
                                    />
                                ) : (
                                    <p className="text-gray-600">{user?.email}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="w-full max-w-6xl mt-8">{user && <StatsGrid user={user} />}</div>
                    {loggedInUser &&
                        (loggedInUser.username === username || loggedInUser.role === 'ADMIN') && (
                            <EditButtons
                                isEditing={isEditing}
                                handleEditToggle={handleEditToggle}
                                handleSave={handleSave}
                            />
                        )}
                </div>
            </main>
        </>
    );
};

export default UserContent;
