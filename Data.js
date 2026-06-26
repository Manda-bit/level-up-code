// ── LEVEL DEFINITIONS ────────────────────────────────────────────────────
//
// Each level object has:
//   id            — unique number (1–9)
//   title         — full display name
//   shortTitle    — short name used on the path node
//   emoji         — single emoji for the level header
//   boss          — true only for level 9 (renders a larger, square node)
//   hook          — one-sentence real-world comparison to open the lesson
//   concept       — HTML string: full explanation with inline <code> etc.
//   why           — string: why this matters to a real developer
//   mistake       — HTML string: the common beginner error to watch out for
//   playgroundCode — starter code shown in the editable live playground
//   challengeDesc  — HTML string: what the learner must build to pass
//   challengeStarter — pre-filled code in the challenge editor
//   validate(code) — function that checks the challenge; returns
//                    { pass: true } or { pass: false, msg: "hint" }

const LEVELS = [
  {
    id: 1,
    title: "HTML Tags",
    shortTitle: "Tags",
    emoji: "🏷️",
    hook: "Think of HTML tags like the bones of a webpage — invisible structure holding everything together.",
    concept: `<p>Every piece of content on the web lives inside <strong>tags</strong>. A tag looks like this: <code>&lt;tagname&gt;content here&lt;/tagname&gt;</code>.</p>
<p>The first part is the <strong>opening tag</strong>: <code>&lt;p&gt;</code>. The second is the <strong>closing tag</strong>: <code>&lt;/p&gt;</code> (notice the slash). Everything in between is what the tag <em>wraps</em>.</p>
<p>Common tags: <code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code> for headings, <code>&lt;p&gt;</code> for paragraphs, <code>&lt;strong&gt;</code> for bold, <code>&lt;em&gt;</code> for italic.</p>`,
    why: "Every website — Google, YouTube, GitHub — is built from these exact same tags. Understanding them means you can read and understand the source code of any page on the internet.",
    mistake: `<p>Forgetting the closing tag is the most common error:</p>
<code>&lt;p&gt;This paragraph never ends
&lt;p&gt;Now things get messy</code>
<p>Always close your tags in the reverse order you opened them.</p>`,
    playgroundCode: `<h1>Hello, world!</h1>
<p>This is my first paragraph.</p>
<p>I can write <strong>bold</strong> or <em>italic</em> text.</p>`,
    challengeDesc: `Write a small HTML snippet that contains at least two <code>&lt;p&gt;</code> tags and one <code>&lt;h1&gt;</code> or <code>&lt;h2&gt;</code> heading.`,
    challengeStarter: `<h1>My Page</h1>
<p>Write your first paragraph here.</p>`,
    validate(code) {
      const pCount  = (code.match(/<p[\s>]/gi) || []).length;
      const hasH    = /<h[12][\s>]/i.test(code);
      if (pCount < 2) return { pass: false, msg: "You need at least two <p> tags. Add another paragraph!" };
      if (!hasH)      return { pass: false, msg: "Add an <h1> or <h2> heading to give your page a title." };
      return { pass: true };
    },
  },

  {
    id: 2,
    title: "Page Structure",
    shortTitle: "Structure",
    emoji: "🏗️",
    hook: "A webpage is like a newspaper: it has a masthead (header), a main story area, and a footer. HTML has exact tags for each.",
    concept: `<p>Modern HTML uses <strong>semantic elements</strong> — tags whose names describe their meaning, not just their appearance.</p>
<p><code>&lt;header&gt;</code> wraps your site logo and navigation. <code>&lt;main&gt;</code> holds the primary content of the page (there should only ever be one). <code>&lt;footer&gt;</code> goes at the bottom with copyright, links, etc.</p>
<p>Inside <code>&lt;main&gt;</code>, use <code>&lt;nav&gt;</code> for navigation links, <code>&lt;section&gt;</code> for distinct chunks of content, and <code>&lt;article&gt;</code> for self-contained pieces (like a blog post).</p>`,
    why: "Screen readers and search engines rely on semantic structure to understand a page. Google ranks pages partly based on correct structure. Accessibility tools let blind users jump directly to the &lt;main&gt; tag — a huge quality-of-life win.",
    mistake: `<p>Using <code>&lt;div&gt;</code> for everything is a classic mistake:</p>
<code>&lt;div class="top"&gt;Logo&lt;/div&gt;
&lt;div class="stuff"&gt;Content&lt;/div&gt;</code>
<p>This works visually, but means nothing to search engines or screen readers. Use <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, and <code>&lt;footer&gt;</code> instead.</p>`,
    playgroundCode: `<header>
  <h1>My Site</h1>
  <nav>
    <a href="#">Home</a>
    <a href="#">About</a>
  </nav>
</header>

<main>
  <section>
    <h2>Welcome</h2>
    <p>This is the main content area.</p>
  </section>
</main>

<footer>
  <p>© 2025 My Site</p>
</footer>`,
    challengeDesc: `Build a page skeleton that includes a <code>&lt;header&gt;</code>, a <code>&lt;main&gt;</code> with a <code>&lt;nav&gt;</code> inside it or inside the header, and a <code>&lt;footer&gt;</code>.`,
    challengeStarter: `<header>
  <h1>My Page</h1>
</header>

<main>
  <p>Main content here.</p>
</main>

<footer>
  <p>Footer here.</p>
</footer>`,
    validate(code) {
      const hasNav    = /<nav[\s>]/i.test(code);
      const hasMain   = /<main[\s>]/i.test(code);
      const hasFooter = /<footer[\s>]/i.test(code);
      if (!hasNav)    return { pass: false, msg: "Add a <nav> element — it's the semantic tag for navigation links." };
      if (!hasMain)   return { pass: false, msg: "You need a <main> element to wrap your primary content." };
      if (!hasFooter) return { pass: false, msg: "Don't forget the <footer>! Every good page has one." };
      return { pass: true };
    },
  },

  {
    id: 3,
    title: "Attributes",
    shortTitle: "Attributes",
    emoji: "🔖",
    hook: "Tags are nouns. Attributes are adjectives — they describe or configure a tag.",
    concept: `<p>An <strong>attribute</strong> lives inside the opening tag and adds extra information. The format is <code>name="value"</code>:</p>
<p><code>&lt;a href="https://example.com"&gt;Click me&lt;/a&gt;</code></p>
<p>Key attributes: <code>class</code> groups elements for CSS styling, <code>id</code> names one unique element, <code>src</code> gives an image its source, <code>href</code> gives a link its destination, <code>alt</code> describes an image in words.</p>`,
    why: "Without attributes, links have nowhere to go and images have nothing to show. The class and id attributes are also the bridge between HTML and CSS/JavaScript — without them, you can't style or select specific elements.",
    mistake: `<p>Forgetting quotes around attribute values breaks your HTML:</p>
<code>&lt;img src=photo.jpg alt=My photo&gt;</code>
<p>The browser might guess, but it often misreads anything with spaces. Always quote your values:</p>
<code>&lt;img src="photo.jpg" alt="My photo"&gt;</code>`,
    playgroundCode: `<h1 id="page-title">My Portfolio</h1>

<p class="intro">Welcome to my site!</p>

<a href="https://github.com" class="link">Visit GitHub</a>

<br><br>
<img src="https://via.placeholder.com/200x100"
     alt="A placeholder image">`,
    challengeDesc: `Write HTML that includes an element with a <code>class</code> attribute, an element with an <code>id</code> attribute, and a working link using <code>href</code>.`,
    challengeStarter: `<h1 id="my-title">Hello</h1>
<p class="intro">Write something here.</p>
<a href="#">A link</a>`,
    validate(code) {
      const hasClass = /class="/i.test(code);
      const hasId    = /id="/i.test(code);
      const hasHref  = /href="/i.test(code);
      if (!hasClass) return { pass: false, msg: 'Add a class="" attribute to at least one element.' };
      if (!hasId)    return { pass: false, msg: 'Add an id="" attribute to uniquely identify one element.' };
      if (!hasHref)  return { pass: false, msg: 'Add a link with href="" so it actually goes somewhere.' };
      return { pass: true };
    },
  },

  {
    id: 4,
    title: "CSS Basics",
    shortTitle: "CSS",
    emoji: "🎨",
    hook: "HTML builds the house. CSS paints it, furnishes it, and makes it look like a home.",
    concept: `<p>CSS stands for <strong>Cascading Style Sheets</strong>. You write rules that say: "select this element and apply these styles."</p>
<p>A rule looks like: <code>selector { property: value; }</code></p>
<p>Selectors: <code>p</code> targets all paragraphs, <code>.intro</code> targets elements with <code>class="intro"</code>, <code>#title</code> targets the element with <code>id="title"</code>.</p>
<p>Common properties: <code>color</code> (text color), <code>background-color</code>, <code>font-size</code>, <code>font-weight</code>.</p>`,
    why: "Every visual decision you see on the web — the exact shade of blue in a Twitter link, the spacing in a Netflix title card, the font on a New York Times article — is a CSS rule. It's the styling language of the entire internet.",
    mistake: `<p>Mixing up class and id selectors:</p>
<code>.my-id  { color: red; }   /* Wrong: this targets a class */
#my-class { color: red; } /* Wrong: this targets an id   */</code>
<p>Remember: <code>.</code> is for classes (reusable), <code>#</code> is for ids (one unique element).</p>`,
    playgroundCode: `<style>
  body {
    font-family: sans-serif;
    background-color: #f0f4ff;
  }
  h1 {
    color: #4338ca;
    font-size: 2rem;
  }
  .highlight {
    background-color: #fef08a;
    padding: 4px 8px;
  }
  #special {
    color: crimson;
    font-weight: bold;
  }
</style>

<h1>Styled Page</h1>
<p>This has a <span class="highlight">highlighted</span> word.</p>
<p id="special">This paragraph is special.</p>`,
    challengeDesc: `Write CSS that styles at least one element using a <strong>class selector</strong> (with <code>.</code>) and one using an <strong>element selector</strong> (like <code>p</code> or <code>h1</code>). Change at least one color.`,
    challengeStarter: `<style>
  /* Style a heading using its tag name */
  h2 {
    color: navy;
  }

  /* Style by class */
  .box {
    background-color: lightyellow;
  }
</style>

<h2>My Heading</h2>
<p class="box">A styled box.</p>`,
    validate(code) {
      const hasClassSel = /\.[a-z][\w-]*\s*\{/i.test(code);
      const hasElemSel  = /^[ \t]*(h[1-6]|p|div|span|a|ul|li|section)\s*\{/im.test(code);
      const hasColor    = /color\s*:/i.test(code);
      if (!hasClassSel) return { pass: false, msg: "Use a class selector (e.g. .my-class { ... }) in your CSS." };
      if (!hasElemSel)  return { pass: false, msg: "Add an element selector like h2 { } or p { } to style a tag by its name." };
      if (!hasColor)    return { pass: false, msg: "Change at least one color property — try color: or background-color:." };
      return { pass: true };
    },
  },

  {
    id: 5,
    title: "The Box Model",
    shortTitle: "Box Model",
    emoji: "📦",
    hook: "Every HTML element on a page is a box. The box model describes the space around that box.",
    concept: `<p>From the inside out, every element has four layers:</p>
<p><strong>Content</strong> — the actual text or image. <strong>Padding</strong> — space between the content and its border (inside the box). <strong>Border</strong> — a line around the padding. <strong>Margin</strong> — space outside the border (between this element and its neighbours).</p>
<p>Key properties: <code>padding: 16px</code>, <code>margin: 0 auto</code> (centers a block), <code>border: 2px solid red</code>, <code>width</code>, <code>height</code>.</p>
<p>Pro tip: add <code>box-sizing: border-box</code> so padding doesn't add to an element's total width.</p>`,
    why: "Every layout bug you'll ever fight — things that overlap, things that don't line up, elements that are too cramped — comes from misunderstanding the box model. Mastering it fixes 80% of CSS layout problems.",
    mistake: `<p>Wondering why an element is bigger than expected:</p>
<code>.box { width: 200px; padding: 20px; }
/* Total width is actually 240px! */</code>
<p>Fix: add <code>box-sizing: border-box</code> to make width include padding and border.</p>`,
    playgroundCode: `<style>
  .card {
    box-sizing: border-box;
    width: 280px;
    background: #e0e7ff;
    border: 2px solid #4338ca;
    border-radius: 8px;
    padding: 20px;
    margin: 16px;
  }
  .card h3 {
    margin: 0 0 8px;
    color: #312e81;
  }
  .card p {
    margin: 0;
    font-size: 0.875rem;
  }
</style>

<div class="card">
  <h3>Box Model Card</h3>
  <p>Padding gives me breathing room inside.
     Margin keeps me away from my neighbours.</p>
</div>`,
    challengeDesc: `Create an element that has visible <code>padding</code>, a <code>border</code>, and <code>margin</code>. You should be able to visually tell all three apart.`,
    challengeStarter: `<style>
  .my-box {
    padding: 16px;
    margin: 24px;
    border: 2px solid blue;
    background-color: lightyellow;
  }
</style>

<div class="my-box">
  I have padding, margin, and a border!
</div>`,
    validate(code) {
      const hasPadding = /padding\s*:/i.test(code);
      const hasBorder  = /border\s*:/i.test(code);
      const hasMargin  = /margin\s*:/i.test(code);
      if (!hasPadding) return { pass: false, msg: "Add a padding property to create space inside your element." };
      if (!hasBorder)  return { pass: false, msg: "Add a border property so we can see the edge of the box." };
      if (!hasMargin)  return { pass: false, msg: "Add a margin property to push this element away from its neighbours." };
      return { pass: true };
    },
  },

  {
    id: 6,
    title: "CSS Flexbox",
    shortTitle: "Flexbox",
    emoji: "↔️",
    hook: "Centering things used to be CSS's hardest joke. Flexbox made layout actually enjoyable.",
    concept: `<p>Flexbox is a CSS layout system that arranges children in a <strong>row</strong> or <strong>column</strong>, with easy control over alignment and spacing.</p>
<p>Turn it on by adding <code>display: flex</code> to a parent element. Then:</p>
<p><code>flex-direction</code>: <code>row</code> (horizontal, default) or <code>column</code> (vertical). <code>justify-content</code>: alignment along the main axis (<code>center</code>, <code>space-between</code>, <code>flex-start</code>). <code>align-items</code>: alignment on the cross axis (<code>center</code>, <code>stretch</code>).</p>
<p><code>gap</code> adds space between children without touching their margins.</p>`,
    why: "Navigation bars, card grids, centred hero sections, split-screen layouts — all built with Flexbox. It's the most-used CSS feature in modern web development. Every company using a design system uses Flexbox.",
    mistake: `<p>Applying flex properties to the wrong element:</p>
<code>/* WRONG: these go on the child */
.child { justify-content: center; }

/* RIGHT: flex properties go on the parent */
.parent { display: flex; justify-content: center; }</code>
<p><code>justify-content</code> and <code>align-items</code> always go on the flex <em>container</em>, not the children.</p>`,
    playgroundCode: `<style>
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #1e1b4b;
    padding: 12px 24px;
    gap: 16px;
  }
  .nav-logo  { color: #fbbf24; font-weight: bold; font-size: 1.1rem; }
  .nav-links { display: flex; gap: 20px; }
  .nav-links a { color: #e0e7ff; text-decoration: none; font-size: 0.9rem; }
  .center-demo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
    background: #f0f4ff;
    margin-top: 12px;
  }
  .centered-box {
    background: #4338ca;
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
  }
</style>

<nav class="nav">
  <span class="nav-logo">Logo</span>
  <div class="nav-links">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>
</nav>

<div class="center-demo">
  <div class="centered-box">I'm centered!</div>
</div>`,
    challengeDesc: `Create a flex container with at least 3 children. Use <code>display: flex</code>, set <code>justify-content</code> to something other than the default, and use <code>gap</code> to space the children.`,
    challengeStarter: `<style>
  .row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 16px;
    background: #f0f4ff;
  }
  .item {
    background: #4338ca;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
  }
</style>

<div class="row">
  <div class="item">One</div>
  <div class="item">Two</div>
  <div class="item">Three</div>
</div>`,
    validate(code) {
      const hasFlex    = /display\s*:\s*flex/i.test(code);
      const hasJustify = /justify-content\s*:/i.test(code);
      const hasGap     = /gap\s*:/i.test(code);
      if (!hasFlex)    return { pass: false, msg: "Your container needs display: flex; to activate Flexbox." };
      if (!hasJustify) return { pass: false, msg: "Add justify-content to control how children line up on the main axis." };
      if (!hasGap)     return { pass: false, msg: "Use gap: to add space between flex children — cleaner than adding margin to each one." };
      return { pass: true };
    },
  },

  {
    id: 7,
    title: "JavaScript Basics",
    shortTitle: "JS Basics",
    emoji: "⚡",
    hook: "HTML is the skeleton, CSS is the skin. JavaScript is the muscles — it makes things move and react.",
    concept: `<p>JavaScript (JS) is the programming language of the web. You can declare <strong>variables</strong> with <code>const</code> (value won't change) or <code>let</code> (value can change):</p>
<p><code>const name = "Alice";</code> — stores a string.<br><code>let count = 0;</code> — stores a number.</p>
<p>To respond to a user clicking a button, you use an <strong>event listener</strong>:</p>
<p><code>button.addEventListener('click', function() { /* runs on click */ });</code></p>
<p>To find an element on the page, use <code>document.getElementById('myId')</code>.</p>`,
    why: "Every interactive thing on the web — form validation, loading spinners, popups, live search, the Like button on Instagram — is JavaScript. Without it, websites are static documents. With it, they're applications.",
    mistake: `<p>Running JavaScript before the page has loaded:</p>
<code>&lt;head&gt;
  &lt;script&gt;
    document.getElementById('btn') // Returns null! Not in DOM yet.
  &lt;/script&gt;
&lt;/head&gt;</code>
<p>Fix: put your <code>&lt;script&gt;</code> at the bottom of <code>&lt;body&gt;</code>, or use the <code>defer</code> attribute.</p>`,
    playgroundCode: `<button id="my-btn">Click me!</button>
<p id="output">Nothing yet.</p>

<script>
  const btn    = document.getElementById('my-btn');
  const output = document.getElementById('output');
  let count = 0;

  btn.addEventListener('click', function() {
    count = count + 1;
    output.textContent = 'You clicked ' + count + ' times!';
  });
</script>`,
    challengeDesc: `Write HTML with a button and a paragraph. When the button is clicked, change the paragraph's text using JavaScript. Your script must use <code>addEventListener</code> and update an element's <code>textContent</code>.`,
    challengeStarter: `<button id="go-btn">Press me</button>
<p id="result">Waiting...</p>

<script>
  const btn = document.getElementById('go-btn');

  btn.addEventListener('click', function() {
    document.getElementById('result').textContent = 'It worked!';
  });
</script>`,
    validate(code) {
      const hasButton      = /<button/i.test(code);
      const hasListener    = /addEventListener/i.test(code);
      const hasTextContent = /textContent/i.test(code);
      if (!hasButton)      return { pass: false, msg: "Add a <button> element the user can click." };
      if (!hasListener)    return { pass: false, msg: "Use addEventListener to listen for the click event on your button." };
      if (!hasTextContent) return { pass: false, msg: "Update an element's .textContent to show something happened." };
      return { pass: true };
    },
  },

  {
    id: 8,
    title: "The DOM",
    shortTitle: "The DOM",
    emoji: "🌳",
    hook: "The DOM is JavaScript's view of your HTML — a living tree of objects you can read and rewrite on the fly.",
    concept: `<p>DOM stands for <strong>Document Object Model</strong>. When a browser loads your HTML, it creates a tree of objects (nodes) that you can manipulate with JavaScript.</p>
<p>Select elements: <code>document.querySelector('.my-class')</code> or <code>document.querySelectorAll('p')</code> for multiple.</p>
<p>Change content: <code>el.textContent = 'New text'</code> or <code>el.innerHTML = '&lt;strong&gt;Bold&lt;/strong&gt;'</code>.</p>
<p>Change styles: <code>el.style.color = 'red'</code> or <code>el.classList.add('active')</code>.</p>`,
    why: "Every app you use — Google Docs updating a word count, Twitter showing new tweets without reloading, a dark mode toggle — works by manipulating the DOM. This is the core skill that separates someone who can style a static page from someone who can build a real web app.",
    mistake: `<p>Using innerHTML for user-provided text:</p>
<code>el.innerHTML = userInput; // Dangerous! Allows script injection</code>
<p>If the content is just text (no HTML tags needed), always use <code>textContent</code>. It's safe. Only use <code>innerHTML</code> when you genuinely need to insert HTML markup.</p>`,
    playgroundCode: `<div id="box" style="
  width:200px; height:80px; background:#4338ca;
  display:flex; align-items:center;
  justify-content:center; border-radius:8px;
  color:white; font-size:1rem; cursor:pointer;
  transition: background 0.3s;">
  Click to change me!
</div>

<p id="info">No clicks yet.</p>

<script>
  const box    = document.querySelector('#box');
  const info   = document.querySelector('#info');
  const colors = ['#4338ca','#dc2626','#059669','#d97706','#7c3aed'];
  let clicks = 0;

  box.addEventListener('click', function() {
    clicks++;
    const color = colors[clicks % colors.length];
    box.style.background = color;
    box.textContent      = 'Color #' + clicks;
    info.textContent     = 'Clicked ' + clicks + ' times. Current: ' + color;
  });
</script>`,
    challengeDesc: `Use <code>document.querySelector</code> to select at least two different elements. Change one element's <code>textContent</code> and another's <code>style</code> property when a button is clicked.`,
    challengeStarter: `<button id="btn">Transform!</button>
<p id="message">Original text</p>
<div id="box" style="width:100px;height:40px;background:blue;"></div>

<script>
  document.querySelector('#btn').addEventListener('click', function() {
    document.querySelector('#message').textContent = 'Text changed!';
    document.querySelector('#box').style.background = 'green';
  });
</script>`,
    validate(code) {
      const selectorCount = (code.match(/querySelector/gi) || []).length;
      const hasStyle      = /\.style\./i.test(code);
      const hasText       = /textContent/i.test(code);
      if (selectorCount < 2) return { pass: false, msg: "Use querySelector at least twice to select two different elements." };
      if (!hasStyle)         return { pass: false, msg: "Change a style using el.style.someProperty = 'value'." };
      if (!hasText)          return { pass: false, msg: "Update an element's .textContent to change its displayed text." };
      return { pass: true };
    },
  },

  {
    id: 9,
    title: "Final Boss",
    shortTitle: "Mini Project",
    emoji: "⚔️",
    boss: true,
    hook: "Everything you've learned comes together in one mini project. Build a working interactive card.",
    concept: `<p>You now know: <strong>HTML tags</strong> for structure, <strong>semantic elements</strong> for meaning, <strong>attributes</strong> to configure tags, <strong>CSS</strong> to style everything, the <strong>box model</strong> for spacing, <strong>Flexbox</strong> for layout, <strong>JavaScript</strong> for interactivity, and the <strong>DOM</strong> to connect it all.</p>
<p>A real webpage uses all of these together. This challenge asks you to build a small interactive profile card that demonstrates each concept. You've got everything you need.</p>`,
    why: "Every professional project — a landing page, a portfolio, a dashboard — is just these building blocks combined at scale. You just unlocked the mental model that makes all of it learnable.",
    mistake: `<p>Trying to build everything at once. Real developers build incrementally:</p>
<p>1. Write the HTML structure first. 2. Add CSS to make it look right. 3. Finally wire up JavaScript. Test at each step — don't write 100 lines and then debug.</p>`,
    playgroundCode: `<style>
  body { font-family: sans-serif; background: #f0f4ff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
  .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.1); width: 280px; text-align: center; }
  .avatar { width: 80px; height: 80px; border-radius: 50%; background: #4338ca; color: white; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
  .name   { font-size: 1.25rem; font-weight: 600; margin-bottom: 4px; }
  .role   { color: #6b7280; font-size: 0.875rem; margin-bottom: 16px; }
  .follow-btn { background: #4338ca; color: white; border: none; border-radius: 100px; padding: 8px 24px; font-size: 0.9rem; cursor: pointer; transition: background 0.2s; width: 100%; }
  .follow-btn.following { background: #059669; }
  .stats { display: flex; justify-content: space-around; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
  .stat-num   { font-weight: 600; font-size: 1.1rem; }
  .stat-label { font-size: 0.75rem; color: #9ca3af; }
</style>

<div class="card">
  <div class="avatar">👩‍💻</div>
  <div class="name" id="card-name">Alex Dev</div>
  <div class="role">Front-end Engineer</div>
  <button class="follow-btn" id="follow-btn">Follow</button>
  <div class="stats">
    <div><div class="stat-num" id="followers">128</div><div class="stat-label">Followers</div></div>
    <div><div class="stat-num">47</div><div class="stat-label">Following</div></div>
    <div><div class="stat-num">12</div><div class="stat-label">Projects</div></div>
  </div>
</div>

<script>
  const btn       = document.querySelector('#follow-btn');
  const followers = document.querySelector('#followers');
  let following = false;
  let count = 128;

  btn.addEventListener('click', function() {
    following = !following;
    if (following) {
      count++;
      btn.textContent = 'Following ✓';
      btn.classList.add('following');
    } else {
      count--;
      btn.textContent = 'Follow';
      btn.classList.remove('following');
    }
    followers.textContent = count;
  });
</script>`,
    challengeDesc: `Build an interactive profile card from scratch. It must contain: semantic HTML (<code>header</code>, <code>main</code>, or <code>section</code>), at least one <code>class</code> and one <code>id</code> attribute, CSS with Flexbox, a box model property (padding/margin/border), and JavaScript that responds to a click to update the DOM.`,
    challengeStarter: `<style>
  .card {
    padding: 24px;
    border: 2px solid #4338ca;
    border-radius: 12px;
    max-width: 280px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
</style>

<section class="card">
  <h2 id="card-name">Your Name</h2>
  <p>Your bio here.</p>
  <button id="like-btn">❤️ Like</button>
  <p id="like-count">0 likes</p>
</section>

<script>
  let likes = 0;
  document.querySelector('#like-btn').addEventListener('click', function() {
    likes++;
    document.querySelector('#like-count').textContent = likes + ' likes';
  });
</script>`,
    validate(code) {
      const hasSemantic  = /<(header|main|footer|section|article|nav)[\s>]/i.test(code);
      const hasClass     = /class="/i.test(code);
      const hasId        = /id="/i.test(code);
      const hasFlex      = /display\s*:\s*flex/i.test(code);
      const hasBoxModel  = /(padding|margin|border)\s*:/i.test(code);
      const hasJS        = /addEventListener/i.test(code);
      const hasDOMUpdate = /(textContent|style\.|classList)/i.test(code);
      if (!hasSemantic)       return { pass: false, msg: "Use at least one semantic element: <section>, <header>, <main>, <article>, etc." };
      if (!hasClass || !hasId) return { pass: false, msg: 'Include both a class="..." and an id="..." attribute somewhere in your HTML.' };
      if (!hasFlex)           return { pass: false, msg: "Use display: flex in your CSS to lay out some part of the card." };
      if (!hasBoxModel)       return { pass: false, msg: "Add padding, margin, or border to demonstrate the box model." };
      if (!hasJS)             return { pass: false, msg: "Your JavaScript must use addEventListener to respond to user interaction." };
      if (!hasDOMUpdate)      return { pass: false, msg: "Update the DOM when the user interacts — change textContent, a style, or a class." };
      return { pass: true };
    },
  },
];

// ── RANK THRESHOLDS ──────────────────────────────────────────────────────
//
// getRank(xp) is computed from this table — no separate storage needed.

const RANKS = [
  { xp:   0, name: 'Newbie'     },
  { xp:  20, name: 'Apprentice' },
  { xp:  60, name: 'Builder'    },
  { xp: 120, name: 'Coder'      },
  { xp: 200, name: 'Engineer'   },
];
