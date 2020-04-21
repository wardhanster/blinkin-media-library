import React, { useState, useRef } from "react";

import {
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Button,
  Input,
  Container,
} from "reactstrap";

import "./media_header.css";

export default function MediaHeader(props) {
  let { searchCallback, clearSearch, defaultTags } = props;
  let [showSearch, setshowSearch] = useState(false);

  let [fileType, setFileType] = useState([]);
  let [tags, setTags] = useState([]);
  let [searchText, setSearchText] = useState(null);

  const tagsRef = useRef([]);
  const fileTypeRef = useRef([]);

  const handleClicktoShowSearch = () => {
    setshowSearch(!showSearch);
    if (showSearch) {
      clearAllUpdates(true);
    }
  };

  React.useEffect(() => {
    let activeDiv = document.querySelector(".filter-container");
    if (!showSearch) {
      activeDiv.classList.remove("slidedown");
      activeDiv.classList.add("slideup");
    } else {
      activeDiv.classList.remove("slideup");
      activeDiv.classList.add("slidedown");
    }
  }, [showSearch]);

  let handleSearchSubmit = () => {
    searchCallback(searchText);
  };

  let handleClearSearch = () => {
    setSearchText("");
    clearSearch();
  };

  let handleTags = (tag, index) => {
    if (tagsRef.current[index].classList.contains("btn-outline-primary")) {
      setTags([...tags, tag]);
      tagsRef.current[index].classList.add("btn-primary");
      tagsRef.current[index].classList.remove("btn-outline-primary");
    } else {
      tagsRef.current[index].classList.remove("btn-primary");
      tagsRef.current[index].classList.add("btn-outline-primary");
      if (tags.indexOf(tag) >= 0) {
        tags.splice(index, 1);
        setTags(tags);
      }
    }
  };

  let returnTags = () => {
    let returnItem = defaultTags.map((tag, index) => {
      return (
        <button
          key={index}
          ref={(ref) => (tagsRef.current[index] = ref)}
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

  let handleFileType = (file, index) => {
    if (fileTypeRef.current[index].classList.contains("btn-outline-primary")) {
      setFileType([...fileType, file]);
      fileTypeRef.current[index].classList.add("btn-primary");
      fileTypeRef.current[index].classList.remove("btn-outline-primary");
    } else {
      fileTypeRef.current[index].classList.remove("btn-primary");
      fileTypeRef.current[index].classList.add("btn-outline-primary");
      if (fileType.indexOf(file) >= 0) {
        fileType.splice(index, 1);
        setFileType(fileType);
      }
    }
  };

  let fileTypes = () => {
    let files = [
      "jpeg",
      "jpg",
      "png",
      "tiff",
      "mpeg",
      "mp4",
      "3gp",
      "docx",
      "rtf",
      "pdf",
      "ods",
    ];
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

  let handleUpdate = () => {
    let searchTerms = {
      search: searchText,
      tags,
      file_extension: fileType,
    };
    searchCallback(searchTerms);
  };

  let resetElements = (elements) => {
    elements.forEach((element) => {
      if (element.classList.contains("btn-primary")) {
        element.classList.remove("btn-primary");
        element.classList.add("btn-outline-primary");
      }
    });
  };

  let clearAllUpdates = (slideup = null) => {
    if (searchText) {
      searchCallback(searchText);
    } else if (tags.length > 0 || fileType.length > 0) {
      clearSearch();
    }
    resetElements(tagsRef.current);
    resetElements(fileTypeRef.current);
    setTags([]);
    setFileType([]);
  };

  return (
    <Container className="media_header">
      <Row className="media_header_title mb-3">
        <Col xs="6"></Col>
        <Col xs="5">
          <InputGroup className="mt-2">
            <Input
              placeholder="Search"
              value={searchText || ""}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <InputGroupAddon className="clearSearchBtn" addonType="append">
              <Button color="primary" onClick={handleSearchSubmit}>
                Search
              </Button>
              <Button
                className="clearBtn"
                color="primary"
                onClick={handleClearSearch}
              >
                Clear
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Col>
        <Col xs="1">
          <div className="mt-2">
            <Button color="primary" onClick={handleClicktoShowSearch}>
              <i className="fa fa-filter" aria-hidden="true"></i>
            </Button>
          </div>
        </Col>
      </Row>
      <div id="filter" className="filter-container slideup">
        <Container>
          <Row>
            <Col xs="12">
              <div className="tags d-inline">
                <div className="d-inline text-weight">Tags : </div>
                <div className="d-inline">
                  <div className="btn-group  btn-group-sm">{returnTags()}</div>
                </div>
              </div>
              <div className="file-filter d-inline ml-3">
                <div className="d-inline text-weight">Files : </div>
                <div className="d-inline">
                  <div className="btn-group  btn-group-sm">{fileTypes()}</div>
                </div>
              </div>
              <div className="ml-5 d-inline">
                <Button
                  className="btn-sm"
                  color="primary"
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              </div>
              <div className="ml-2 d-inline">
                <Button
                  className="btn btn-default btn-sm"
                  onClick={clearAllUpdates}
                >
                  Clear
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Container>
  );
}
