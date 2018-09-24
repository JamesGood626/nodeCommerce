// import React from "react";

// export default () => {
//   return (
//     <div>
//       <h1>Upload Image</h1>
//       <form
//         action="/admin/create/product"
//         method="POST"
//         encType="multipart/form-data"
//       >
//         <input type="file" multiple={true} accept="image/*" />
//         <button type="submit">Upload</button>
//       </form>
//     </div>
//   );
// };

import React, { Component } from "react";
// import axios from "axios";

export default class ImageUpload extends Component {
  public state = {
    fileList: []
  };

  public componentDidMount() {
    console.log("Component mounting");
    if (
      (window as any).File &&
      (window as any).FileReader &&
      (window as any).FileList &&
      window.Blob
    ) {
      console.log("GREAT SUCCESS");
      // Great success! All the File APIs are supported.
    } else {
      console.log(" nope");
      alert("The File APIs are not fully supported in this browser.");
    }
  }

  // REMEMBER! the input's name must match the first parameter
  // that you put into multer's upload.array function. which in this case.
  // is image-upload.
  public render() {
    return (
      <div>
        <h1>Upload Image</h1>
        <form
          action="/admin/create/product"
          method="POST"
          encType="multipart/form-data"
        >
          <input type="text" name="product_title" placeholder="Product Title" />
          <input type="text" name="description" placeholder="Description" />
          <input type="text" name="price" placeholder="Price" />
          <input
            type="file"
            name="image-upload"
            multiple={true}
            accept="image/*"
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}
