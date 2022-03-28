import React, { useState, useEffect } from 'react';
import { DropdownButton, Dropdown, Button, ListGroup } from 'react-bootstrap';
import API from "../utils/API";
import Loader from './Loader';
import { useHistory } from 'react-router-dom';
import './ActList.css'


const yearChooserText = "Choose year";


const ActsList = () => {
    const [acts, setActs] = useState([]);
    const [isLoading, setLoading] = useState(true)
    const [title, setTitle] = useState({ fullTitle: "Choose law journal name", code: null });
    const [year, setYear] = useState(yearChooserText);
    const [options, setOptions] = useState(null);
    const [buttonSubmit, setButtonSubmit] = useState(false);
    const history = useHistory();


    useEffect(() => {
        API.get('/acts-list').then((response) => {
            setActs(response.data);
            setLoading(false);
        });
    }, [])

    const handleSelectName = (choosenOption) => {
        if (year !== yearChooserText) {
            setYear(yearChooserText);
        }
        setTitle({ fullTitle: choosenOption, code: acts[choosenOption]['code'] });
        setOptions(acts[choosenOption]['years'].reverse());
    };

    const handleSelectYear = (choosenOption) => {
        setYear(choosenOption);
    };

    const onButtonSubmit = () => {
        history.push(`/acts/${title.code}/${year}`);
        setButtonSubmit(true);
    };

    return (
        isLoading ? (
            <Loader />
        ) : (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '150px',
            }}>
                <ListGroup horizontal>
                    <ListGroup.Item>
                        <DropdownButton id="dropdown-basic-button" title={title.fullTitle} onSelect={handleSelectName} variant="secondary">
                            {Object.keys(acts).map((item, index) => (
                                <Dropdown.Item id="dropdown-item" key={index} eventKey={item}>{item}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </ListGroup.Item>

                    {
                        options ?
                            (<ListGroup.Item>
                                <DropdownButton id="dropdown-basic-button" title={year} onSelect={handleSelectYear} variant="secondary">
                                    {options.map((item, index) => (
                                        <Dropdown.Item id="dropdown-item" key={index} eventKey={item}>{item}</Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </ListGroup.Item>

                            ) :
                            (
                                <ListGroup.Item>
                                    <DropdownButton id="dropdown-basic-button" title={year} onSelect={handleSelectYear} variant="secondary" disabled>
                                    </DropdownButton>
                                </ListGroup.Item>

                            )
                    }
                    {
                        options && year !== yearChooserText ?
                            (
                                <ListGroup.Item>
                                    <Button type="submit" id='dropdown-basic-button' onClick={onButtonSubmit} variant="secondary">Submit</Button>
                                </ListGroup.Item>
                            ) :
                            (
                                <ListGroup.Item>
                                    <Button type="submit" id='dropdown-basic-button' onClick={onButtonSubmit} variant="secondary" disabled>Submit</Button>
                                </ListGroup.Item>
                            )
                    }
                </ListGroup>
            </div>
        )
    )
}

export default ActsList;