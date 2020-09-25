import React from "react";
import { Card, CardText, CardBody, CardTitle } from "reactstrap";

import "./sidepreview.css";
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
let video = [
  "mpeg",
  "ogg",
  "mp2t",
  "mp4",
  "webm",
  "3gpp",
  "3gpp2",
  "mp4",
  "3gp",
  "x-ms-video",
  "video",
];
function fileshow(file_extension, url) {
  let filePreview;
  if (image.indexOf(file_extension) > -1) {
    filePreview = (
      <img src={url} className="image_preview" alt="preview_image" />
    );
  } else if (video.indexOf(file_extension) > -1) {
    filePreview = (
      <video className="preview-video" controls>
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  } else if (file_extension === "pdf") {
    filePreview = (
      <object data={url} type="application/pdf" className="pdf-iframe">
        <iframe title={file_extension} src={url}></iframe>
      </object>
    );
  } else {
    filePreview = (
      <div className="default_preview">
        <b className="file_format">{file_extension}</b>{" "}
        {window.String.ML_fileFormatNotAbleToLoad ||
          "File Format Not able to load"}
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
            <b>
              {window.strings.ML_fileSize || "File Size"} - {actualSizeInKb}
            </b>
          </p>
        </CardBody>
      </Card>
    </>
  );
}
