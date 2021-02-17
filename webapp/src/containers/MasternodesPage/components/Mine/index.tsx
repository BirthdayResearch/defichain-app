import React from 'react';
import {
  MdArrowForward,
  MdCheckCircle,
  MdFiberManualRecord,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import {
  Card,
  Button,
  CardHeader,
  CardFooter,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  TabPane,
} from 'reactstrap';
import styles from './Mine.module.scss';

const Mine = (props) => {
  return (
    <TabPane tabId='mine'>
      <Row>
        <Col md='5'>
          <Card>
            <CardBody>
              <Row>
                <Col md='1' className={styles.status}>
                  <span className={`txn-status-enabled mt-1`}></span>
                </Col>
                <Col md='9'>
                  <CardTitle tag='h5'>Holden </CardTitle>
                </Col>
                <Col md='2'>
                  <MdKeyboardArrowRight />
                </Col>
              </Row>
              <Row>
                <Col md='4'>
                  <CardText>Owner</CardText>
                </Col>
                <Col md='8'>
                  <CardText>
                    <small className='text-muted'>
                      8QSkEt2AmnrMi…TVZMovNvZwAj
                    </small>
                  </CardText>
                </Col>
              </Row>
              <Row>
                <Col md='4'>
                  <CardText>Operator</CardText>
                </Col>
                <Col md='8'>
                  <CardText>
                    <small className='text-muted'>Same as owner</small>
                  </CardText>
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col md='4'>
                  <CardText>Type</CardText>
                </Col>
                <Col md='8'>
                  <CardText>
                    <small className='text-muted'>Local</small>
                  </CardText>
                </Col>
                <Col md='4'>
                  <CardText>Collaterals</CardText>
                </Col>
                <Col md='8'>
                  <CardText>
                    <small className='text-muted'>2</small>
                  </CardText>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md='5'>
          <Card>
            <CardBody>
              <Row>
                <Col md='1' className={styles.status}>
                  <span className={`txn-status-disable mt-1`}></span>
                </Col>
                <Col md='9'>
                  <CardTitle tag='h5'>Allie </CardTitle>
                </Col>
                <Col md='2'>
                  <MdKeyboardArrowRight />
                </Col>
              </Row>
              <Row>
                <Col md='4'>
                  <CardText>Owner</CardText>
                </Col>
                <Col md='8'>
                  <CardText>
                    <small className='text-muted'>
                      8QSkEt2AmnrMi…TVZMovNvZwAj
                    </small>
                  </CardText>
                </Col>
              </Row>
              <Row>
                <Col md='4'>
                  <CardText>Operator</CardText>
                </Col>
                <Col md='8'>
                  <CardText>
                    <small className='text-muted'>
                      8J3WVMy5PanG…7WXQpCXkUop
                    </small>
                  </CardText>
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col md='4'>
                  <CardText>Type</CardText>
                </Col>
                <Col md='8'>
                  <CardText>
                    <small className='text-muted'>Remote</small>
                  </CardText>
                </Col>
                <Col md='4'>
                  <CardText>Collaterals</CardText>
                </Col>
                <Col md='8'>
                  <CardText>
                    <small className='text-muted'>1</small>
                  </CardText>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className='mt-5'>
        <Col md='5'>
          <Card>
            <CardBody>
              <Row>
                <Col md='1' className={styles.status}>
                  <span className={`txn-status-disable mt-1`}></span>
                </Col>
                <Col md='9'>
                  <CardTitle tag='h5'>Phoebe </CardTitle>
                </Col>
                <Col md='2'>
                  <MdKeyboardArrowRight />
                </Col>
              </Row>
              <Row>
                <Col md='4'>
                  <CardText>Owner</CardText>
                </Col>
                <Col md='8'>
                  <CardText>
                    <small className='text-muted'>
                      8QSkEt2AmnrMi…TVZMovNvZwAj
                    </small>
                  </CardText>
                </Col>
              </Row>
              <Row>
                <Col md='4'>
                  <CardText>Operator</CardText>
                </Col>
                <Col md='8'>
                  <CardText>
                    <small className='text-muted'>Same as owner</small>
                  </CardText>
                </Col>
              </Row>
              <Row className='mt-3'>
                <Col md='4'>
                  <CardText>Type</CardText>
                </Col>
                <Col md='8'>
                  <CardText>
                    <small className='text-muted'>Local</small>
                  </CardText>
                </Col>
                <Col md='4'>
                  <CardText>Collaterals</CardText>
                </Col>
                <Col md='8'>
                  <CardText>
                    <small className='text-muted'>3</small>
                  </CardText>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </TabPane>
  );
};

export default Mine;
