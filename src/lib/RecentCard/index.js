import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Container,
  Row,
  Col,
  CardImg,
} from "reactstrap";

import FileUpload from "../FileUpload";
import SidePreview from "../Table/SidePreview";

import "./recent_card.css";
let image = [
  "bmp",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "svg+xml",
  "tiff",
  "webp",
  "image",
];

export default function RecentCard(props) {
  const {
    uploadFiles,
    result,
    bytesToSize,
    icons,
    baseUrl,
    loadNewContent,
    handleClick,
  } = props;
  const handleCardTitleClick = (file) => {
    file.actualSizeInKb = bytesToSize(file.file_size);
    file.url = `${baseUrl}${file.file_url}`;
    file.random = Math.random();
    handleClick(<SidePreview data={file} />);
  };

  return (
    <div className="mb-4 mt-2 recent-card">
      <h5 className="text-muted mb-3">Quick access</h5>
      <Container>
        <Row>
          {result &&
            result.map((card) => {
              return (
                <Col xs="3" key={`${card.upload_name}`}>
                  <Card className="quick_card">
                    {image.indexOf(card.file_extension) > -1 ? (
                      <CardImg
                        top
                        className="card_image"
                        width="100%"
                        src={`${baseUrl}${card.file_url}`}
                        alt="Card image cap"
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
                        <span
                          className="recent_fileName"
                          onClick={() => handleCardTitleClick(card)}
                          title={card.upload_name}
                        >
                          {card.upload_name}
                        </span>
                      </CardTitle>
                      <CardText className="text-muted card_desc">
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
              loadNewContent={loadNewContent}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
