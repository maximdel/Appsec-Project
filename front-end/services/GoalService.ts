const getGoalsWithDetails = async (matchId: number) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/match/${matchId}`, {
            method: 'GET',
            credentials: 'include',

            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            console.log('response: ' + response.status);
            throw new Error(`Fetch failed with status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

const deleteGoalById = async (id: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.message || 'Failed to delete goal');
    }

    return await response;
};

const GoalService = {
    getGoalsWithDetails,
    deleteGoalById,
};

export default GoalService;
