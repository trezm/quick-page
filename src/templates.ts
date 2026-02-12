export function createPageTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quick Page — Instant hosting for AI-generated apps</title>
  <meta name="description" content="Give your AI-generated React apps a permanent home. Paste TSX from Claude, ChatGPT, or any LLM and get a live URL in seconds.">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ['Outfit', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
          }
        }
      }
    }
  </script>
  <style>
    textarea { tab-size: 2; }
    body { font-family: 'Outfit', system-ui, sans-serif; }

    /* Dot grid background */
    .dot-grid {
      background-image: radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    /* Glow line separator */
    .glow-line {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5) 30%, rgba(139,92,246,0.5) 70%, transparent);
    }

    /* Animated gradient for hero accent */
    @keyframes shimmer {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    .shimmer { animation: shimmer 3s ease-in-out infinite; }

    /* Step number styling */
    .step-num {
      font-variant-numeric: tabular-nums;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Fade-in on scroll */
    .fade-up {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-up.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Feature card hover */
    .feature-card {
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .feature-card:hover {
      border-color: rgba(99,102,241,0.3);
      box-shadow: 0 0 24px -8px rgba(99,102,241,0.15);
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen dot-grid">

  <!-- Nav -->
  <nav class="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4L7 2L12 4L7 6L2 4Z" fill="white" opacity="0.9"/><path d="M2 7L7 9L12 7" stroke="white" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/><path d="M2 10L7 12L12 10" stroke="white" stroke-width="1.2" stroke-linecap="round" opacity="0.35"/></svg>
      </div>
      <span class="text-lg font-semibold tracking-tight font-display">Quick Page</span>
    </div>
    <a href="#editor" class="text-sm font-medium text-slate-400 hover:text-white transition-colors">Create a page &darr;</a>
  </nav>

  <!-- Hero -->
  <section class="max-w-5xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
    <div class="max-w-3xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/60 text-xs font-medium text-slate-400 mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shimmer"></span>
        Free &amp; open source
      </div>
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] font-display">
        Your AI artifacts<br>
        <span class="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">deserve a URL.</span>
      </h1>
      <p class="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl font-light">
        Claude, ChatGPT, and Gemini build amazing interactive apps&mdash;then they vanish when you close the chat. Quick Page gives them a permanent home. Paste TSX, get a live link.
      </p>
      <div class="mt-10 flex flex-col sm:flex-row gap-4">
        <a href="#editor" class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-lg transition-colors text-sm">
          Start building
          <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </a>
        <a href="https://github.com/trezm/quick-page" target="_blank" class="inline-flex items-center justify-center px-6 py-3 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-medium rounded-lg transition-colors text-sm bg-slate-900/40">
          <svg class="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          View on GitHub
        </a>
      </div>
    </div>
  </section>

  <div class="glow-line max-w-5xl mx-auto"></div>

  <!-- Problem / Value -->
  <section class="max-w-5xl mx-auto px-6 py-20 md:py-28 fade-up">
    <div class="max-w-2xl mb-12">
      <p class="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-3 font-mono">The problem</p>
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight font-display">AI builds incredible apps.<br>Then they disappear.</h2>
    </div>
    <div class="grid sm:grid-cols-3 gap-6">
      <div class="p-6 rounded-xl border border-slate-800/80 bg-slate-900/30">
        <div class="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center mb-4">
          <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h3 class="font-semibold text-white mb-2 font-display">They vanish from chat</h3>
        <p class="text-sm text-slate-400 leading-relaxed">Artifacts live inside your AI conversation. Close it, and the interactive app is gone. Scrolling back is tedious.</p>
      </div>
      <div class="p-6 rounded-xl border border-slate-800/80 bg-slate-900/30">
        <div class="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
          <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.44a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 10-6.364 6.364l1.757 1.757"/></svg>
        </div>
        <h3 class="font-semibold text-white mb-2 font-display">No shareable link</h3>
        <p class="text-sm text-slate-400 leading-relaxed">You can't just text someone a URL. Sharing means screenshots, copy-paste, or asking them to run code locally.</p>
      </div>
      <div class="p-6 rounded-xl border border-slate-800/80 bg-slate-900/30">
        <div class="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center mb-4">
          <svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17l-5.384-3.19A1 1 0 015 11.118V4.382a1 1 0 011.036-.862l5.384.318m0 0l5.384-.318A1 1 0 0118 4.382v6.736a1 1 0 01-1.036.862L11.58 11.66m0 0v3.51"/></svg>
        </div>
        <h3 class="font-semibold text-white mb-2 font-display">Hosting is overkill</h3>
        <p class="text-sm text-slate-400 leading-relaxed">Spinning up Vercel or Netlify for a single-file experiment? Setting up a repo and CI pipeline? Way too much ceremony.</p>
      </div>
    </div>
  </section>

  <div class="glow-line max-w-5xl mx-auto"></div>

  <!-- How It Works -->
  <section class="max-w-5xl mx-auto px-6 py-20 md:py-28 fade-up">
    <p class="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-3 font-mono">How it works</p>
    <h2 class="text-3xl sm:text-4xl font-bold tracking-tight font-display mb-14">Three steps. Zero config.</h2>
    <div class="grid sm:grid-cols-3 gap-10">
      <div>
        <span class="step-num text-5xl font-extrabold font-display">01</span>
        <h3 class="font-semibold text-white mt-4 mb-2 text-lg font-display">Paste your TSX</h3>
        <p class="text-sm text-slate-400 leading-relaxed">Copy the artifact code from Claude, ChatGPT, or any LLM. Or write your own&mdash;it's just a React component.</p>
      </div>
      <div>
        <span class="step-num text-5xl font-extrabold font-display">02</span>
        <h3 class="font-semibold text-white mt-4 mb-2 text-lg font-display">Hit create</h3>
        <p class="text-sm text-slate-400 leading-relaxed">We compile and host your app instantly. No build step, no deploy pipeline, no GitHub repo needed.</p>
      </div>
      <div>
        <span class="step-num text-5xl font-extrabold font-display">03</span>
        <h3 class="font-semibold text-white mt-4 mb-2 text-lg font-display">Share the link</h3>
        <p class="text-sm text-slate-400 leading-relaxed">Get a permanent URL. Send it to anyone&mdash;they see a live, interactive React app in their browser.</p>
      </div>
    </div>
  </section>

  <div class="glow-line max-w-5xl mx-auto"></div>

  <!-- Features -->
  <section class="max-w-5xl mx-auto px-6 py-20 md:py-28 fade-up">
    <p class="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-3 font-mono">Features</p>
    <h2 class="text-3xl sm:text-4xl font-bold tracking-tight font-display mb-14">Everything your artifact needs. Nothing it doesn't.</h2>
    <div class="grid sm:grid-cols-2 gap-5">
      <div class="feature-card p-6 rounded-xl border border-slate-800/80 bg-slate-900/20">
        <div class="flex items-start gap-4">
          <div class="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/></svg>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-1 font-display">React + Tailwind + Recharts</h3>
            <p class="text-sm text-slate-400 leading-relaxed">The same stack AI models target most. Your artifacts work out of the box&mdash;hooks, components, charts, and utility classes all included.</p>
          </div>
        </div>
      </div>
      <div class="feature-card p-6 rounded-xl border border-slate-800/80 bg-slate-900/20">
        <div class="flex items-start gap-4">
          <div class="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-1 font-display">Password protection</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Optionally lock a page behind a password. Share privately with clients, teammates, or just keep it to yourself.</p>
          </div>
        </div>
      </div>
      <div class="feature-card p-6 rounded-xl border border-slate-800/80 bg-slate-900/20">
        <div class="flex items-start gap-4">
          <div class="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/></svg>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-1 font-display">MCP server for AI agents</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Let Claude Code or other AI tools publish pages directly via the Model Context Protocol. Your agent builds it, Quick Page hosts it.</p>
          </div>
        </div>
      </div>
      <div class="feature-card p-6 rounded-xl border border-slate-800/80 bg-slate-900/20">
        <div class="flex items-start gap-4">
          <div class="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-1 font-display">Instant, zero-config hosting</h3>
            <p class="text-sm text-slate-400 leading-relaxed">No accounts, no repos, no build steps. Paste code, click create, get a URL. Your page is live in under a second.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="glow-line max-w-5xl mx-auto"></div>

  <!-- Editor -->
  <section id="editor" class="max-w-5xl mx-auto px-6 py-20 md:py-28 fade-up">
    <div class="max-w-3xl mx-auto">
      <p class="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-3 font-mono">Try it now</p>
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight font-display mb-10">Create a page</h2>

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
  </section>

  <!-- Footer -->
  <footer class="max-w-5xl mx-auto px-6 py-10 border-t border-slate-800/60">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M2 4L7 2L12 4L7 6L2 4Z" fill="white" opacity="0.9"/><path d="M2 7L7 9L12 7" stroke="white" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/></svg>
        </div>
        <span>Quick Page</span>
      </div>
      <a href="https://github.com/trezm/quick-page" target="_blank" class="hover:text-slate-300 transition-colors">GitHub</a>
    </div>
  </footer>

  <script>
    // Scroll-triggered fade-in
    (function() {
      var els = document.querySelectorAll('.fade-up');
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      els.forEach(function(el) { observer.observe(el); });
    })();

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
  <script crossorigin src="https://unpkg.com/prop-types@15/prop-types.min.js"><\/script>
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
