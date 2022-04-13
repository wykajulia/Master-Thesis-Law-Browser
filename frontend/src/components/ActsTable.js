import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import ActItem from './ActItem'
import API from "../utils/API";
import Loader from './Loader';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';



const ActsTable = () => {
  const [acts, setActs] = useState([]);
  const [isLoading, setLoading] = useState(true)
  const queryParams = useParams()

  useEffect(() => {
    API.get('/acts-year', {
      params: {
        name: queryParams.name,
        year: queryParams.year
      }
    })
      .then((response) => {
        setActs(response.data.items);
        setLoading(false);
        sessionStorage.removeItem('PreviousTitle');
      });
  }, [])

  return (
    <Container fluid className="p-4">
      <Row style={{ display: 'flex', justifyContent: 'center' }} >
        <Col>
          <h2 className="text-center">Przeglądarka Aktów Prawnych</h2>
        </Col>
      </Row>
      <Row style={{ display: 'flex', justifyContent: 'center', paddingLeft: 25, paddingRight: 25 }}>
        {isLoading ? (
          <Loader />
        ) : (
          <React.Fragment>
            <Table bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tytuł</th>
                  <th>Data ogłoszenia</th>
                </tr>
              </thead>
              <tbody>
                {acts.map((item, index) => (
                  <ActItem key={item.address + index} item={item} params={queryParams} />
                ))}
              </tbody>
            </Table>
          </React.Fragment>
        )}
      </Row>
    </Container>
  )
}

export default ActsTable;