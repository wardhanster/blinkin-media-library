import React, { useState, useEffect, useRef } from "react";
import { Table } from "reactstrap";

import TableList from "./TableList";
import SidePreview from "./SidePreview";
// import SideModal from "../sideModal";
import Loading from "../Loading";

let isApiCallSuccess = false;
let initialLoad = true;
let perPageCount = 10;

export default function TableItem(props) {
  let { fetchAPI, search, handleClick, bytesToSize } = props;

  let [activePreviewData, setActivePreviewData] = useState(null);
  let [apicallTimes, setApiCallTimes] = useState(1);
  let [fileList, setFileList] = useState([]);
  let [loading, setLoading] = useState(true);
  let [showMoreDataMsg, setShowMoreDataMsg] = useState(false);
  let [baseUrl, setBaseUrl] = useState(null);
  let bottomRef = useRef(null);
  let pageNumRef = useRef(1);
  let searchFirst = useRef(false);

  const preview = (file, size) => {
    file.actualSizeInKb = size;
    file.url = `${baseUrl} ${file.file_url}`;
    file.random = Math.random();
    console.log("preview");
    setActivePreviewData(file);
  };

  useEffect(() => {
    if (activePreviewData) {
      handleClick(<SidePreview data={activePreviewData} />, () => {
        setActivePreviewData(null);
      });
    }
  }, [activePreviewData]);

  const callAPI = async (search = null) => {
    let { result: data, baseUrl } = await fetchAPI(pageNumRef.current, search);
    try {
      setBaseUrl(baseUrl);
      if (data.length > 0) {
        setLoading(false);
        isApiCallSuccess = true;

        if (searchFirst.current) {
          searchFirst.current = false;
          let newFileList = [...data];
          setFileList(newFileList);
        } else {
          // setFileList((fileList) => [...fileList, ...data]);
          // Remove duplicates in case if exist
          setFileList((fileList) => Array.from(new Set(fileList.concat(data))));
        }
        if (data.length >= perPageCount) {
          pageNumRef.current++;
        }
      } else {
        isApiCallSuccess = false;
        setLoading(false);
        setShowMoreDataMsg(true);
      }
    } catch (e) {
      isApiCallSuccess = false;
      setLoading(false);
      setShowMoreDataMsg(true);
    }

    initialLoad = false;
  };

  const scrollCallback = (entries) => {
    setLoading(true);
    if (entries[0].isIntersecting) {
      if (!initialLoad) {
        if (isApiCallSuccess) {
          setApiCallTimes((apicallTimes) => apicallTimes + 1);
        } else {
          callAPI(search);
        }
      }
    }
  };

  useEffect(() => {
    const scroll = new IntersectionObserver(scrollCallback, {
      rootMargin: "50px",
      threshold: 1,
    });
    scroll.observe(bottomRef.current);
    return () => {
      scroll.unobserve(bottomRef);
    };
  }, [bottomRef]);

  useEffect(() => {
    callAPI(search);
  }, [apicallTimes]);

  let refresh = () => {
    pageNumRef.current = pageNumRef.current - 1;
    setApiCallTimes((apicallTimes) => apicallTimes + 1);
  };

  useEffect(() => {
    if (search) {
      setFileList([]);
      setLoading(true);
      setShowMoreDataMsg(false);
      initialLoad = true;
      pageNumRef.current = 1;
      searchFirst.current = true;
      callAPI(search);
    }
  }, [search]);

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Size</th>
            <th>Created At</th>
            <th>Preview</th>
            <th>Delete</th>
            <th>
              <i
                onClick={refresh}
                className="fa fa-refresh"
                aria-hidden="true"
              ></i>
            </th>
          </tr>
        </thead>
        <tbody>
          {fileList.length > 0 && (
            <TableList
              fileList={fileList}
              preview={preview}
              bytesToSize={bytesToSize}
            />
          )}
        </tbody>
      </Table>
      {loading && <Loading />}
      {showMoreDataMsg && (
        <div className="no_more p-3 border mb-2">
          <p className="text-muted text-center mb-0">No More Results</p>
        </div>
      )}
      <div ref={bottomRef}></div>
    </>
  );
}
