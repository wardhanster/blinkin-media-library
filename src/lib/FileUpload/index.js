import React, { useState, useRef, useCallback, useEffect } from "react";
import { Container } from "reactstrap";
import Swal from "sweetalert2";
import "./fileupload.css";
import FileUploadList from "./FileUploadList";

import FilePreviewModal from "./FilePreviewModal";
const acceptFileType = [
  "image/png", "image/jpeg", "image/jpg", "application/pdf",
  "video/mp4"
];
export default function FileUpload(props) {
  const {
    uploadFiles,
    bytesToSize,
    loadNewContent,
    tags,
    triggerAfterUpload,
    RenderPdf
  } = props;

  let fileInput = useRef(null);
  let [files, setFiles] = useState([]);
  let [modalStatus, setModalStatus] = useState(false);
  let [loadingMsg, setLoadingMsg] = useState(null);
  let [uploadPercentage, setUploadPercentage] = useState(0);
  let [allUploadPercentage, setAllUploadPercentage] = useState({});
  let [uploadSizeMsg, setUploadSizeMsg] = useState([]);

  useEffect(() => {
    if (files.length === 0) {
      if (fileInput) {
        fileInput.current.value = null;
      }
    }
  }, [files]);

  const deleteFile = useCallback((val, e) => {
    setFiles((files) => files.filter((file, index) => index !== val));
  }, []);

  const handleOnChange = (e, append = false) => {
    e.preventDefault();
    let orginalFiles = Array.from(e.target.files);
    let filesList = orginalFiles.filter(
      (file) => acceptFileType.indexOf(file.type) > -1
    );

    if (filesList.length <= 0) {
      Swal.fire(
        window.strings.ML_fileformatwarning ||
          "Note: Only png, jpeg, jpg, pdf and mp4 accepted"
      );
      if (append) {
        document.getElementById("preview_fileInput").value = null;
      }
    } else {
      // let filteredFiles = filesList.filter((file) => file.size < 20000000);
      function partition(array, isValid) {
        return array.reduce(
          ([pass, fail], elem) => {
            return isValid(elem)
              ? [[...pass, elem], fail]
              : [pass, [...fail, elem]];
          },
          [[], []]
        );
      }
      let [filteredFiles, filterMsg] = partition(
        filesList,
        (e) => e.size < 20000000
      );

      setUploadSizeMsg(filterMsg);

      if (append) {
        setFiles([...files, ...filteredFiles]);
      } else {
        if (filteredFiles.length > 0) {
          setFiles(filteredFiles);
          setModalStatus(true);
        } else if (filterMsg.length > 0) {
          setModalStatus(true);
        }
      }
    }
  };

  let fileItems = {};
  let expectedPercentage;

  const handleFileProgress = (progressPercentage, fileIndex) => {
    let fileIndexString = new String(fileIndex);
    if (fileIndexString && Number.isInteger(progressPercentage)) {
      setLoadingMsg(`Uploading ${files[fileIndex].name}`);
      setUploadPercentage(progressPercentage);

      fileItems[files[fileIndex].name] = progressPercentage;

      let newState = Object.assign({}, fileItems);
      newState[files[fileIndex].name] = progressPercentage;
      setAllUploadPercentage(newState);

      let res = Object.values(fileItems).reduce((total, num) => {
        return total + num;
      });

      if (res === expectedPercentage) {
        fileItems = {};
        setLoadingMsg(null);
        setUploadPercentage(null);
        setAllUploadPercentage({});

        if (fileInput) {
          fileInput.current.value = null;
        }
        setTimeout(() => {
          setModalStatus((modalStatus) => false);
          triggerAfterUpload(new Date().getTime());
        }, 800);

        expectedPercentage = 0;
        let newset = [...files];
        newset.splice(0, newset.length);
        setFiles(newset);
        if (document.body.classList.contains("modal-open")) {
          document.body.classList.remove("modal-open");
        }
      }
    }
  };

  const handleSubmitFiles = () => {
    expectedPercentage = files.length * 100;
    uploadFiles(files, handleFileProgress);
  };

  let onToggle = () => {
    fileItems = {};
    setLoadingMsg(null);
    setUploadPercentage(null);
    setAllUploadPercentage({});
    setModalStatus((modalStatus) => !modalStatus);
    if (fileInput) {
      fileInput.current.value = null;
    }
  };

  let handleFileTagsDesc = (index, data) => {
    const _files = files.slice()
    _files[index].tags = data.tags;
    _files[index].description = data.description;
    _files[index].is_global = data.makePublic;
    setFiles(_files);
  };

  return (
    <Container className="fileUploader">
      {files.length > 0 || uploadSizeMsg.length > 0 ? (
        <FilePreviewModal
          className="modal-xl preview-modal"
          modalStatus={modalStatus}
          toggle={onToggle}
          render={() => (
            <FileUploadList
              files={files}
              tags={tags}
              deleteFile={deleteFile}
              updateFile={handleOnChange}
              RenderPdf={RenderPdf}
              submitFiles={handleSubmitFiles}
              fileStatusMsg={loadingMsg}
              acceptFileType={acceptFileType}
              uploadPercentage={uploadPercentage}
              bytesToSize={bytesToSize}
              handleFileTagsDesc={handleFileTagsDesc}
              allUploadPercentage={allUploadPercentage}
              uploadFilesFailed={uploadSizeMsg}
            />
          )}
        />
      ) : (
        ""
      )}
      <div className="centered-container d-inline">
        <label className="btn btn-default fileLabel">
          <i className="fa fa-cloud-upload fa-3x" aria-hidden="true"></i>
          {window.strings.ML_browse || "Browse"}
          <input
            ref={fileInput}
            type="file"
            hidden
            accept={acceptFileType.join(',')}
            onChange={(e) => handleOnChange(e)}
            multiple
          />
        </label>
      </div>
    </Container>
  );
}
