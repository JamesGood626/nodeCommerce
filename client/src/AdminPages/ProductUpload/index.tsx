/* tslint:disable: no-console */
import * as React from 'react';
// import axios from 'axios'
import '../../App.css';
// import { Query } from 'react-apollo'
// import gql from "graphql-tag"

// interface IFile {
//   lastModified: number;
//   lastModifiedDate: Date;
//   name: string;
//   size: number;
//   type: string;
//   webkitRelativePath: string;
// }

class ProductUpload extends React.Component {
  // private handleSubmit = (e: any) => {
  //   e.preventDefault()
  //   // Successfully accesses img file upload
  //   const imgFile: FileList = e.target.img.files
  //   console.log(imgFile)

    
  //   // const data = new FormData()
  //   // data.append("username", "Groucho");
  //   // data.append("accountnum", 123456); // number 123456 is immediately converted to a string "123456"

  //   // HTML file input, chosen by user
  //   // data.append("userfile", fileInputElement.files[0]);

  //   // console.log(e.target.data)
  //   // axios.post('/image-submit')
  // }

  private handleDrop = (e: any): void => {
    e.preventDefault();
    e.stopPropagation();
    if(e.target.id === 'drop-area') {
      e.currentTarget.classList.remove('drop-area-is-hovered');
    }

    if (e.dataTransfer.items) {
      // console.log(e.target);
      console.log('files on dataTransfer: ', e.dataTransfer.files);
      this.handleFiles(e.dataTransfer.files)
    }
  }

  private handleDragOver = (e: any): void => {
    e.preventDefault();
    e.stopPropagation();
    if(e.target.id === 'drop-area') {
      e.target.classList.add('drop-area-is-hovered');
    }
  }

  private handleDragEnter = (e: any): void => {
    e.preventDefault();
    e.stopPropagation();
    if(e.target.id === 'drop-area') {
      e.target.classList.add('drop-area-is-hovered');
    }
  }

  private handleDragLeave = (e: any): void => {
    e.preventDefault();
    e.stopPropagation();
    if(e.target.id === 'drop-area') {
      e.target.classList.remove('drop-area-is-hovered');
    }
  }

  private handleFiles = (files: FileList): void => {
    Object.getOwnPropertyNames(files).map(key => this.uploadFile(files[key]))
    Object.getOwnPropertyNames(files).map(key => this.previewFile(files[key]))
  }

  private uploadFile = (file: Blob): void => {
    console.log('File in uploadFile: ', file);
    // const url: any = 'YOUR URL HERE'
    // const formData: FormData = new FormData()

    // formData.append('file', file)
  }

  private previewFile = (file: Blob): void => {
    const reader: FileReader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = (): void => {
      const img: HTMLImageElement = document.createElement('img');
      img.src = reader.result;
      const gallery: HTMLElement | null = document.getElementById('gallery');
      if (gallery) {
        gallery.appendChild(img);
      }
    }
  }

  // <progress id="progress-bar" max={ 100 } value={ 0 } />
  public render() {
    return (
      <div id="drop-area" className="drop-area-style" onDrop={ this.handleDrop } onDragEnter={ this.handleDragEnter } onDragLeave={ this.handleDragLeave } onDragOver={ this.handleDragOver }>
        <form className="image-upload-form" encType="multipart/form-data">
          <p>Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region</p>
          <input type="file" id="fileElem" multiple={ true } accept="image/*" />
          <label className="button" htmlFor="fileElem">Select some files</label>
          <input type="submit" />
        </form>
        <div id="gallery" />
      </div>
    );
  }
}

export default ProductUpload;

// <form action={ this.handleSubmit }>
// <form action="localhost:5000/image-submit" encType="multipart/form-data" method="POST">