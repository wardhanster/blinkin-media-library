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

export default function MediaFileList(props) {
  const { uploadFiles, fetchAPI, sideModal, toggle } = props;
  let [search, setSearch] = useState(null);
  let [data, setData] = useState(null);
  let [activeModal, setActiveModal] = useState(null);
  let [recentData, setRecentData] = useState(null);

  let searchTerms = (search) => {
    // setSearch(search);
  };

  let handleClick = (data, callback) => {
    setData(data);
    setActiveModal(true);
    toggle();
    callback();
  };

  let fetchApi = async (pagenum, search) => {
    let { result, baseUrl } = await fetchAPI(pagenum, search);
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
      <MediaHeader searchCallback={searchTerms} />
      <RecentCard
        result={recentData}
        uploadFiles={uploadFiles}
        bytesToSize={bytesToSize}
        baseUrl={baseUrl}
      />
      <TableItem
        baseUrl={baseUrl}
        search={search}
        fetchAPI={fetchApi}
        handleClick={handleClick}
        bytesToSize={bytesToSize}
      />
      {activeModal && sideModal(data)}
    </Container>
  );
}
