import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  CardTitle,
  CardText
} from "reactstrap";

import "./popup.css";

const PopUp = props => {
  const { buttonLabel, className, title } = props;
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button className="btn-sm" color="primary" onClick={toggle}>
        {buttonLabel}
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalBody>
          <Container>
            <Row>
              <Col>Image</Col>
              <Col>
                <Card>
                  <CardHeader>
                    {title}{" "}
                    <Button className="close" onClick={toggle}>
                      <span aria-hidden="true">×</span>
                    </Button>
                  </CardHeader>
                  <CardBody>
                    <CardTitle>Details</CardTitle>
                    <CardText>
                      With supporting text below as a natural lead-in to
                      additional content.
                    </CardText>
                  </CardBody>
                  <CardFooter>
                    <Button color="danger float-right" onClick={toggle}>
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Container>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default PopUp;
