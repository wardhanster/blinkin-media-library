import React, { useState, useEffect, useRef } from "react";

import {
  Container,
  Button,
  Row,
  Col,
  Progress,
  FormGroup,
  Label,
  Fade,
  Table,
} from "reactstrap";

export default function FileUploadList(props) {
  let { bytesToSize, tags, handleFileTagsDesc, allUploadPercentage } = props;
  let [url, setUrl] = useState(null);
  let [selectFile, setSelectFile] = useState(null);
  let [selectFileType, setSelectFileType] = useState(null);
  let [fileIndex, setFileIndex] = useState(null);
  let [description, setDescription] = useState("");
  let [selectedTags, setSelectedTags] = useState([]);
  const elementsRef = useRef([]);
  let [uploadType, setUploadType] = useState(false);

  const [fadeIn, setFadeIn] = useState(false);

  let [displayName, setDisplayName] = useState();

  let { files, deleteFile, updateFile, submitFiles } = props;

  const toggleFade = () => setFadeIn(!fadeIn);

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
    setFadeIn(false);
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
          {selectFileType}
          {window.String.ML_formatNotAbleToLoad || "Format Not able to load"}
        </div>
      );
    }
  } else {
    preview = (
      <h5 className="d-flex justify-content-center align-items-center">
        {window.String.ML_imageOrVideoPreview || "Image / Video Preview"}
      </h5>
    );
  }

  let handleTags = (tag, index) => {
    if (elementsRef.current[index].classList.contains("btn-outline-primary")) {
      elementsRef.current[index].classList.add("btn-primary");
      elementsRef.current[index].classList.remove("btn-outline-primary");
      setSelectedTags((selectedTags) => [...selectedTags, tag]);
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
    setFadeIn(true);
    handleFileTagsDesc(fileIndex, { tags: selectedTags, description });
  };

  let handleFileUpload = () => {
    // document.querySelectorAll(".disable_btn")[0].disabled = true;
    setUploadType((uploadType) => true);
    debugger;
    submitFiles();
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
          <Col xs="5">
            {preview}
            {selectFile && (
              <Row form className="desc_tags_container">
                <Col md={12}>
                  <FormGroup>
                    <Label for="name">
                      {window.String.ML_name || "Name"} {displayName}
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Label for="tags">
                      {window.String.ML_tags || "Tags"} -{" "}
                    </Label>
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
                      {window.String.ML_description || "Description"} (
                      {window.String.ML_max100Character || "Max 100 Character"})
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
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Button
                          color="primary"
                          onClick={updateFileTagsDesc}
                          block
                        >
                          Save
                        </Button>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <Fade
                        in={fadeIn}
                        tag="h6"
                        className="fade_container mt-2"
                      >
                        {window.String.ML_savedChanges || "Saved Changes"}
                      </Fade>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </Col>
          <Col xs="7">
            {files.length > 0 ? (
              <div className="table-responsive">
                <Table className="upload-list-container">
                  <thead>
                    <tr>
                      <th scope="col" className="name-header">
                        {window.String.ML_name || "Name"}
                      </th>
                      <th scope="col" className="type-header">
                        {window.String.ML_description || "Description"}
                      </th>
                      <th scope="col" className="type-header">
                        {window.String.ML_type || "Type"}
                      </th>
                      <th scope="col" className="size-header">
                        {window.String.ML_size || "Size"}
                      </th>
                      <th scope="col" className="view-header">
                        {window.String.ML_edit || "Edit"}
                      </th>
                      <th scope="col" className="delete-header">
                        {window.String.ML_delete || "Delete"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => {
                      let percentageValue;
                      if (allUploadPercentage) {
                        percentageValue = allUploadPercentage[file.name];
                      }
                      return (
                        <tr key={file.name}>
                          <th className="name-header">
                            <small>{file.name}</small>
                            {percentageValue && (
                              <Progress
                                className="ind_progress"
                                value={percentageValue}
                              />
                            )}
                          </th>
                          <td
                            className="type-desc"
                            title={file.description ? file.description : ""}
                          >
                            {file.description && file.description}
                          </td>
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
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>
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
                </Table>
              </div>
            ) : (
              <div className="files_list p-3">
                <h6 className="text-center text-muted">
                  {window.String.ML_noMoreFilesOrAllFilesUpdated ||
                    " No More Files/All Files are Updated"}
                </h6>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <Container className="upload-footer p-3">
        <Row>
          <Col>
            <input
              type="file"
              className=""
              multiple
              onChange={(e) => updateFile(e, true)}
              disabled={uploadType}
            />
          </Col>
          <Col>
            <Button
              color="primary"
              className="btn-block"
              onClick={handleFileUpload}
              disabled={uploadType}
            >
              {window.String.ML_upload || "Upload"}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
