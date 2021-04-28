import React, { useState, useRef, useEffect } from "react";

import {
  Row,
  Col,
  InputGroup,
  Button,
  Input,
  Container, 
} from "reactstrap";

import Multiselect from "react-widgets/lib/Multiselect";
import "react-widgets/dist/css/react-widgets.css";
import "./media_header.css";

export default function MediaHeader(props) {
  let { searchCallback, clearSearch, defaultTags, isPublicImagesTab, DateRange } = props;

  let [fileType, setFileType] = useState([]);
  let [searchText, setSearchText] = useState(null);
  let [tagVal, setTagVal] = useState([]);
  let [ filterParams, setFilterParams ] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [clear, setClear] = useState(false);

  const fileTypeRef = useRef([]);
  const recentUpdateRef = useRef(false);

  let handleSearchSubmit = () => {
    let searchFilter = { ...filterParams };

    if (tagVal.length > 0) {
      searchFilter["tags"] = tagVal;
    }

    if (fileType.length > 0) {
      searchFilter["file_extension"] = fileType;
    }

    let created_at;
    if (startDate) {
      created_at = startDate;
    }

    if (endDate) {
      created_at += " to " + endDate;
    }

    if (created_at) {
      searchFilter = { ...filterParams, created_at };
    }

    searchCallback(searchFilter);
  };

  let handleClearSearch = () => {
    setSearchText(null);
    resetElements(fileTypeRef.current);
    setTagVal([]);
    setFileType([]);
    recentUpdateRef.current = false;
    clearSearch();
  };

  let handleFileType = (file, index) => {
    // debugger;
    recentUpdateRef.current = true;
    if (fileTypeRef.current[index].classList.contains("btn-outline-primary")) {
      setFileType((fileType) => [...fileType, file]);
      fileTypeRef.current[index].classList.add("btn-primary");
      fileTypeRef.current[index].classList.remove("btn-outline-primary");
    } else {
      fileTypeRef.current[index].classList.remove("btn-primary");
      fileTypeRef.current[index].classList.add("btn-outline-primary");
      if (fileType.indexOf(file) >= 0) {
        // fileType.splice(fileType.filter((item) => item != "pdf"));
        setFileType(fileType.filter((item) => item !== file));
      }
    }
  };

  useEffect(() => {
    if (
      tagVal.length > 0 ||
      fileType.length > 0 ||
      searchText ||
      recentUpdateRef.current
    ) {
      handleSearchSubmit();
    }
  }, [tagVal, fileType, searchText]);

  let fileTypes = () => {
    let files = ["jpeg", "jpg", "png"];
    let returnFileType = files.map((file, index) => {
      return (
        <button
          key={index}
          ref={(ref) => (fileTypeRef.current[index] = ref)}
          type="button"
          className={"btn btn-outline-primary"}
          onClick={() => handleFileType(file, index)}
        >
          {file}
        </button>
      );
    });
    return returnFileType;
  };

  const handleFilterChange = (key, value) => {

    const updatedFilterParams = { ...filterParams, [key]: value };
    console.log(updatedFilterParams)
    setFilterParams(updatedFilterParams);
  }

  const handleDate = (date, type) => {
    if (type === "start") {
      setStartDate(date);
    } else if (type === "end") {
      setEndDate(date);
    }
  };

  let resetElements = (elements) => {
    elements.forEach((element) => {
      if (element.classList.contains("btn-primary")) {
        element.classList.remove("btn-primary");
        element.classList.add("btn-outline-primary");
      }
    });
  };

  let handleNewTag = (value, isCreate) => {    
    if (value.length <= 0) {
      recentUpdateRef.current = true;
    }
    if(isCreate) {
      setTagVal([...tagVal, value]);
    } else {
      setTagVal(value)
    }
    
  };

  return (
    <Container className="media_header">
      <Row className="media_header_title mb-2 pt-3 justify-content-between">
        <Col xs="12">
          <Row className="">
          <div className="ml-3 small col-lg-4 mb-2">
            <h6 className="d-flex font-weight-bold text-muted">
              {window.strings.ML_FileName || "File Name"}
            </h6>
            <Input
                placeholder={window.strings.ML_FileName || "File Name"}
                value={filterParams["upload_name"] || ""}
                onChange={(e) => handleFilterChange('upload_name', e.target.value)}
            />
          </div>
          <div className={`ml-3 small ${isPublicImagesTab ? "col-lg-3" : "col-lg-4"} mb-2` }>
            <h6 className="d-flex font-weight-bold text-muted">
              {window.strings.ML_extention || "Extention"}
            </h6>
            <Input
                placeholder={window.strings.ML_extention || "Extention"}
                value={filterParams["file_extension"] || ""}
                onChange={(e) => handleFilterChange('file_extension', e.target.value)}
              />
          </div>
          { isPublicImagesTab && 
          (<div className="ml-3 small col-lg-3 mb-2">
            <h6 className="d-flex font-weight-bold text-muted">
              {window.strings.ML_uploadedBy || "Uploaded By"}
            </h6>
            <Input
                        placeholder={window.strings.ML_uploadedBy || "Uploaded By"}
                        value={filterParams["uploader_name"] || ""}
                        onChange={(e) => handleFilterChange('uploader_name', e.target.value)}
            />
          </div>)
          }
          <div className="ml-3 small col-lg-4 mb-2">
            <h6 className="d-flex font-weight-bold text-muted">
              {window.strings.ML_uplodedOn || "Uploaded On"}
            </h6>
            <DateRange clear={clear} handleDate={handleDate} />
          </div>
          <div className="ml-3 small col-lg-4 mb-2">
            <h6 className="d-flex font-weight-bold text-muted">
              {window.strings.ML_tags || "Tags"}
            </h6>
            <Multiselect
                      data={defaultTags}
                      onChange={(value) => handleNewTag(value)}
                      value={tagVal}
            />
          </div>
      </Row>
      <div className="row ml-2">
            <InputGroup className="">
              <Button
                color="primary" 
                className="d-flex ml-2"
                size="sm" 
                onClick={handleSearchSubmit}>
                {window.strings.ML_search || "Search"}
              </Button>
              <Button
                className="d-flex ml-3 clearBtn"
                size="sm"
                color="primary"
                onClick={handleClearSearch}
              >
                {window.strings.ML_clear || "Clear"}
              </Button>
            </InputGroup>
      </div>
        </Col>
      </Row>
    </Container>
  );
}
