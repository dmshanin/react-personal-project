// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';
import Checkbox from 'theme/assets/Checkbox';
import Star from 'theme/assets/Star';
import Edit from 'theme/assets/Edit';
import Remove from 'theme/assets/Remove';

export default class Task extends PureComponent {
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

    render () {
        const completed = '';

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3b8EF3'
                        color2 = '#FFF'
                    />

                    <input disabled maxLength = '50' type = 'text' value = 'Название задачи' />
                </div>

                <div className = { Styles.actions } >
                    <Star
                        inlineBlock
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3b8EF3'
                        color2 = '#000'
                    />

                    <Edit
                        inlineBlock
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3b8EF3'
                        color2 = '#000'
                    />

                    <Remove
                        inlineBlock
                        color1 = '#3b8EF3'
                        color2 = '#000'
                    />
                </div>
            </li>
        );
    }
}
