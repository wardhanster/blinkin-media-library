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
  "x-ms-video",
  "video",
];
export default function MediaFileList(props) {
  const { uploadFiles, fetchAPI, sideModal, toggle } = props;
  let [search, setSearch] = useState(null);
  let [data, setData] = useState(null);
  let [activeModal, setActiveModal] = useState(null);
  let [recentData, setRecentData] = useState(null);
  let [searchClear, setsearchClear] = useState(false);

  let searchTerms = (search) => {
    setSearch(search);
  };

  let loadNewContent = () => {
    setSearch(null);
    setsearchClear((searchClear) => true);
  };
  function fontAwesomeIcons(format) {
    let formatType;

    if (image.indexOf[format] >= 0) {
      formatType = "image";
    } else if (video.indexOf[format] >= 0) {
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
      }
    }

    return {
      result,
      baseUrl,
    };
  };

  return (
    <Container>
      <MediaHeader searchCallback={searchTerms} clearSearch={loadNewContent} />
      <RecentCard
        icons={fontAwesomeIcons}
        result={recentData}
        uploadFiles={uploadFiles}
        bytesToSize={bytesToSize}
        baseUrl={baseUrl}
        loadNewContent={loadNewContent}
        handleClick={handleClick}
      />
      <TableItem
        icons={fontAwesomeIcons}
        baseUrl={baseUrl}
        searchClear={searchClear}
        search={search}
        fetchAPI={fetchApi}
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
