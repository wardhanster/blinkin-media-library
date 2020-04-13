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
