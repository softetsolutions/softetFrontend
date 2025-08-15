import { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Trash2, Code2, Layout } from "lucide-react";
import { initialHtml, initialCss, initialJs } from "../constant";
import IFramePreview from "../components/IFramePreview";
import AceEditorComponent from "../components/AceEditorComponent";

export default function Codet() {
  const [js, setJs] = useState(initialJs);
  const [output, setOutput] = useState("");
  const [css, setCss] = useState(initialCss);
  const [html, setHtml] = useState(initialHtml);
  const [activeTab, setActiveTab] = useState("html");
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(()=>{
      setOutput(`
        <html>
          <head><style>${css}</style></head>
          <body>
            ${html}
            <script>${js.replace(/<\/script>/gi, "<\\/script>")}</script>
          </body>
        </html>
      `);
    },500)

    return ()=>{
      clearTimeout(timeout)
    }
   
  }, [html, css, js]);

  useEffect(() => {
    const handleResize = () => {
      setIsVerticalLayout(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log("Codet is rendering");

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all code?")) {
      setHtml(`<html>
<body>  
</body>
</html>
        `);
      setCss("");
      setJs("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50 flex justify-between">
        <div className="flex h-14 items-center justify-between px-3">
          <div className="flex items-center gap-2 transition-opacity cursor-pointer select-none -ml-1">
            <Code2 className="ml-2 h-8 w-8 text-blue-600 shrink-0" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight">
              Codet
            </span>{" "}
            <Link to="/" ><span className="text-slate-500 text-lg">by softet</span></Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVerticalLayout(!isVerticalLayout)}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
              title="Toggle Layout"
            >
              <Layout className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex gap-1.5 items-center mr-3">
          
          <button
            onClick={handleClearAll}
            className="h-10 flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-md hover:shadow-lg hover:cursor-pointer active:scale-110"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        </div>
      </header>

      <div className="pl-3 pr-3 sm:pr-4 sm:pl-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-4.5rem)]">
          <PanelGroup direction={isVerticalLayout ? "vertical" : "horizontal"}>
            {/* Editor Panel */}
            <Panel defaultSize={50} minSize={30}>
              <div className="flex flex-col h-full">
                {/* Tab*/}
                <div className="flex justify-between items-center bg-gray-50/80 backdrop-blur-sm p-2 border-b sticky top-0 z-10">
                  <div className="flex gap-1.5">
                    {["html", "css", "js"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:cursor-pointer ${
                          activeTab === tab
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {tab.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Editors */}
                <div className="flex-1 overflow-hidden">
                  {activeTab === "html" && (
                    <AceEditorComponent
                      mode="html"
                      value={html}
                      onChange={setHtml}
                      name="html-editor"
                    />
                  )}
                  {activeTab === "css" && (
                    <AceEditorComponent
                      mode="css"
                      value={css}
                      onChange={setCss}
                      name="css-editor"
                    />
                  )}
                  {activeTab === "js" && (
                    <AceEditorComponent
                      mode="javascript"
                      value={js}
                      onChange={setJs}
                      name="js-editor"
                    />
                  )}
                </div>
              </div>
            </Panel>

            {/* Resize Handle */}
            <PanelResizeHandle
              className={`${
                isVerticalLayout ? "h-2" : "w-2"
              } bg-gray-100 hover:bg-gray-200 transition-colors relative group`}
            >
              <div
                className={`absolute inset-0 flex items-center justify-center`}
              >
                <div
                  className={`${
                    isVerticalLayout ? "h-1 w-8" : "w-1 h-8"
                  } bg-gray-300 group-hover:bg-gray-400 rounded-full transition-colors`}
                />
              </div>
            </PanelResizeHandle>

            {/* Preview */}
            <Panel defaultSize={50} minSize={30}>
              <IFramePreview 
                    src={output}
                    title="Preview"
                  />
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}
