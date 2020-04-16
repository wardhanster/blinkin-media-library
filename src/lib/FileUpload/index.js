import React, { useState, useRef, useCallback } from "react";
import { Container } from "reactstrap";

import "./fileupload.css";
import FileUploadList from "./FileUploadList";

import FilePreviewModal from "./FilePreviewModal";

export default function FileUpload(props) {
  const { uploadFiles, bytesToSize, loadNewContent } = props;

  let fileInput = useRef(null);
  let [files, setFiles] = useState([]);
  let [modalStatus, setModalStatus] = useState(false);
  let [loadingMsg, setLoadingMsg] = useState(null);
  let [uploadPercentage, setUploadPercentage] = useState(0);

  const deleteFile = useCallback((val, e) => {
    setFiles((files) => files.filter((file, index) => index !== val));
  }, []);

  const handleOnChange = (e, append = false) => {
    e.preventDefault();
    if (append) {
      setFiles([...files, ...Array.from(e.target.files)]);
    } else {
      if (e.target.files.length > 0) {
        setFiles(Array.from(e.target.files));
        console.log(files);
        setModalStatus(true);
      }
    }
  };

  let fileItems = [];
  const handleFileProgress = (progressPercentage, fileIndex) => {
    setLoadingMsg(`Uploading ${files[fileIndex].name}`);
    setUploadPercentage(progressPercentage);

    if (fileItems.indexOf(files[fileIndex].name) <= -1) {
      fileItems.push(files[fileIndex].name);
    }

    if (fileItems.length === files.length) {
      if (progressPercentage > 80) {
        fileItems.length = 0;
        setLoadingMsg(null);
        setUploadPercentage(null);
        setModalStatus((modalStatus) => !modalStatus);
        loadNewContent();
      }
    }
  };

  const handleSubmitFiles = () => {
    uploadFiles(files, handleFileProgress);
  };

  let onToggle = () => {
    setLoadingMsg(null);
    setFiles([]);
    setModalStatus((modalStatus) => !modalStatus);
    if (fileInput) {
      fileInput.current.value = null;
    }
  };
  return (
    <Container className="fileUploader">
      <FilePreviewModal
        className="modal-xl preview-modal"
        modalStatus={modalStatus}
        toggle={onToggle}
        render={() => (
          <FileUploadList
            files={files}
            deleteFile={deleteFile}
            updateFile={handleOnChange}
            submitFiles={handleSubmitFiles}
            fileStatusMsg={loadingMsg}
            uploadPercentage={uploadPercentage}
            bytesToSize={bytesToSize}
          />
        )}
      />
      <div className="centered-container d-inline">
        <label className="btn btn-default fileLabel">
          <i className="fa fa-cloud-upload fa-3x" aria-hidden="true"></i>
          Browse
          <input
            ref={fileInput}
            type="file"
            hidden
            onChange={(e) => handleOnChange(e)}
            multiple
          />
        </label>
      </div>
    </Container>
  );
}
