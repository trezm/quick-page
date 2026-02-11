export function createPageTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quick Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    textarea { tab-size: 2; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <div class="max-w-3xl mx-auto px-4 py-16">
    <div class="mb-10">
      <h1 class="text-3xl font-bold tracking-tight">Quick Page</h1>
      <p class="text-slate-400 mt-1">Paste TSX, get a link. That's it.</p>
    </div>

    <div id="editor-section">
      <label class="block text-sm font-medium text-slate-300 mb-2">TSX Code</label>
      <textarea
        id="code"
        class="w-full h-[28rem] bg-slate-900 text-slate-200 font-mono text-[13px] leading-relaxed p-4 rounded-lg border border-slate-800 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 outline-none resize-y placeholder:text-slate-600"
        placeholder="function App() {
  const [count, setCount] = useState(0);

  return (
    <div className=&quot;min-h-screen bg-slate-950 text-white flex items-center justify-center&quot;>
      <div className=&quot;text-center&quot;>
        <h1 className=&quot;text-4xl font-bold mb-4&quot;>Count: {count}</h1>
        <button
          onClick={() => setCount(c => c + 1)}
          className=&quot;px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500&quot;
        >
          Increment
        </button>
      </div>
    </div>
  );
}"
        spellcheck="false"
      ></textarea>

      <p class="text-xs text-slate-500 mt-2">
        Define an <code class="text-indigo-400 bg-slate-900 px-1 py-0.5 rounded">App</code> component.
        React hooks and Tailwind CSS are available globally.
      </p>

      <div class="mt-6">
        <label class="block text-sm font-medium text-slate-300 mb-2">Password <span class="text-slate-500 font-normal">(optional)</span></label>
        <input
          id="password"
          type="password"
          class="w-full max-w-xs bg-slate-900 text-slate-200 px-4 py-2 rounded-lg border border-slate-800 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 outline-none placeholder:text-slate-600"
          placeholder="Leave empty for public access"
        />
      </div>

      <button
        id="create-btn"
        onclick="createPage()"
        class="mt-8 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
      >
        Create Page
      </button>
    </div>

    <div id="result-section" class="hidden mt-10 p-6 bg-slate-900/80 rounded-lg border border-slate-800">
      <p class="text-sm text-slate-400 mb-3">Your page is live:</p>
      <div class="flex items-center gap-3">
        <a id="page-url" href="#" target="_blank" class="text-indigo-400 hover:text-indigo-300 font-mono text-sm break-all"></a>
        <button onclick="copyUrl()" class="shrink-0 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer" id="copy-btn">Copy</button>
      </div>
      <button
        onclick="resetForm()"
        class="mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
      >
        Create another &rarr;
      </button>
    </div>
  </div>

  <script>
    document.getElementById('code').addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 2;
      }
    });

    async function createPage() {
      var code = document.getElementById('code').value;
      var password = document.getElementById('password').value;
      var btn = document.getElementById('create-btn');

      if (!code.trim()) return;

      btn.disabled = true;
      btn.textContent = 'Creating...';

      try {
        var res = await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: code, password: password || undefined })
        });

        var data = await res.json();

        if (res.ok) {
          document.getElementById('page-url').href = data.url;
          document.getElementById('page-url').textContent = data.url;
          document.getElementById('result-section').classList.remove('hidden');
        } else {
          alert(data.error || 'Failed to create page');
        }
      } catch (e) {
        alert('Failed to create page');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Create Page';
      }
    }

    function copyUrl() {
      var url = document.getElementById('page-url').textContent;
      navigator.clipboard.writeText(url);
      var btn = document.getElementById('copy-btn');
      btn.textContent = 'Copied!';
      setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
    }

    function resetForm() {
      document.getElementById('code').value = '';
      document.getElementById('password').value = '';
      document.getElementById('result-section').classList.add('hidden');
      document.getElementById('code').focus();
    }
  </script>
</body>
</html>`;
}

export function renderPageTemplate(tsxCode: string): string {
  const escapedCode = JSON.stringify(tsxCode).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quick Page</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
  <script crossorigin src="https://unpkg.com/recharts@2/umd/Recharts.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    body { margin: 0; }
    #qp-error { color: #ef4444; background: #0f172a; padding: 24px; font-family: ui-monospace, monospace; font-size: 14px; white-space: pre-wrap; min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    // Module registry for import resolution
    var __modules = {
      "react": React,
      "react-dom": ReactDOM,
      "react-dom/client": ReactDOM,
      "recharts": typeof Recharts !== "undefined" ? Recharts : {}
    };

    // Transform import statements to use __modules
    function __transformImports(code) {
      // import { X, Y } from "module"
      code = code.replace(/import\\s*\\{([^}]+)\\}\\s*from\\s*["']([^"']+)["'];?/g, function(_, imports, mod) {
        return 'const {' + imports + '} = __modules["' + mod + '"];';
      });
      // import Default from "module"
      code = code.replace(/import\\s+(\\w+)\\s+from\\s+["']([^"']+)["'];?/g, function(_, name, mod) {
        return 'const ' + name + ' = __modules["' + mod + '"].default || __modules["' + mod + '"];';
      });
      // import * as X from "module"
      code = code.replace(/import\\s+\\*\\s+as\\s+(\\w+)\\s+from\\s+["']([^"']+)["'];?/g, function(_, name, mod) {
        return 'const ' + name + ' = __modules["' + mod + '"];';
      });
      // capture default export as __qp_default
      code = code.replace(/export\\s+default\\s+/g, 'var __qp_default = ');
      // strip named exports
      code = code.replace(/export\\s+\\{[^}]*\\};?/g, '');
      code = code.replace(/export\\s+(?=function|const|let|var|class)/g, '');
      return code;
    }

    // Make React hooks available globally (for code without imports)
    var _React = React;
    var useState = _React.useState;
    var useEffect = _React.useEffect;
    var useCallback = _React.useCallback;
    var useMemo = _React.useMemo;
    var useRef = _React.useRef;
    var useReducer = _React.useReducer;
    var useContext = _React.useContext;
    var createContext = _React.createContext;
    var forwardRef = _React.forwardRef;
    var memo = _React.memo;
    var lazy = _React.lazy;
    var Suspense = _React.Suspense;
    var Fragment = _React.Fragment;
    var createElement = _React.createElement;
    var useId = _React.useId;
    var useTransition = _React.useTransition;
    var useDeferredValue = _React.useDeferredValue;
    var useImperativeHandle = _React.useImperativeHandle;
    var useLayoutEffect = _React.useLayoutEffect;

    try {
      var tsxCode = ${escapedCode};
      var transformed = __transformImports(tsxCode);
      var renderCode = transformed + '\\n;ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(typeof __qp_default !== "undefined" ? __qp_default : App));';
      var compiled = Babel.transform(renderCode, {
        presets: ['react', ['typescript', { isTSX: true, allExtensions: true }]],
        filename: 'app.tsx'
      }).code;
      eval(compiled);
    } catch (e) {
      document.getElementById('root').style.display = 'none';
      var errEl = document.createElement('div');
      errEl.id = 'qp-error';
      errEl.textContent = e.message + '\\n\\n' + (e.stack || '');
      document.body.appendChild(errEl);
    }
  <\/script>
</body>
</html>`;
}

export function passwordPageTemplate(pageId: string, error?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quick Page - Password Required</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center">
  <div class="w-full max-w-sm px-4">
    <div class="bg-slate-900 rounded-lg border border-slate-800 p-8">
      <h1 class="text-xl font-bold mb-1">Password Required</h1>
      <p class="text-slate-400 text-sm mb-6">This page is password protected.</p>
      ${error ? '<p class="text-red-400 text-sm mb-4">' + error + '</p>' : ''}
      <form method="POST" action="/p/${pageId}/auth">
        <input
          type="password"
          name="password"
          class="w-full bg-slate-800 text-slate-100 px-4 py-2 rounded-lg border border-slate-700 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40 outline-none mb-4 placeholder:text-slate-500"
          placeholder="Enter password"
          autofocus
        />
        <button
          type="submit"
          class="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          Unlock
        </button>
      </form>
    </div>
  </div>
</body>
</html>`;
}
