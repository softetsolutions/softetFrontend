import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/snippets/html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/ext-language_tools";

const AceEditorComponent = React.memo(({key, mode, name, value, onChange}) => {
  const editorOptions = {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    showLineNumbers: true,
    tabSize: 2,
    fontSize: 16,
    useWorker: false,
    bracketMatching: true,
    showPrintMargin: false,
    wrap: true,
  };
  return (
    <div className="h-full">
      <AceEditor
        key={key}
        mode={mode}
        theme="chrome"
        value={value}
        onChange={onChange}
        name={name}
        width="100%"
        height="100%"
        setOptions={editorOptions}
        editorProps={{ $blockScrolling: true }}
      />
    </div>
  );
});

export default AceEditorComponent;
