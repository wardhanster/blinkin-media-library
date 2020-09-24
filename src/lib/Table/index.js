import React, { useState, useEffect, useRef } from "react";
import { Table, Button } from "reactstrap";

import TableList from "./TableList";
import SidePreview from "./SidePreview";
import Loading from "../Loading";

import "./table.css";

let isApiCallSuccess = false;
let initialLoad = true;

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
    setLoading(true);
    setShowLoadMoreBtn(false);
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
          setShowLoadMoreBtn(true);
        } else {
          setShowMoreDataMsg(true);
          setShowLoadMoreBtn(false);
        }
      } else {
        isApiCallSuccess = false;

        if (!isApiCallSuccess && pageNumRef.current <= 1) {
          setNoResults(true);
          setShowMoreDataMsg(false);
          setShowLoadMoreBtn(false);
          setLoading(false);
        } else {
          setLoading(false);
          setShowMoreDataMsg(true);
          setShowLoadMoreBtn(false);
        }
      }
    } catch (e) {
      isApiCallSuccess = false;
      setLoading(false);
      setShowMoreDataMsg(true);

      setShowLoadMoreBtn(false);
    }

    initialLoad = false;
    setMainLoading(false);
    // scrlHeight = document.documentElement.scrollHeight;
    // clientH = document.documentElement.clientHeight + 100;

    // if (scrlHeight >= clientH) {
    //   // setShowLoadMoreBtn(false);
    // } else {
    //   try {
    //     if (data.length > 0) {
    //       debugger;
    //       setShowLoadMoreBtn(true);
    //     } else {
    //       // setShowLoadMoreBtn(false);
    //     }
    //   } catch (e) {}
    // }

    // if (!intersect && !showLoadMoreBtn) {
    // setShowLoadMoreBtn(true);
    // }

    try {
      if (data.length > 0) {
      }
    } catch (e) {
      // setShowLoadMoreBtn(false);
    }
  };

  // const scrollCallback = (entries, observer) => {
  //   setLoading(true);
  //   if (entries[0].isIntersecting) {
  //     setIntersect(true);
  //     isIntersectRef.current = false;
  //     if (!initialLoad) {
  //       setApiCallTimes((apicallTimes) => apicallTimes + 1);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   scroll = new IntersectionObserver(scrollCallback, {
  //     rootMargin: "50px",
  //     threshold: 1,
  //   });
  //   scroll.observe(bottomRef.current);
  //   return () => {
  //     scroll.unobserve(bottomRef.current);
  //   };
  // }, [bottomRef]);

  useEffect(() => {
    callAPI(search);
  }, [apicallTimes]);

  useEffect(() => {
    if (search || searchClear) {
      setShowLoadMoreBtn(false);
      setFileList([]);
      setLoading(true);
      setShowMoreDataMsg(false);
      setNoResults(false);
      initialLoad = true;
      pageNumRef.current = 1;
      searchFirst.current = true;
      callAPI(search);
    }
  }, [search, searchClear]);

  let loadNext = () => {
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
                <th className="th_name">{window.strings.ML_name || " Name"}</th>
                <th>{window.strings.ML_description || " Description"}</th>
                <th>{window.strings.ML_type || " Type"}</th>
                <th>{window.strings.ML_size || " Size"}</th>
                <th>{window.strings.ML_createdAt || " Created At"}</th>
                <th>{window.strings.ML_copy || " Copy"}</th>
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
          {noResults && (
            <div className="center">
              {window.strings.ML_noResultsFound || "No Results Found"}
            </div>
          )}
          {loading === true ? <Loading /> : null}
        </>
      )}

      {showLoadMoreBtn ? (
        <div className="text-center load_more_container">
          <Button color="link" onClick={loadNext}>
            {window.strings.ML_loadMore || "Load More"}
          </Button>
        </div>
      ) : (
        ""
      )}
      {showMoreDataMsg ? (
        <div className="no_more p-3 border mb-2">
          <p className="text-muted text-center mb-0">
            {window.strings.ML_noMoreResults || "No More Results"}
          </p>
        </div>
      ) : (
        ""
      )}
      <div>{snackBar(showSnackBar)}</div>
      <div ref={bottomRef}></div>
    </>
  );
}
