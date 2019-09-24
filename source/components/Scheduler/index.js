// Core
import React, { Component } from 'react';
import Move from 'react-flip-move';

// Instruments
import Styles from './styles.m.css';
import Checkbox from '../../theme/assets/Checkbox';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import { sortTasksByGroup } from '../../instruments';

// Components
import Task from '../Task';
import Spinner from '../Spinner';

export default class Scheduler extends Component {
    state = {
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
        tasks:           [],
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _updateTasksFilter = (event) => {
        this.setState({
            tasksFilter: event.target.value.toLowerCase(),
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _getAllCompleted = () => this.state.tasks.every((task) => task.completed);

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    };

    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);

            const tasks = await api.fetchTasks();

            this.setState({
                tasks: sortTasksByGroup(tasks),
            });
        } catch (error) {
            console.log(error.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _createTaskAsync = async (event) => {
        try {
            event.preventDefault();
            const { newTaskMessage } = this.state;

            if (!newTaskMessage) {
                return null;
            }

            this._setTasksFetchingState(true);

            const task = await api.createTask(newTaskMessage);

            this.setState(({ tasks }) => ({
                tasks:          sortTasksByGroup([task, ...tasks]),
                newTaskMessage: '',
            }));
        } catch (error) {
            console.log(error.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _updateTaskAsync = async (updatedTask) => {
        try {
            this._setTasksFetchingState(true);

            const updatedTaskFromResponse = await api.updateTask(updatedTask);

            this.setState(({ tasks }) => {
                const indexToReplace = tasks.indexOf(tasks.find((task) => task.id === updatedTask.id));

                const newTasks = [...tasks.filter((task) => task.id !== updatedTask.id)];

                newTasks.splice(indexToReplace, 0, updatedTaskFromResponse);

                const sortedTasks = sortTasksByGroup(newTasks);

                return {
                    tasks: sortedTasks,
                };
            });
        } catch (error) {
            console.log(error.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _removeTaskAsync = async (taskId) => {
        try {
            this._setTasksFetchingState(true);

            await api.removeTask(taskId);

            this.setState(({ tasks }) => ({
                tasks:           tasks.filter((task) => task.id !== taskId),
                isTasksFetching: false,
            }));
        } catch (error) {
            console.log(error.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _completeAllTasksAsync = async () => {
        try {
            if (this._getAllCompleted()) {
                return null;
            }

            this._setTasksFetchingState(true);

            await api.completeAllTasks(this.state.tasks);

            this.setState(({ tasks }) => ({
                tasks: sortTasksByGroup(tasks.map((task) => ({ ...task, completed: true }))),
            }));
        } catch (error) {
            console.log(error.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    render () {
        const { tasks, newTaskMessage, tasksFilter, isTasksFetching } = this.state;

        const allCompleted = this._getAllCompleted();
        const todoList = tasks
            .filter((task) => task.message.toLowerCase().includes(tasksFilter))
            .map((props) => (
                <Task
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                    key = { props.id }
                    { ...props }
                />
            ));

        return (
            <section className = { Styles.scheduler }>
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
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = { Styles.createTask }
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className = { Styles.overlay }>
                            <ul>
                                <Move duration = { 400 } easing = 'ease-in-out'>
                                    {todoList}
                                </Move>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { allCompleted }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
