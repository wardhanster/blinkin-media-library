import React, { useState, useRef } from "react";

import {
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Button,
  Input,
  Container,
  FormGroup,
  Label,
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

  let handleSearchSubmit = () => {
    let searchTerms = {
      search: searchText,
      tags,
      file_extension: fileType,
    };
    searchCallback(searchTerms);
  };

  let handleClearSearch = () => {
    setSearchText("");
    resetElements(tagsRef.current);
    resetElements(fileTypeRef.current);
    setTags([]);
    setFileType([]);
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
        tags.splice(tags.indexOf(tag), 1);
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
    debugger;
    if (fileTypeRef.current[index].classList.contains("btn-outline-primary")) {
      setFileType([...fileType, file]);
      fileTypeRef.current[index].classList.add("btn-primary");
      fileTypeRef.current[index].classList.remove("btn-outline-primary");
    } else {
      fileTypeRef.current[index].classList.remove("btn-primary");
      fileTypeRef.current[index].classList.add("btn-outline-primary");
      if (fileType.indexOf(file) >= 0) {
        fileType.splice(fileType.indexOf(file), 1);
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

  let handleNewTags = (e) => {
    console.log(e);
  };

  return (
    <Container className="media_header">
      <Row className="media_header_title mb-2 pt-3">
        <Col xs="8">
          <Container>
            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="exampleCity">Tags</Label>
                  <div className="btn-group  btn-group-sm">{returnTags()}</div>
                </FormGroup>
              </Col>
              <Col md={1}></Col>
              <Col md={8}>
                <FormGroup>
                  <Label for="exampleState">File Type</Label>
                  <div className="btn-group  btn-group-sm">{fileTypes()}</div>
                </FormGroup>
              </Col>
            </Row>
          </Container>
        </Col>
        <Col xs="4" className="search_container">
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
        {/* <Col xs="1">
          <div className="mt-2">
            <Button color="primary" onClick={handleClicktoShowSearch}>
              <i className="fa fa-filter" aria-hidden="true"></i>
            </Button>
          </div>
        </Col> */}
      </Row>
    </Container>
  );
}
