import React, { useState } from "react";
import Editor from "./Editor";
import "./ckContent.css";

const Viewer = ({content}) => (
  <div
    className="ck-content"
    dangerouslySetInnerHTML={{ __html: content }}
  ></div>
);

const EditorTest = () => {
  const defaultString = "Hello, This is CKEditor~~";
  const [content, setContent] = useState(defaultString);

  return (
    <div>
      <Editor
        data={content}
        uploadFolder="Test"
        onChange={(event, editor) => {
          const data = editor.getData();
          setContent(data);
          console.log({ event, editor, data });
        }}
      />
      <Viewer content={content}/>
      <div>{content}</div>
    </div>
  );
};

export default EditorTest;
