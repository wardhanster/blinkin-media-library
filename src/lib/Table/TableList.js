import React from "react";

export default function TableList(props) {
  let { preview, fileList, bytesToSize, icons, copyClipBoard } = props;

  return fileList.map((file) => {
    let filesize = bytesToSize(file.file_size);
    return (
      <tr key={`${file.upload_name} ${Math.random()}`}>
        <th scope="row" className="table_header_filename">
          <i className={icons(file.file_extension)} aria-hidden="true"></i>
          <span
            className="file_name_preview"
            onClick={() => preview(file, filesize)}
            title={file.upload_name}
          >
            {file.upload_name}
          </span>
        </th>
        <td>{file.upload_description}</td>
        <td>{file.file_extension}</td>
        <td>{filesize}</td>
        <td>{file.created_at}</td>
        <td>
          <i
            onClick={() => copyClipBoard(file.file_url)}
            className="fa fa-clone"
            aria-hidden="true"
          ></i>
        </td>
      </tr>
    );
  });
}
