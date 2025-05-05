const getGoalsWithDetails = async (matchId: number) => {
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/match/${matchId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
    const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}')?.token;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
    deleteGoalById
};

export default GoalService;
