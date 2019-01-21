import { MAIN_URL, TOKEN } from './config';

export const api = {
    fetchTasks: async () => {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
        });

        const { data: tasks } = await response.json();

        console.log('tasks', tasks);

        return tasks;
    },

    createTask: async (message) => {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        const { data: task } = await response.json();

        return task;
    },

    updateTask: async (updatedTask) => {
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify(updatedTask),
        });

        const { data: task } = await response.json();

        return task;
    },

    removeTask: async (postId) => {
        await fetch(`${MAIN_URL}/${postId}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });
    },

    completeAllTasks: async () => {
        await this.updateTask();
    },
};
