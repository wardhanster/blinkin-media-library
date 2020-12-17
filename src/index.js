import React, { useState } from "react";

import MediaHeader from "./lib/MediaHeader";
import TableItem from "./lib/Table";
import RecentCard from "./lib/RecentCard";
import { Container } from "reactstrap";

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
  const { uploadFiles, fetchAPI, deleteApi, sideModal, toggle, tags } = props;
  let [search, setSearch] = useState(null);
  let [data, setData] = useState(null);
  let [activeModal, setActiveModal] = useState(null);
  let [recentData, setRecentData] = useState(null);
  let [searchClear, setsearchClear] = useState(false);
  let [newBaseUrl, setNewBaseUrl] = useState(null);
  let perPageCount = 4;

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

  let fetchApi = async (pagenum, search) => {
    let response = await fetchAPI(pagenum, search);
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
    <Container>
      <MediaHeader
        defaultTags={tags}
        searchCallback={searchTerms}
        clearSearch={loadNewContent}
      />
      <RecentCard
        tags={tags}
        icons={fontAwesomeIcons}
        result={recentData}
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
        fetchAPI={fetchApi}
        deleteApi={deleteApi}
        handleClick={handleClick}
        bytesToSize={bytesToSize}
      />
      {activeModal &&
        sideModal(
          data,
          `${data.props.data.upload_name} - ${data.props.data.actualSizeInKb}`
        )}
    </Container>
  );
}
