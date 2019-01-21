// Core
import React, { Component } from 'react';

// Components
import Task from 'components/Task';

// Instruments
import Styles from './styles.m.css';
import { api, MAIN_URL, TOKEN } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
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

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
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

        const _updatedTask = await api.updateTask(updatedTask);

        this.setState(({ tasks }) => ({
            tasks:           _updatedTask, // здесь надо както фильтровать
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
        await api.completeAllTasks();
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

    _submitOnEnter = (event) => {
        const enterKey = event.key === 'Enter';

        if (enterKey) {
            event.preventDefault();
            this._submitMessage();
        }
    };

    // поиск
    _updateTasksFilter = () => {
        console.log('_updateTasksFilter');
    };

    //
    _getAllCompleted = () => {
        console.log('_getAllCompleted');
    };

    render () {
        const { newTaskMessage, tasks, isTasksFetching } = this.state;
        const completed = '';

        const tasksJSX = tasks.map((task) =>
            (<Task
                _removeTaskAsync = { this._removeTaskAsync }
                _updateTaskAsync = { this._updateTaskAsync }
                completed = { task.completed }
                favorite = { task.favorite }
                id = { task.id }
                key = { task.id }
                message = { task.message }
            />)
        );

        return (
            <section className = { Styles.scheduler }>
                { /* тут должен быть Spinner, смотри в снэпшот */ }
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'search' />
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

                        <div className = { Styles.overlay } >
                            <ul>
                                { tasksJSX }
                            </ul>
                        </div>
                    </section>

                    <footer>
                        <Checkbox
                            checked = { completed }
                            color1 = '#3b8EF3'
                            color2 = '#FFF'
                            onClick = { this._getAllCompleted }
                        />

                        <span className = { Styles.completeAllTasks } >Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
