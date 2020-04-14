import React from "react";
import { Card, CardText, CardBody, CardTitle } from "reactstrap";

import "./sidepreview.css";

function fileshow(file_extension, url) {
  let filePreview;
  if (file_extension === "image") {
    filePreview = <img src={url} className="img-fluid" alt={"preview_image"} />;
  } else if (file_extension === "video") {
    filePreview = (
      <video className="preview-video" controls>
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  } else if (file_extension === "pdf") {
    filePreview = <iframe className="pdf-iframe" url={url}></iframe>;
  } else {
    filePreview = (
      <div className="default_preview">
        {file_extension} File format Not able to load
      </div>
    );
  }
  return filePreview;
}

export default function SidePreview(props) {
  let {
    upload_name,
    upload_description,
    actualSizeInKb,
    file_extension,
    url,
  } = props.data;

  return (
    <>
      <Card>
        <CardBody>
          <CardTitle>
            <h3>{upload_name}</h3>
          </CardTitle>
        </CardBody>
        {fileshow(file_extension, url)}
        <CardBody>
          <CardText>
            <b>{upload_description}</b>
          </CardText>
          <p>
            <b>File size - {actualSizeInKb}</b>
          </p>
        </CardBody>
      </Card>
    </>
  );
}
