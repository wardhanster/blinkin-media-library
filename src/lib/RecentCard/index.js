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
  const { uploadFiles, result, bytesToSize } = props;

  return (
    <div className="mb-4 mt-2 recent-card">
      <h5 className="text-muted mb-3">Quick access</h5>
      <Container>
        <Row>
          {result &&
            result.map((card) => {
              return (
                <Col key={`${card.upload_name}`}>
                  <Card>
                    {card.file_extension === "image" ? (
                      <img
                        alt="preview"
                        src={card.url}
                        className="image-fluid"
                      />
                    ) : (
                      <div className="file_preview">{card.file_extension}</div>
                    )}
                    <CardBody>
                      <CardTitle>
                        <i className="fa fa-file-image-o"></i>
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
          <Col>
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
