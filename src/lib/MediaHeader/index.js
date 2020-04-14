import React, { useState } from "react";

import {
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  Button,
  Input,
  InputGroupText,
  Container,
} from "reactstrap";

import "./media_header.css";

export default function MediaHeader(props) {
  let { searchCallback, clearSearch } = props;
  let [showSearch, setshowSearch] = useState(false);

  let [fileType, setFileType] = useState([]);
  let [tags, setTags] = useState([]);
  let [description, setDescription] = useState("");
  let [clear, setClear] = useState("btn btn-outline-primary");
  let [searchText, setSearchText] = useState("");

  const handleClicktoShowSearch = () => {
    setshowSearch(!showSearch);
  };

  const clearAllSearchTerms = () => {
    console.log(tags);
    setDescription("");
    setFileType([]);
    setTags([]);
    handleSearch();
    setClear((clear) => "btn btn-outline-primary");
  };

  const toggleClass = (e) => {
    e.target.classList.toggle("btn-outline-primary");
    e.target.classList.toggle("btn-primary");
  };

  const handleFiles = (toHandleType, toHandle, e) => {
    if (e.target.classList.contains("btn-outline-primary")) {
      if (toHandleType === "tags") {
        setTags((tags) => [...tags, toHandle]);
      } else if (toHandleType === "fileType") {
        setFileType((fileType) => [...fileType, toHandle]);
      }
    } else {
      if (toHandleType === "tags") {
        let index = tags.indexOf(toHandle);
        if (index > -1) {
          tags.splice(index, 1);
        }
        setTags(tags);
      } else if (toHandleType === "fileType") {
        let index = fileType.indexOf(toHandle);
        if (index > -1) {
          fileType.splice(index, 1);
        }
        setTags(tags);
        setFileType(fileType);
      }
    }
    toggleClass(e);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSearch = () => {
    let searchTerms = {
      tags,
      fileType,
      searchDescription: description,
    };
    searchCallback(searchTerms);
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

  return (
    <Container className="media_header">
      <Row className="media_header_title mb-3">
        <Col xs="7"></Col>
        <Col xs="4">
          <InputGroup className="mt-2">
            <Input
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <InputGroupAddon addonType="append">
              <Button color="primary" onClick={handleSearchSubmit}>
                Search
              </Button>
              <Button color="primary" onClick={handleClearSearch}>
                Clear
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Col>
        <Col xs="1">
          <div className="mt-2">
            <Button color="primary" onClick={handleClicktoShowSearch} disabled>
              <i className="fa fa-filter" aria-hidden="true"></i>
            </Button>
          </div>
        </Col>
      </Row>
      <div id="filter" className="filter-container slideup">
        <Container>
          <Row>
            <Col xs="4">
              <InputGroup>
                <InputGroupAddon className="primary" addonType="prepend">
                  <InputGroupText>Description</InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Filter with description"
                  value={description}
                  onChange={onDescriptionChange}
                />
              </InputGroup>
            </Col>
            <Col xs="8">
              <div className="tags d-inline">
                <div className="d-inline text-weight">Tags : </div>
                <div className="d-inline">
                  <div className="btn-group  btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={(e) => handleFiles("tags", "apple", e)}
                    >
                      Apple
                    </button>
                    <button
                      type="button"
                      className={clear}
                      onClick={(e) => handleFiles("tags", "samsung", e)}
                    >
                      Samsung
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={(e) => handleFiles("tags", "sony", e)}
                    >
                      Sony
                    </button>
                  </div>
                </div>
              </div>
              <div className="file-filter d-inline ml-3">
                <div className="d-inline text-weight">Files : </div>
                <div className="d-inline">
                  <div className="btn-group  btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={(e) => handleFiles("fileType", "pdf", e)}
                    >
                      PDF
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={(e) => handleFiles("fileType", "image", e)}
                    >
                      Image
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={(e) => handleFiles("fileType", "video", e)}
                    >
                      Video
                    </button>
                  </div>
                </div>
              </div>
              <div className="ml-5 d-inline">
                <Button
                  className="btn-sm"
                  color="primary"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
              <div className="ml-2 d-inline">
                <Button
                  className="btn btn-default btn-sm"
                  onClick={clearAllSearchTerms}
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
