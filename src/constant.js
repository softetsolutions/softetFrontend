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

  export {initialHtml, initialCss, initialJs}