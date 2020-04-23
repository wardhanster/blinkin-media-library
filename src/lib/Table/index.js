import React, { useState, useEffect, useRef } from "react";
import { Table, Button } from "reactstrap";

import TableList from "./TableList";
import SidePreview from "./SidePreview";
import Loading from "../Loading";

import "./table.css";

let isApiCallSuccess = false;
let initialLoad = true;
let scroll;

const snackBar = (status) => {
  return (
    <div id="snackbar" className={status ? "show" : ""}>
      Copied to Clipboard
    </div>
  );
};

export default function TableItem(props) {
  let {
    fetchAPI,
    search,
    handleClick,
    bytesToSize,
    icons,
    searchClear,
    perPageCount,
  } = props;

  let [activePreviewData, setActivePreviewData] = useState(null);
  let [apicallTimes, setApiCallTimes] = useState(1);
  let [fileList, setFileList] = useState([]);
  let [mainLoading, setMainLoading] = useState(true);
  let [loading, setLoading] = useState(false);
  let [showMoreDataMsg, setShowMoreDataMsg] = useState(false);
  let [baseUrl, setBaseUrl] = useState(null);
  let bottomRef = useRef(null);
  let [noResults, setNoResults] = useState(false);
  let pageNumRef = useRef(1);
  let isIntersectRef = useRef(false);
  let searchFirst = useRef(false);
  let [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
  let [showSnackBar, setShowSnackBar] = useState(false);
  let [intersect, setIntersect] = useState(false);

  const preview = (file, size) => {
    file.actualSizeInKb = size;
    file.url = `${baseUrl}${file.file_url}`;
    file.random = Math.random();
    setActivePreviewData(file);
  };

  useEffect(() => {
    if (activePreviewData) {
      handleClick(<SidePreview data={activePreviewData} />, () => {
        setActivePreviewData(null);
      });
    }
  }, [activePreviewData]);

  const removeDuplicates = (res, keyItem) => {
    return Array.from(new Set(res.map((a) => a.file_url))).map((file_url) => {
      return res.find((a) => a.file_url === file_url);
    });
  };

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
          let newFiles = [...fileList, ...data];
          console.log(newFiles);
          let newfileList = removeDuplicates(newFiles);
          setFileList((fileList) => newfileList);
        }
        if (data.length >= perPageCount) {
          pageNumRef.current++;
        }
      } else {
        isApiCallSuccess = false;
        setLoading(false);
        setShowMoreDataMsg(true);
        if (fileList.length <= 0) {
          setNoResults(true);
        }
      }
    } catch (e) {
      isApiCallSuccess = false;
      setLoading(false);
      setShowMoreDataMsg(true);
    }

    initialLoad = false;
    setMainLoading(false);
    if (
      document.documentElement.scrollHeight >
      document.documentElement.clientHeight
    ) {
      setShowLoadMoreBtn(false);
    } else {
      if (data.length > 0) {
        setShowLoadMoreBtn(true);
      } else {
        setShowLoadMoreBtn(false);
      }
    }

    if (!intersect) {
      if (showMoreDataMsg) {
      } else {
        setShowLoadMoreBtn(true);
      }
    }
  };

  const scrollCallback = (entries, observer) => {
    setLoading(true);
    if (entries[0].isIntersecting) {
      setIntersect(true);
      isIntersectRef.current = false;
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
    scroll = new IntersectionObserver(scrollCallback, {
      root: document.querySelector(".table"),
      rootMargin: "50px",
      threshold: 1,
    });
    scroll.observe(bottomRef.current);
    return () => {
      scroll.unobserve(bottomRef.current);
    };
  }, [bottomRef]);

  useEffect(() => {
    callAPI(search);
  }, [apicallTimes]);

  let refresh = () => {
    if (pageNumRef > 1) {
      pageNumRef.current = pageNumRef.current - 1;
    }
    setApiCallTimes((apicallTimes) => apicallTimes + 1);
  };

  useEffect(() => {
    if (search || searchClear) {
      setFileList([]);
      setLoading(true);
      setShowMoreDataMsg(false);
      initialLoad = true;
      pageNumRef.current = 1;
      searchFirst.current = true;
      callAPI(search);
    }
  }, [search, searchClear]);

  let loadNext = () => {
    if (pageNumRef.current >= fileList.length) {
      pageNumRef.current = pageNumRef.current + 1;
    }
    setApiCallTimes((apicallTimes) => apicallTimes + 1);
  };

  let copyClipBoard = async (file) => {
    setShowSnackBar(true);
    let url = `${baseUrl}${file}`;
    window.navigator.clipboard.writeText(url).then(() => {
      setTimeout(() => {
        setShowSnackBar(false);
      }, 1000);
    });
  };

  return (
    <>
      {mainLoading ? (
        <Loading />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th className="th_name">Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Size</th>
                <th>Created At</th>
                <th>Copy</th>
                {/* <th>Delete</th> */}
              </tr>
            </thead>
            <tbody>
              {fileList.length > 0 && (
                <TableList
                  icons={icons}
                  fileList={fileList}
                  preview={preview}
                  bytesToSize={bytesToSize}
                  copyClipBoard={copyClipBoard}
                />
              )}
            </tbody>
          </Table>
          {noResults && <div className="center">No Results. Please Update</div>}
          {loading === true ? <Loading /> : null}
        </>
      )}

      {showLoadMoreBtn && (
        <div className="text-center">
          <Button color="link" onClick={loadNext}>
            Load More
          </Button>
        </div>
      )}
      {showMoreDataMsg ? (
        <div className="no_more p-3 border mb-2">
          <p className="text-muted text-center mb-0">No More Results</p>
        </div>
      ) : (
        ""
      )}
      <div>{snackBar(showSnackBar)}</div>
      <div ref={bottomRef}></div>
    </>
  );
}
