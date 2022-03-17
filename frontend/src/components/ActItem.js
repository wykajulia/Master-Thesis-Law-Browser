import React from 'react';
import { useHistory } from 'react-router-dom';
import './ActItem.css'


const ActItem = (props) => {
    const history = useHistory();


    const onTitleSubmit = (pos) => {
        history.push({
            pathname: `/act-text/${props.params.name}/${props.params.year}/${pos}`,
            state: {first: true}
        })
    };

    return (
        <tr onClick={() => onTitleSubmit(props.item.pos)}>
            <td>{props.item.pos}</td>
            <td>{props.item.title}</td>
            <td>{props.item.announcementDate}</td>
        </tr>
    )
}

export default ActItem;