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
<MediaFileList uploadFiles={uploadFiles} fetchAPI={fetchAPI} toggle={toggle}
    sideModal={(val) => ( <SideModal SideModalOpen={sideModalOpen}
            onToggle={toggle}
            title="File Upload">
            {val}
          </SideModal>
)} />
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
  console.log(searchTerm);
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

