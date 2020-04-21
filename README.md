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

## Note - only in case of more then perPageCount > n then page number will update (n is set to 4 now) or else it will remain as same page and data will update into next api request

# Need Suggestions 
### Need to handle perpagecount from props i guess now
