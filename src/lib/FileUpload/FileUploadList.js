import React, { useState, useEffect, useRef } from "react";

import {
  Container,
  Button,
  Row,
  Col,
  Progress,
  FormGroup,
  Label,
} from "reactstrap";

export default function FileUploadList(props) {
  let { bytesToSize, tags, handleFileTagsDesc } = props;
  let [url, setUrl] = useState(null);
  let [selectFile, setSelectFile] = useState(null);
  let [selectFileType, setSelectFileType] = useState(null);
  let [fileIndex, setFileIndex] = useState(null);
  let [description, setDescription] = useState("");
  let [selectedTags, setSelectedTags] = useState([]);
  const elementsRef = useRef([]);
  let [displayName, setDisplayName] = useState();

  let {
    files,
    deleteFile,
    updateFile,
    submitFiles,
    fileStatusMsg,
    uploadPercentage,
  } = props;

  let resetClass = () => {
    elementsRef.current.forEach((item) => {
      if (item.classList.contains("btn-primary")) {
        item.classList.remove("btn-primary");
        item.classList.add("btn-outline-primary");
      }
    });
  };

  let handlePreview = (index, e) => {
    resetClass();
    setSelectFile(files[index]);
    setFileIndex(String(index));
    setDisplayName(files[index].name);
    let fileType = files[index].type.split("/")[0];
    setSelectFileType(fileType);
    if (files[index].description) {
      setDescription(files[index].description);
    } else {
      setDescription("");
    }
    if (files[index].tags) {
      setSelectedTags(files[index].tags);
    } else {
      setSelectedTags([]);
    }
  };

  let handleDelete = (index, e) => {
    let indexString = String(index);
    if (fileIndex) {
      if (fileIndex === indexString) {
        setSelectFileType((selectFileType) => null);
        setSelectFile((selectFile) => null);
      }
    }
    deleteFile(index, e);
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
    } else if (selectFileType) {
      setUrl("not_valid");
    } else {
      setUrl(null);
    }
  }, [selectFile]);

  let preview;
  if (url) {
    if (selectFileType === "image") {
      preview = (
        <img src={url} className="img-fluid preview-image" alt="preview" />
      );
    } else if (selectFileType === "video") {
      preview = (
        <video className="preview-video" controls>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      preview = (
        <div className="d-flex justify-content-center align-items-center">
          {selectFileType} Format Not able to load
        </div>
      );
    }
  } else {
    preview = (
      <h5 className="d-flex justify-content-center align-items-center">
        Image / Video Preview
      </h5>
    );
  }

  let handleTags = (tag, index) => {
    if (elementsRef.current[index].classList.contains("btn-outline-primary")) {
      elementsRef.current[index].classList.add("btn-primary");
      elementsRef.current[index].classList.remove("btn-outline-primary");
      setSelectedTags((selectedTags) => [...selectedTags, tag]);
      console.log(selectedTags);
    } else {
      elementsRef.current[index].classList.remove("btn-primary");
      elementsRef.current[index].classList.add("btn-outline-primary");
      const tagIndex = selectedTags.indexOf(tag);
      if (tagIndex > -1) {
        selectedTags.splice(tagIndex, 1);
        setSelectedTags(selectedTags);
      }
    }
  };

  let handleDescription = (e) => {
    setDescription(e.target.value);
    e.preventDefault();
  };

  let updateFileTagsDesc = () => {
    handleFileTagsDesc(fileIndex, { tags: selectedTags, description });
  };

  let returnBtnGroup = (selectFile) => {
    let returnItem = tags.map((tag, index) => {
      let classNew;
      if (selectFile.tags) {
        classNew = selectedTags.indexOf(tag) >= 0;
        if (classNew) {
          elementsRef.current[index].classList.add("btn-primary");
          elementsRef.current[index].classList.remove("btn-outline-primary");
        }
      } else {
        classNew = false;
      }
      return (
        <button
          key={index}
          ref={(ref) => (elementsRef.current[index] = ref)}
          type="button"
          className={"btn btn-outline-primary"}
          onClick={() => handleTags(tag, index)}
        >
          {tag}
        </button>
      );
    });
    return returnItem;
  };

  return (
    <>
      <Container>
        <Row>
          <Col xs="6">
            {preview}
            {selectFile && (
              <Row form className="desc_tags_container">
                <Col md={12}>
                  <FormGroup>
                    <Label for="name">Name {displayName}</Label>
                  </FormGroup>
                  <FormGroup>
                    <Label for="tags">Tags - </Label>
                    <div
                      className="btn-group btn-group-sm tags-container"
                      role="group"
                    >
                      {returnBtnGroup(selectFile)}
                    </div>
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label for="description">
                      Description (Max 100 Character)
                    </Label>
                    <textarea
                      value={description}
                      onChange={handleDescription}
                      className="form-control"
                      maxLength="100"
                      rows="3"
                    ></textarea>
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Button color="primary" onClick={updateFileTagsDesc}>
                      Update
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            )}
          </Col>
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
                              onClick={(e) => handleDelete(index, e)}
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
