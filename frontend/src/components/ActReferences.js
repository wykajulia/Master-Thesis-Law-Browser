import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Card, ListGroup, Button } from 'react-bootstrap';


const ActReferences = (props) => {
    const history = useHistory()
    const [open, setOpen] = useState(false)

    const RenderListGroup = (key, item) => {
        let data = item['id'].split('/');
        let url = `/act-text/${data[0]}/${data[1]}/${data[2]}`;
        if (key == 'title') {
            return <Link to={{pathname: url, state: { from: history.location.pathname }}} onClick={props.resetReferences}><ListGroup.Item variant='success' action='true'>{key} : {item[key]}</ListGroup.Item></Link>
        }
        return <ListGroup.Item>{key} : {item[key]}</ListGroup.Item>
    }

    return (
        <div>
            <h2><Button style={{width: "100%"}}  variant="secondary" onClick={() => setOpen(!open)}>{props.name}</Button></h2>
            {open ? (props.actInfo.map((item, idx) => (
                <Card key={idx + item}>
                    <Card.Header>{idx + 1}</Card.Header>
                    <ListGroup variant="flush">
                        {
                            Object.keys(item).map(function (key, index) {
                                return RenderListGroup(key, item)
                            })
                        }
                    </ListGroup>
                </Card>
            )
            )) : (<p></p>)
            }
        </div>
    )
}

export default ActReferences;
