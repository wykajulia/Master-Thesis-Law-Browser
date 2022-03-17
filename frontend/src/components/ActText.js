import React, { useState, useEffect } from 'react';
import API from "../utils/API";
import Loader from './Loader';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ActReferences from './ActReferences';
import PreviuosActTitle from './PreviousActTitle';
import ReferencesFromText from './ReferencesFromText';
import { PDFObject } from 'react-pdfobject'


const ActText = () => {
    const [actText, setActText] = useState(null);
    const [actHTMLText, setActHTMLText] = useState(null);
    const [actReferences, setReferences] = useState(null);
    const [isLoading, setLoading] = useState(true)
    const queryParams = useParams()
    const [previousAct, setPreviousAct] = useState(null);
    const [referencesFromText, setReferencesFromText] = useState(null);
    const [pdfPageNo, setPdfPageNo] = useState(1);
    const history = useHistory()

    const [display, setDisplay] = useState(true);


    useEffect(() => {
        API.get(`/act-text`,
            {
                params: {
                    name: queryParams.name,
                    year: queryParams.year,
                    pos: queryParams.pos
                },
            }
        ).then((response) => {
            setActText(response.data.data.url);
            setActHTMLText(response.data.data.html);
            setLoading(false);
        });
    }, [queryParams])

    useEffect(async () => {
        await API.get(`/act-text-references`,
            {
                params: {
                    name: queryParams.name,
                    year: queryParams.year,
                    pos: queryParams.pos
                },
            }
        ).then((response) => {
            setReferencesFromText(response.data.data.references)
        });
    }, [queryParams])

    useEffect(async () => {
        await API.get(`/act-references`,
            {
                params: {
                    name: queryParams.name,
                    year: queryParams.year,
                    pos: queryParams.pos
                },
            }
        ).then((response) => {
            setReferences(response.data.data.references);
        });
    }, [queryParams])

    useEffect(() => {
        return history.listen(() => {
            setReferences(null);
            setPreviousAct(null);
            if (!(history.location['state'] == undefined) && !(history.location['state']['from'] == undefined)) {
                setPreviousAct(history.location['state']['from'].split('/').slice(2, 5));
            }
            else if (!(history.location['state'] == undefined) && history.location['state']['first'] == true) {
                localStorage.removeItem('PreviousTitle');
            }
            if (history.action === 'POP' | history.action === 'PUSH') {
                setLoading(true);
            }
        })
    }, [])

    useEffect(() => {
        if (!(previousAct == null)) {
            API.get(`/act-title`,
                {
                    params: {
                        name: previousAct[0],
                        year: previousAct[1],
                        pos: previousAct[2]
                    },
                }
            ).then((response) => {
                localStorage.setItem('PreviousTitle', response.data.title);
            });
        }
    }, [previousAct])

    const setReferencesNull = () => {
        setReferences(null);
    }

    const setPageNumber = (page) => {
        setDisplay(false)
        setTimeout(() => {
            setPdfPageNo(page)
            setDisplay(true)
        }, 0);
    }


    const ReturnActText = () => {
        if (actHTMLText) {
            return (<div>
                {PreviuosActTitle()}
                <div dangerouslySetInnerHTML={{ __html: actHTMLText }} />
                {display ? <PDFObject url={actText} page={pdfPageNo} width="100%" height="900px" pagemode={true} /> : <div width="1000px" height="900px" ></div>}
            </div>)
        }
        return (
            <div>
                {PreviuosActTitle()}
                {display ? <PDFObject url={actText} page={pdfPageNo} width="100%" height="900px" pagemode={true} /> : <div width="1000px" height="900px" ></div>}
            </div>
        )
    }

    return (
        <Container fluid className="p-4" style={{ height: "100%" }}>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <Row style={{ display: 'flex', justifyContent: 'center', height: '90vh' }}>
                        <Col>
                            {ReturnActText()}
                        </Col>
                        <Col style={{ height: "100%", overflow: "auto" }}>
                            <h1>References</h1>
                            <Row>{
                                referencesFromText ? (
                                    Object.keys(referencesFromText).map(function (key, index) {
                                        return <Card key={key + index}><ReferencesFromText key={index} page={key} refs={referencesFromText[key]} resetReferences={setReferencesNull} setPage={setPageNumber} /></Card>
                                    })) : (<Loader />)
                            }</Row>
                            <Row>
                                {actReferences ? (
                                    Object.keys(actReferences).map(function (key, index) {
                                        return <Card key={key + index}><ActReferences key={index} name={key} actInfo={actReferences[key]} resetReferences={setReferencesNull} /></Card>
                                    })) : (<Loader />)
                                }
                            </Row>
                        </Col>
                    </Row>
                )
            }
        </Container>
    )
}

export default ActText;