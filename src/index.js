import React, { useState } from "react";

import MediaHeader from "./lib/MediaHeader";
import TableItem from "./lib/Table";
import RecentCard from "./lib/RecentCard";
import { Container, TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from "reactstrap";

// function to convert byte to KB/MB/GB/TB
function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

// baseUrl to preview files
let baseUrl;
let image = [
  "bmp",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "svg+xml",
  "tiff",
  "webp",
  "image",
];
let video = [
  "mpeg",
  "ogg",
  "mp2t",
  "webm",
  "3gpp",
  "3gpp2",
  "mp4",
  "x-ms-video",
  "video",
];
export default function MediaFileList(props) {
  const { uploadFiles, fetchAPI, deleteApi, sideModal, toggle, tags, RenderPdf, DateRange } = props;
  let [search, setSearch] = useState(null);
  let [data, setData] = useState(null);
  let [activeModal, setActiveModal] = useState(null);
  let [recentData, setRecentData] = useState(null);
  let [searchClear, setsearchClear] = useState(false);
  let [newBaseUrl, setNewBaseUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('ownFiles');

  let perPageCount = 4;

  const toggleTabs = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  let searchTerms = (search) => {
    setSearch(search);
  };

  let loadNewContent = () => {
    setSearch(null);
    setsearchClear((searchClear) => true);
  };

  let triggerAfterUpload = (val) => {
    setsearchClear((searchClear) => val);
  };

  function fontAwesomeIcons(format) {
    let formatType;

    if (image.indexOf(format) >= 0) {
      formatType = "image";
    } else if (video.indexOf(format) >= 0) {
      formatType = "video";
    } else {
      formatType = format;
    }

    switch (formatType) {
      case "docx":
        return "fa fa-file-word-o";
      case "image":
        return "fa fa-file-image-o";
      case "pdf":
        return "fa fa-file-pdf-o";
      case "video":
        return "fa fa-file-video-o";
      case "rtf":
        return "fa fa-file-text-o";
      default:
        return "fa fa-file-text";
    }
  }

  let handleClick = (data, callback) => {
    setData(data);
    setActiveModal(true);
    toggle();
    if (callback) {
      callback();
    }
  };

  let fetchOwnFilesApi = async (pagenum, search) => {
    let response = await fetchAPI(pagenum, search, false);
    let result = response.data;
    let baseUrl = response.baseUrl;
    if (!recentData && result) {
      if (result.length > 3) {
        setRecentData(result.slice(0, 3));
        setNewBaseUrl(baseUrl);
      }
    }

    return {
      result,
      baseUrl,
    };
  };

  let fetchPublicFilesApi = async (pagenum, search) => {
    let response = await fetchAPI(pagenum, search, true);
    let result = response.data;
    let baseUrl = response.baseUrl;
    if (!recentData && result) {
      if (result.length > 3) {
        setRecentData(result.slice(0, 3));
        setNewBaseUrl(baseUrl);
      }
    }

    return {
      result,
      baseUrl,
    };
  };

  return (
    <Container className="p-3 mt-3 bg-white border">
      <Nav tabs>
      <NavItem>
          <NavLink
            className={`${activeTab === 'ownFiles'  && "active"}`}
            onClick={() => { toggleTabs('ownFiles'); }}
          >
            Own Files
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={`${activeTab === 'globalFiles' && "active"} `}
            onClick={() => { toggleTabs('globalFiles'); }}
          >
            Global Files
          </NavLink>
        </NavItem>        
      </Nav>
      <TabContent activeTab={activeTab}>
      <TabPane tabId="ownFiles">
      <MediaHeader
        defaultTags={tags}
        searchCallback={searchTerms}
        clearSearch={loadNewContent}
        DateRange={DateRange}
      />
      <RecentCard
        tags={tags}
        icons={fontAwesomeIcons}
        result={recentData}
        RenderPdf={RenderPdf}
        uploadFiles={uploadFiles}
        bytesToSize={bytesToSize}
        baseUrl={newBaseUrl}
        loadNewContent={loadNewContent}
        handleClick={handleClick}
        triggerAfterUpload={triggerAfterUpload}
      />
      <TableItem
        perPageCount={perPageCount}
        icons={fontAwesomeIcons}
        baseUrl={baseUrl}
        searchClear={searchClear}
        search={search}
        fetchAPI={fetchOwnFilesApi}
        deleteApi={deleteApi}
        handleClick={handleClick}
        bytesToSize={bytesToSize}
      />
      {activeModal &&
        sideModal(
          data,
          `${data.props.data.upload_name} - ${data.props.data.actualSizeInKb}`
        )}
        </TabPane>
        <TabPane tabId="globalFiles">
        <MediaHeader
          defaultTags={tags}
          searchCallback={searchTerms}
          clearSearch={loadNewContent}
          DateRange={DateRange}
          isPublicImagesTab
      />
      <RecentCard
        tags={tags}
        icons={fontAwesomeIcons}
        result={recentData}
        RenderPdf={RenderPdf}
        uploadFiles={uploadFiles}
        bytesToSize={bytesToSize}
        baseUrl={newBaseUrl}
        loadNewContent={loadNewContent}
        handleClick={handleClick}
        triggerAfterUpload={triggerAfterUpload}
      />
      <TableItem
        perPageCount={perPageCount}
        icons={fontAwesomeIcons}
        baseUrl={baseUrl}
        searchClear={searchClear}
        search={search}
        fetchAPI={fetchPublicFilesApi}
        deleteApi={deleteApi}
        handleClick={handleClick}
        bytesToSize={bytesToSize}
      />
      {activeModal &&
        sideModal(
          data,
          `${data.props.data.upload_name} - ${data.props.data.actualSizeInKb}`
        )}
        </TabPane>
      </TabContent>
    </Container>
  );
}
