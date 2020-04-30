# Media Library
Library to view and upload files
 ### Installation

Add dependencies into package.json

```sh
"media-list": "github:ranjith29v/media.git",
```

Some other packages

```javascipt
$ npm install --save reactstrap bootstrap font-awesome@4.7
```
# NOTE - since we have installed it in our main package its not required

## import package

```javascript
import MediaFileList from "media-list";
```

## implementation

```javascript
 <MediaFileList
        uploadFiles={uploadFiles}
        fetchAPI={fetchAPI}
        toggle={toggle}
        tags={tags}
        sideModal={(file, title) => (
          <SideModal
            SideModalOpen={sideModalOpen}
            onToggle={toggle}
            title={title}
          >
            {file}
          </SideModal>
        )}
      />
```
## How i handled props

```javascript

let tags = ["file", "file2", "file3", "file4"];

let uploadFiles = (files, callback) => {
  console.log(files);
  files.forEach((element, index) => {
    callback(index, element, true);
  });
};

let fetchAPI = (pagenum, searchTerm) => {
  let queryString;
  if (searchTerm) {
  queryString = Object.keys(searchTerm)
      .map((key) => key + "=" + searchTerm[key])
      .join("&");
  }
   console.log(queryString); // query string to search
  
  let baseUrl =
    "https://blinkin-staging.s3.eu-central-1.amazonaws.com/media_library/1/7/";
  if (pagenum === 1) {
    let promise = new Promise(function (resolve, reject) {
      setTimeout(() => resolve({ data: initialData, baseUrl }), 1000);
    });
    return promise;
  } else if (pagenum === 2) {
    let promise = new Promise(function (resolve, reject) {
      setTimeout(() => resolve({ data: secondData, baseUrl }), 1000);
    });
    return promise;
  } else if (pagenum >= 3) {
    return [];
  }
};

```

# For sidepopup

```javascript
 let [sideModalOpen, setSideModalOpen] = useState(false);

  const toggle = (toggleType) => {
    setSideModalOpen(!sideModalOpen);
  };
```
toggle is passed to sidepopup component prop

# How i handled upload files callback
since callback will be called for every update on progress percentage handled something like below

```js
 let fileItems = [];
  const handleFileProgress = (progressPercentage, fileIndex) => {
    setLoadingMsg(`Uploading ${files[fileIndex].name}`);
    setUploadPercentage(progressPercentage);

    if (fileItems.indexOf(files[fileIndex].name) <= -1) {
      fileItems.push(files[fileIndex].name);
    }

    if (fileItems.length === files.length) {
      if (progressPercentage > 80) {
        fileItems.length = 0;
        setLoadingMsg(null);
        setUploadPercentage(null);
        setModalStatus((modalStatus) => !modalStatus);
        loadNewContent();
      }
    }
  };
```

## Handling window key
```js
window.String.ML_name || "Name"
window.String.ML_description || "Description"
window.String.ML_type || "Type"
window.String.ML_size || "Size"
window.String.ML_createdAt || "Created At"
window.String.ML_copy || "Copy"
window.String.ML_loadMore || "Load More"
window.String.ML_noMoreResults || "No More Results"
window.String.ML_noResultsFound || "No Results Found"
window.String.ML_browse || "Browse"
window.String.ML_tags || "Tags"
window.String.ML_fileType || "File Type"
window.String.ML_search || "Search"
window.String.ML_clear || "Clear"
window.String.ML_quickAccess || "Quick access"
window.String.ML_edit || "Edit"
window.String.ML_delete || "Delete"
window.String.ML_upload || "Upload"
window.String.ML_imageOrVideoPreview || "Image / Video Preview"
window.String.ML_save || "Save"
window.String.ML_max100Character || "Max 100 Character"
window.String.ML_savedChanges || "Saved Changes"
window.String.ML_noMoreFilesOrAllFilesUpdated || " No More Files/All Files are Updated"
window.String.ML_formatNotAbleToLoad || "Format Not able to load"
window.String.ML_fileFormatNotAbleToLoad || "File Format Not able to load"
window.String.ML_fileSize || "File Size"
```
