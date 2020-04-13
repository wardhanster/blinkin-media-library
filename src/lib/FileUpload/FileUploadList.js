import React, { useState, useEffect } from "react";

import { Container, Button, Row, Col, Progress } from "reactstrap";

export default function FileUploadList(props) {
  let { bytesToSize } = props;
  let [url, setUrl] = useState(null);
  let [selectFile, setSelectFile] = useState(null);
  let [selectFileType, setSelectFileType] = useState(null);
  let {
    files,
    deleteFile,
    updateFile,
    submitFiles,
    fileStatusMsg,
    uploadPercentage,
  } = props;

  let handlePreview = (index, e) => {
    setSelectFile(files[index]);
    let fileType = files[index].type.split("/")[0];
    console.log(files[index]);
    setSelectFileType(fileType);
  };

  useEffect(() => {
    if (selectFileType === "image") {
      let reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
      };
      reader.readAsDataURL(selectFile);
    } else if (selectFileType === "video") {
      setUrl(URL.createObjectURL(selectFile));
    }
  }, [selectFile]);

  let preview;
  if (url) {
    if (selectFileType === "image") {
      preview = <img src={url} className="img-fluid" alt="preview" />;
    } else if (selectFileType === "video") {
      preview = (
        <video className="preview-video" controls>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  } else {
    preview = (
      <h5 className="d-flex justify-content-center align-items-center">
        Image / Video Preview
      </h5>
    );
  }

  return (
    <>
      <Container>
        <Row>
          <Col xs="6">{preview}</Col>
          <Col xs="6">
            {files.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-fixed">
                  <thead>
                    <tr>
                      <th scope="col" className="name-header">
                        Name
                      </th>
                      <th scope="col" className="type-header">
                        Type
                      </th>
                      <th scope="col" className="size-header">
                        Size
                      </th>
                      <th scope="col" className="view-header">
                        View
                      </th>
                      <th scope="col" className="delete-header">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => {
                      return (
                        <tr key={file.name}>
                          <th className="name-header">
                            <small>{file.name}</small>
                          </th>
                          <td className="type-header">
                            <small>{file.type}</small>
                          </td>
                          <td className="size-header">
                            <small>{bytesToSize(file.size)}</small>
                          </td>
                          <td className="view-header text-muted">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={(e) => handlePreview(index, e)}
                            >
                              <i className="fa fa-eye" aria-hidden="true"></i>
                            </button>
                          </td>
                          <td className="delete-header">
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={(e) => deleteFile(index, e)}
                            >
                              <i className="fa fa-trash" aria-hidden="true"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="files_list p-3">
                <h6 className="text-center text-muted">
                  No More Files/All Files are Updated
                </h6>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <Container className="upload-footer p-3">
        {fileStatusMsg && (
          <div className="fileupload_progress">
            <h6 className="text-center">{fileStatusMsg}</h6>
            {uploadPercentage > 0 ? (
              <Progress value={uploadPercentage} />
            ) : null}
          </div>
        )}
        <Row>
          <Col>
            <input
              type="file"
              className=""
              multiple
              onChange={(e) => updateFile(e, true)}
            />
          </Col>
          <Col>
            <Button color="primary" className="btn-block" onClick={submitFiles}>
              Upload
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
