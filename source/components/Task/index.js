// Core
import React, { PureComponent, createRef } from 'react';
import { func, string, bool } from 'prop-types';

// Instruments
import Styles from './styles.m.css';
import Checkbox from 'theme/assets/Checkbox';
import Star from 'theme/assets/Star';
import Edit from 'theme/assets/Edit';
import Remove from 'theme/assets/Remove';

export default class Task extends PureComponent {
    static propTypes = {
        id:               string.isRequired,
        completed:        bool.isRequired,
        favorite:         bool.isRequired,
        created:          string.isRequired,
        modified:         string.isRequired,
        message:          string.isRequired,
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired,
    };

    taskInput = createRef();

    state = {
        isTaskEditing:  false,
        newTaskMessage: this.props.message,
    };

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _setTaskEditingState = (isTaskEditing) => {
        this.setState(
            {
                isTaskEditing,
            },
            () => {
                if (isTaskEditing) {
                    this.taskInput.current.focus();
                }
            },
        );
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newMessage: event.target.value,
        });
    };

    _updateTask = (updatedTask) => {
        const { _updateTaskAsync } = this.props;

        if (this.state.newMessage === this.props.message) {
            this._setTaskEditingState(false);

            return null;
        }

        _updateTaskAsync(updatedTask);

        this._setTaskEditingState(false);
    };

    _updateTaskMessageOnClick = () => {
        if (this.state.isTaskEditing === true) {
            this._updateTask();

            return null;
        }
        this._setTaskEditingState(true);
    };

    _cancelUpdatingTaskMessage = () => {
        this._setTaskEditingState(false);

        this.setState({
            newMessage: this.props.message,
        });
    };

    _updateTaskMessageOnKeyDown = () => {
        const enterKey = event.key === 'Enter';
        const escapeKey = event.key === 'Escape';

        if (enterKey) {
            if (this.state.newMessage === '') {
                return null;
            }

            this._updateTask();
        }

        if (escapeKey) {
            event.preventDefault();
            this._cancelUpdatingTaskMessage();
        }
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;

        const taskToUpdate = this._getTaskShape({ completed: !completed });

        _updateTaskAsync(taskToUpdate);
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;

        const taskToUpdate = this._getTaskShape({ favorite: !favorite });

        _updateTaskAsync(taskToUpdate);
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    render () {
        const {
            completed,
            favorite,
            message,
        } = this.props;

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3b8EF3'
                        color2 = '#FFF'
                        onClick = { this._toggleTaskCompletedState }
                    />

                    <input
                        disabled = { !this.state.isTaskEditing }
                        maxLength = { 50 }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                        type = 'text'
                        value = { message }
                        ref = { this.taskInput }
                    />
                </div>

                <div className = { Styles.actions } >
                    <Star
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3b8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._toggleTaskFavoriteState }
                    />

                    <Edit
                        checked = { false }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3b8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._updateTaskMessageOnClick }
                    />

                    <Remove
                        className = { Styles.removeTask }
                        color1 = '#3b8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
