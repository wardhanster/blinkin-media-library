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
  Alert,
} from "reactstrap";

export default function FileUploadList(props) {
  let {
    bytesToSize,
    tags,
    handleFileTagsDesc,
    allUploadPercentage,
    files,
    deleteFile,
    updateFile,
    submitFiles,
  } = props;
  let [url, setUrl] = useState(null);
  let [selectFile, setSelectFile] = useState(null);
  let [selectFileType, setSelectFileType] = useState(null);
  let [fileIndex, setFileIndex] = useState(null);
  let [description, setDescription] = useState("");
  let [selectedTags, setSelectedTags] = useState([]);
  const elementsRef = useRef([]);
  let [uploadType, setUploadType] = useState(false);
  let [disableFile, setDisableFile] = useState(false);
  let [allFiles, setAllFiles] = useState(files);
  const [fadeIn, setFadeIn] = useState(false);

  let [displayName, setDisplayName] = useState();

  const toggleFade = () => setFadeIn(!fadeIn);

  let resetClass = () => {
    try {
      elementsRef.current.forEach((item) => {
        if (item.classList.contains("btn-primary")) {
          item.classList.remove("btn-primary");
          item.classList.add("btn-outline-primary");
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  let handlePreview = (index, e) => {
    // resetClass();
    setUrl(null);
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
    elementsRef.current[index] = null;
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

  useEffect(() => {
    if (files.length <= 0) {
      setUploadType((uploadType) => true);
    } else {
      setUploadType((uploadType) => false);
    }
  }, [files]);

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
          {window.strings.ML_videoNotSupported ||
            " Your browser does not support the video tag."}
        </video>
      );
    } else {
      preview = (
        <div className="d-flex justify-content-center align-items-center">
          {selectFileType}
          {window.strings.ML_formatNotAbleToLoad || "Format Not able to load"}
        </div>
      );
    }
  } else {
    preview = (
      <h5 className="d-flex justify-content-center align-items-center">
        {window.strings.ML_imageOrVideoPreview || "Image / Video Preview"}
      </h5>
    );
  }

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
    setDisableFile((disableFile) => true);
    submitFiles();
  };

  const handleNewTags = (tag, e) => {
    e.persist();
    if (files[fileIndex].tags.indexOf(tag) > -1) {
      files[fileIndex].tags.pop(tag);
      e.target.classList.remove("btn-primary");
      e.target.classList.add("btn-outline-primary");
      const tagIndex = selectFile.tags.indexOf(tag);
      if (tagIndex > -1) {
        selectedTags.splice(tagIndex, 1);
        setSelectedTags(selectedTags);
      }
    } else {
      e.target.classList.add("btn-primary");
      e.target.classList.remove("btn-outline-primary");
      // files[fileIndex].tags.push(tag);
      setSelectedTags((selectedTags) => [...selectedTags, tag]);
    }
  };

  const returnGroup = (selectFile) => {
    selectFile["tags"] = selectFile["tags"] ? selectFile["tags"] : [];
    return tags.map((tag, index) => {
      let act = selectFile.tags.indexOf(tag) > -1 ? true : false;
      return (
        <button
          key={index}
          type="button"
          className={`${act ? "btn btn-primary" : "btn btn-outline-primary"}`}
          onClick={(e) => handleNewTags(tag, e)}
        >
          {tag}
        </button>
      );
    });
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
                      {window.strings.ML_name || "Name"} {displayName}
                    </Label>
                  </FormGroup>
                  <FormGroup>
                    <Label for="tags">
                      {window.strings.ML_tags || "Tags"} -{" "}
                    </Label>
                    <div
                      className="btn-group btn-group-sm tags-container"
                      role="group"
                    >
                      {/* {returnBtnGroup(selectFile)} */}
                      {returnGroup(selectFile)}
                    </div>
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label for="description">
                      {window.strings.ML_description || "Description"} (
                      {window.strings.ML_max100Character || "Max 100 Character"}
                      )
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
                        {window.strings.ML_savedChanges || "Saved Changes"}
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
                        {window.strings.ML_name || "Name"}
                      </th>
                      <th scope="col" className="type-header">
                        {window.strings.ML_description || "Description"}
                      </th>
                      <th scope="col" className="type-header">
                        {window.strings.ML_type || "Type"}
                      </th>
                      <th scope="col" className="size-header">
                        {window.strings.ML_size || "Size"}
                      </th>
                      <th scope="col" className="view-header">
                        {window.strings.ML_edit || "Edit"}
                      </th>
                      <th scope="col" className="delete-header">
                        {window.strings.ML_delete || "Delete"}
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
                  {window.strings.ML_noMoreFilesOrAllFilesUpdated ||
                    " No More Files/All Files are Updated"}
                </h6>
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            {props.uploadFilesFailed.map((file) => {
              return (
                <Alert color="warning">
                  <strong>{file.name}</strong>{" "}
                  {window.strings.ML_fileSizeExit ||
                    "This file is too large to upload.The maximum supported file size is 20mb"}
                </Alert>
              );
            })}
          </Col>
          <Col>
            <b>
              {window.strings.ML_fileformatwarning ||
                "Note: Only png,jpeg and jpg accepted"}
            </b>
          </Col>
        </Row>
      </Container>
      <Container className="upload-footer p-3">
        <Row>
          <Col>
            <input
              type="file"
              id="preview_fileInput"
              className=""
              accept="image/jpeg, image/png,image/jpg"
              multiple
              onChange={(e) => updateFile(e, true)}
              disabled={disableFile}
            />
          </Col>
          <Col>
            <Button
              color="primary"
              className="btn-block"
              onClick={handleFileUpload}
              disabled={uploadType}
            >
              {window.strings.ML_upload || "Upload"}
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
