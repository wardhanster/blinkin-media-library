import React from "react";
import { Button } from "reactstrap";

export default function TableList(props) {
  let { preview, fileList, bytesToSize } = props;

  return fileList.map((file) => {
    let filesize = bytesToSize(file.file_size);
    return (
      <tr key={`${file.upload_name} ${Math.random()}`}>
        <th scope="row">
          <i className="fa fa-file-pdf-o" aria-hidden="true"></i>{" "}
          {file.upload_name}
        </th>
        <td>{file.upload_description}</td>
        <td>{file.file_extension}</td>
        <td>{filesize}</td>
        <td>{file.created_at}</td>
        <td>
          <Button
            color="primary"
            className="btn-sm"
            onClick={() => preview(file, filesize)}
          >
            Preview
          </Button>
        </td>
        <td>
          <Button color="danger" className="btn-sm">
            Delete
          </Button>
        </td>
      </tr>
    );
  });
}
