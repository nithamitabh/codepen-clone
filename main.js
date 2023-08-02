// ?Catching commonly used elements to minimize dom queries
const livePrevFrame = document.getElementById("live-preview");
const htmlEdit = document.getElementById("html");
const cssEdit = document.getElementById("css");
const jsEdit = document.getElementById("js");

// ? Function to setup live preview iframe and include necessary scripts
function initializeLivePreview() {
  livePrevFrame.contentWindow.document.body.innerHTML = "";
  const styleElement = document.createElement("style");
  styleElement.setAttribute("id", "live-preview-style");
  livePrevFrame.contentWindow.document.head.appendChild(styleElement);

  const pageJsScript = document.createElement("script");
  pageJsScript.src = "https://unpkg.com/pagedjs/dist/paged.legacy.polyfill.js";
  livePrevFrame.contentWindow.document.head.appendChild(pageJsScript);
}

// Function to update the the live preview iframe with the htmL code for editor
function updateLiveHtmlPreview(codeEditors) {
  livePrevFrame.contentWindow.document.body.innerHTML =
    codeEditors.html.getValue();
}
function updateLiveCSSPreview(codeEditors) {
  const styleElement =
    livePrevFrame.contentWindow.document.getElementById("live-preview-style");
  styleElement.innerHTML = codeEditors.css.getValue();
}
//? Function to update the live preview iframe with the js code

function updateLiveJSPreview(codeEditors) {
  const scriptElement = document.createElement("script");
  scriptElement.innerHTML = codeEditors.js.getValue();
  livePrevFrame.contentWindow.document.body.appendChild(scriptElement);
}
// Function to initialise codeMirror editors for html,css and js
function initializeCodeEditors() {
  function getDefaultOptions(object) {
    const defaultOptions = {
      lineNumbers: true,
      autoCloseTags: true,
      autoCloseBrackets: true,
      theme: "panda-syntax",
    };
    if (object) {
      const keys = Object.keys(object);
      for (const key of keys) {
        defaultOptions[key] = object[key];
      }
    }
    return defaultOptions;
  }
  const codeEditors = {
    html: CodeMirror(
      htmlEdit,
      getDefaultOptions({
        mode: "text/html",
        value: "",
      })
    ),
    css: CodeMirror(
      htmlEdit,
      getDefaultOptions({
        mode: "css",
        value: "",
        extraKeys: { "Ctrl-Space": "autocomplete" },
        hintOptions: {
          completeSingle: false,
          closeOnUnfocous: false,
        },
      })
    ),
    js: CodeMirror(
      jsEdit,
      getDefaultOptions({
        mode: "javascript",
        value: "",
      })
    ),
  };
  return codeEditors;
}
// ? Function to setup live preview studio with CodeMirror
//? edtiors and event listens
function setupLivePreviewStudio() {
  const codeEditors = initializeCodeEditors();

  // ?Event listeners for changes on html editors
  CodeMirror.on(codeEditors.html, "change", () => {
    updateLiveHtmlPreview(codeEditors);
  });
  // ?Event listeners for changes on css editors
  CodeMirror.on(codeEditors.css, "change", () => {
    updateLiveCSSPreview(codeEditors);
  });
  // ?Event listeners for changes on js editors
  CodeMirror.on(codeEditors.js, "change", () => {
    updateLiveJSPreview(codeEditors);
  });
}
// ?Event listner to set up the live preview studio after the dom is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeLivePreview();
  setupLivePreviewStudio();
});
