// Core
import React, { Component } from 'react';

// Components
import Task from 'components/Task';
import Spinner from 'components/Spinner';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from 'theme/assets/Checkbox';

export default class Scheduler extends Component {

    state = {
        newTaskMessage: '',

        //
        tasks:           [],
        isTasksFetching: false,

        //
        tasksFilter: '',
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _setTasksFetchingState = (isTasksFetching) => {
        this.setState({
            isTasksFetching,
        });
    };

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);

        const tasks = await api.fetchTasks();

        this.setState({
            tasks,
            isTasksFetching: false,
        });
    };

    _createTaskAsync = async (message) => {
        this._setTasksFetchingState(true);

        const task = await api.createTask(message);

        this.setState(({ tasks }) => ({
            tasks:           [task, ...tasks],
            isTasksFetching: false,
        }));
    };

    _updateTaskAsync = async (updatedTask) => {
        this._setTasksFetchingState(true);

        const _updatedTasks = await api.updateTask([updatedTask]);

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) => {
                const _updatedTask = _updatedTasks.find(({ id }) => id === task.id);

                if (_updatedTask) {
                    return _updatedTask;
                }

                return task;
            }),
            isTasksFetching: false,
        }));

        this._setTasksFetchingState(false);
    };

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);

        await api.removeTask(id);

        this.setState(({ tasks }) => ({
            tasks:           tasks.filter((task) => task.id !== id),
            isTasksFetching: false,
        }));
    };

    _completeAllTasksAsync = async () => {
        this._setTasksFetchingState(true);

        const { tasks } = this.state;

        const completedTasks = tasks.map((task) => ({
            ...task,
            completed: true,
        }));

        const _updatedTasks = await api.completeAllTasks(completedTasks);

        this.setState({
            tasks:           _updatedTasks,
            isTasksFetching: false,
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._submitMessage();
    };

    _submitMessage = () => {
        const { newTaskMessage } = this.state;

        if (!newTaskMessage) {
            return null;
        }

        this._createTaskAsync(newTaskMessage);

        this.setState({
            newTaskMessage: '',
        });
    };

    _updateTasksFilter = () => {
        console.log('_updateTasksFilter');
    };

    _getAllCompleted = () => {
        this._completeAllTasksAsync();
    };

    render () {
        const { newTaskMessage, tasks, isTasksFetching, tasksFilter } = this.state;

        const tasksJSX = tasks.map((task) => {
            return (<Task
                _removeTaskAsync = { this._removeTaskAsync }
                _updateTaskAsync = { this._updateTaskAsync }
                completed = { task.completed }
                created = { task.created }
                favorite = { task.favorite }
                id = { task.id }
                message = { task.message }
                modified = { task.modified ? task.modified : task.created }
            />);
        }
        );

        return (
            <section className = { Styles.scheduler }>
                { console.log('isTasksFetching', isTasksFetching) }
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._handleFormSubmit }>
                            <input
                                className = { Styles.createTask }
                                maxLength = { 50 }
                                onChange = { this._updateNewTaskMessage }
                                placeholder = 'Описание моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>

                        <div className = { Styles.overlay }>
                            <ul>
                                {tasksJSX}
                            </ul>
                        </div>
                    </section>

                    <footer>
                        <Checkbox
                            checked = { false }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._getAllCompleted }
                        />

                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
