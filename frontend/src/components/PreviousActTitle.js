import React, { useState, useEffect } from "react"
import { Link, useHistory } from 'react-router-dom';
import { ListGroup, Button, Card } from 'react-bootstrap';



const PreviuosActTitle = () => {
    const history = useHistory()
    const [isOpen, setOpenHistory] = useState(false)

    let title = sessionStorage.getItem('PreviousTitle')

    if (title) {
        title = title.split('--')
    }

    const renderElement = (item, idx) => {
        if (history.location.pathname.split('/').slice(2, 5).join('/') != item.split(":")[0])
            return <ListGroup.Item style={{ width: "100%" }}>{idx + 1}. <Link to={{ pathname: `/act-text/${item.split(":")[0]}`, state: { from: history.location.pathname } } }>{item.split(':')[1]}</Link></ListGroup.Item>
        else  return <ListGroup.Item style={{ width: "100%" }}>{idx + 1}. {item.split(':')[1]}</ListGroup.Item>
    }
    

    const onClickHandler = () => {
        setOpenHistory(!isOpen);
    }

    return (
        <div>
            {
                title ? (
                    <div>
                        <h2><Button style={{ width: "100%"}} variant="success" onClick={() => onClickHandler()}>Historia przeglądania</Button></h2>
                        {isOpen ? (
                            <ListGroup>
                                {
                                    title.map((item, idx) => {
                                        return renderElement(item, idx)
                                    })
                                }
                            </ListGroup>
                        ) : <p></p>
                        }
                        <br></br>
                    </div>
                ) : (
                    <p>Pierwszy kliknięty akt</p>
                )
            }
        </div>
    )
}

export default PreviuosActTitle