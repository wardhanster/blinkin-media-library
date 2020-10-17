import React, { useState, useRef, useEffect } from "react";

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

import Multiselect from "react-widgets/lib/Multiselect";
import "react-widgets/dist/css/react-widgets.css";

import "./media_header.css";

export default function MediaHeader(props) {
  let { searchCallback, clearSearch, defaultTags } = props;

  let [fileType, setFileType] = useState([]);
  let [searchText, setSearchText] = useState(null);
  let [tagVal, setTagVal] = useState([]);

  const fileTypeRef = useRef([]);
  const recentUpdateRef = useRef(false);

  let handleSearchSubmit = () => {
    let searchTerms = {};
    if (searchText) {
      searchTerms["search"] = searchText;
    }
    if (tagVal.length > 0) {
      searchTerms["tags"] = tagVal;
    }
    if (fileType.length > 0) {
      searchTerms["file_extension"] = fileType;
    }

    searchCallback(searchTerms);
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

  let resetElements = (elements) => {
    elements.forEach((element) => {
      if (element.classList.contains("btn-primary")) {
        element.classList.remove("btn-primary");
        element.classList.add("btn-outline-primary");
      }
    });
  };

  let handleNewTag = (value) => {
    if (value.length <= 0) {
      recentUpdateRef.current = true;
    }
    setTagVal(value);
  };

  return (
    <Container className="media_header">
      <Row className="media_header_title mb-2 pt-3 justify-content-between">
        <Col xs="12">
          <Container>
            <Row form>
              <Col md={6}>
                {/* <FormGroup>
                  <Label for="filetype" className="mr-1">
                    {window.strings.ML_fileType || "File Type"}
                  </Label>
                  <div className="btn-group  btn-group-sm">{fileTypes()}</div>
                </FormGroup> */}
                <FormGroup row>
                  <Label sm={1}>{window.strings.ML_tags || "Tags"}</Label>
                  <Col sm={10}>
                    <Multiselect
                      data={defaultTags}
                      onChange={(value) => handleNewTag(value)}
                      value={tagVal}
                    />
                  </Col>
                </FormGroup>
              </Col>
              <Col md="6" className="search_container">
                <InputGroup className=" search_holder">
                  <Input
                    placeholder={window.strings.ML_search || "Search"}
                    value={searchText || ""}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <InputGroupAddon
                    className="clearSearchBtn"
                    addonType="append"
                  >
                    <Button color="primary" onClick={handleSearchSubmit}>
                      {window.strings.ML_search || "Search"}
                    </Button>
                    <Button
                      className="clearBtn"
                      color="primary"
                      onClick={handleClearSearch}
                    >
                      {window.strings.ML_clear || "Clear"}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </Row>
          </Container>
        </Col>

        {/* <Col md="12" className="mt-2">
          <FormGroup row>
            <Label className="tag_label" sm={1}>
              {window.strings.ML_tags || "Tags"}
            </Label>
            <Col sm={10}>
              <Multiselect
                data={defaultTags}
                onChange={(value) => handleNewTag(value)}
                value={tagVal}
              />
            </Col>
          </FormGroup>
        </Col> */}
      </Row>
    </Container>
  );
}
