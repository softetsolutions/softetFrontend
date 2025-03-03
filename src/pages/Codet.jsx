import { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Play, Trash2, Code2, Layout } from "lucide-react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/snippets/html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/ext-language_tools";

export default function Codet() {
  const [activeTab, setActiveTab] = useState("html");
  const [isVerticalLayout, setIsVerticalLayout] = useState(false);

  const initialHtml = `<!DOCTYPE html>
  <html>
  <body>
    <div class="container">
      <h1 class="brand">Codet <span class="softet">by Softet</span></h1>
      
      <div class="interactive-section">
        <h2>Try these interactive elements:</h2>
        
        <div class="demo-box">
          <p id="clickCounter">Button clicks: 0</p>
          <button onclick="incrementCounter()">Click me!</button>
        </div>
        
        <div class="demo-box color-demo">
          <p>Color changer:</p>
          <div class="color-box" id="colorBox"></div>
          <button onclick="changeColor()">Change Color</button>
        </div>
        
        <div class="typing-demo">
          <input 
            type="text" 
            id="nameInput" 
            placeholder="Type your name..."
            oninput="updateGreeting()"
          >
          <p id="greeting"></p>
        </div>
      </div>
      
      <p class="instruction">Start editing the code to see live changes!</p>
    </div>
  </body>
  </html>`;

  const initialCss = `body {
    margin: 0;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
    font-family: 'Segoe UI', system-ui;
  }
  
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .brand {
    text-align: center;
    color: #2563eb;
    margin-bottom: 2rem;
    font-size: 2.5rem;
  }
  
  .softet {
    color: #64748b;
    font-size: 1.2rem;
    display: block;
    margin-top: 0.5rem;
  }
  
  .interactive-section {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }
  
  .demo-box {
    margin: 1.5rem 0;
    padding: 1.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    transition: transform 0.2s ease;
  }
  
  .demo-box:hover {
    transform: translateY(-2px);
  }
  
  button {
    padding: 0.8rem 1.5rem;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    margin: 0.5rem 0;
  }
  
  button:hover {
    background: #1d4ed8;
    transform: scale(1.05);
  }
  
  .color-box {
    width: 100px;
    height: 100px;
    margin: 1rem 0;
    border-radius: 0.5rem;
    transition: background-color 0.3s ease;
  }
  
  .typing-demo input {
    padding: 0.8rem;
    border: 2px solid #cbd5e1;
    border-radius: 0.5rem;
    width: 100%;
    max-width: 300px;
    margin: 1rem 0;
  }
  
  .instruction {
    text-align: center;
    color: #64748b;
    font-style: italic;
    margin-top: 2rem;
  }
  
  @media (max-width: 600px) {
    .container {
      padding: 1rem;
    }
    
    .brand {
      font-size: 2rem;
    }
  }`;

  const initialJs = `let clickCount = 0;
  const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];
  let colorIndex = 0;
  
  function incrementCounter() {
    clickCount++;
    document.getElementById('clickCounter').textContent = 
      \`Button clicks: \${clickCount}\`;
    flashButton();
  }
  
  function changeColor() {
    const box = document.getElementById('colorBox');
    colorIndex = (colorIndex + 1) % colors.length;
    box.style.backgroundColor = colors[colorIndex];
    box.style.transform = 'scale(1.1)';
    setTimeout(() => box.style.transform = 'scale(1)', 200);
  }
  
  function updateGreeting() {
    const name = document.getElementById('nameInput').value;
    const greeting = document.getElementById('greeting');
    greeting.textContent = name ? \`Hello, \${name}! 👋\` : '';
  }
  
  function flashButton() {
    const btn = document.querySelector('#clickCounter + button');
    btn.style.transform = 'scale(1.1)';
    btn.style.backgroundColor = '#10b981';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
      btn.style.backgroundColor = '#2563eb';
    }, 200);
  }
  
  // Show time-based welcome message
  function showWelcome() {
    const time = new Date().getHours();
    let greeting = 'Welcome!';
    if (time < 12) greeting = 'Good morning!';
    if (time >= 12 && time < 18) greeting = 'Good afternoon!';
    if (time >= 18) greeting = 'Good evening!';
    alert(\`\${greeting} Start coding to see live changes!\`);
  }
  
  // Initial welcome message
  showWelcome();`;

  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);
  const [output, setOutput] = useState("");

  useEffect(() => {
    const timeout = setTimeout(handleRun, 500);
    const handleResize = () => {
      setIsVerticalLayout(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRun = () => {
    setOutput(`
      <html>
        <head><style>${css}</style></head>
        <body>
          ${html}
          <script>${js.replace(/<\/script>/gi, "<\\/script>")}</script>
        </body>
      </html>
    `);
  };

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

  const editorOptions = {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    showLineNumbers: true,
    tabSize: 2,
    fontSize: 16,
    useWorker: true,
    bracketMatching: true,
    showPrintMargin: false,
    wrap: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50 flex justify-between">
        <div className="flex h-14 items-center justify-between px-3">
          <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer select-none -ml-1">
            <Code2 className="ml-2 h-8 w-8 text-blue-600 shrink-0" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight">
              Codet
            </span>{" "}
            <span className="text-slate-500 text-lg">by softet</span>
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
            onClick={handleRun}
            className="h-10 flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg hover:cursor-pointer active:scale-110"
          >
            <Play size={16} />
            Run
          </button>
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
                    <div className="h-full">
                      <AceEditor
                        key="#softetHtml"
                        mode="html"
                        theme="chrome"
                        value={html}
                        onChange={setHtml}
                        name="html-editor"
                        width="100%"
                        height="100%"
                        setOptions={editorOptions}
                        editorProps={{ $blockScrolling: true }}
                      />
                    </div>
                  )}

                  {activeTab === "css" && (
                    <div className="h-full">
                      <AceEditor
                        key="#softetCss"
                        mode="css"
                        theme="chrome"
                        value={css}
                        onChange={setCss}
                        name="css-editor"
                        width="100%"
                        height="100%"
                        setOptions={editorOptions}
                        editorProps={{ $blockScrolling: true }}
                      />
                    </div>
                  )}

                  {activeTab === "js" && (
                    <div className="h-full">
                      <AceEditor
                        key="softetJs"
                        mode="javascript"
                        theme="chrome"
                        value={js}
                        onChange={setJs}
                        name="js-editor"
                        width="100%"
                        height="100%"
                        setOptions={editorOptions}
                        editorProps={{ $blockScrolling: true }}
                      />
                    </div>
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
              <div className="h-full flex flex-col">
                <div className="p-3 pt-5 border-b bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
                  <h3 className="text-sm font-medium text-gray-600">Preview</h3>
                </div>
                <iframe
                  srcDoc={output}
                  className="flex-1 w-full bg-white"
                  sandbox="allow-scripts allow-modals"
                  title="preview"
                />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}
