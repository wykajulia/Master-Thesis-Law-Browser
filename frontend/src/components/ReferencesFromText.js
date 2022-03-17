import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ListGroup, Button, Card } from 'react-bootstrap';


const ReferencesFromText = (props) => {
    const history = useHistory()
    const [open, setOpen] = useState(false)
    const references = props.refs

    const RenderClickableElem = (key, item) => {
        let url = `/act-text/${item["id"]}`;
        if (key == 'title') {
            return <Link to={{ pathname: url, state: { from: history.location.pathname } }} onClick={props.resetReferences}><ListGroup.Item variant='success' action='true'>{key} : {item[key]}</ListGroup.Item></Link>
        }
        return <ListGroup.Item>{key} : {item[key]}</ListGroup.Item>
    }

    const OnClickHandler = () => {
        props.setPage(parseInt(props.page) + 1);
        setOpen(!open);
    }


    return (
        <div>
            <h2><Button style={{ width: "100%" }} variant="secondary" onClick={() => OnClickHandler()}>Page {parseInt(props.page) + 1}</Button></h2>
            {open ? (references.map((item, idx) => (
                <Card key={idx + item}>
                    <Card.Header>{idx + 1}</Card.Header>
                    <ListGroup variant="flush">
                        {
                            Object.keys(item).map(function (key, index) {
                                return RenderClickableElem(key, item)
                            })
                        }
                    </ListGroup>
                </Card>
            )
            )
            ) : (<p></p>)}
        </div>
    )
}

export default ReferencesFromText;
