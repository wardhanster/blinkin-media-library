import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Container,
  Row,
  Col,
} from "reactstrap";

import FileUpload from "../FileUpload";

import "./recent_card.css";

export default function RecentCard(props) {
  const { uploadFiles, result, bytesToSize, icons } = props;

  return (
    <div className="mb-4 mt-2 recent-card">
      <h5 className="text-muted mb-3">Quick access</h5>
      <Container>
        <Row>
          {result &&
            result.map((card) => {
              return (
                <Col xs="3" key={`${card.upload_name}`}>
                  <Card>
                    {card.file_extension === "image" ? (
                      <img
                        alt="preview"
                        src={card.url}
                        className="image-fluid"
                      />
                    ) : (
                      <div className="file_preview">
                        <i className={icons(card.file_extension)}></i>{" "}
                        {card.file_extension}
                      </div>
                    )}
                    <CardBody>
                      <CardTitle>
                        <i className={icons(card.file_extension)}></i>
                        {card.upload_name}
                      </CardTitle>
                      <CardText className="text-muted">
                        {card.upload_description}
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          <Col xs="3">
            <FileUpload
              sideModal={props.sideModal}
              toggle={props.toggle}
              uploadFiles={uploadFiles}
              bytesToSize={bytesToSize}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
