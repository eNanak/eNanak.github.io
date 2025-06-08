document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.querySelector('.loading-screen');
  const loadingText = document.getElementById('loading-text');
  const loadingProgress = document.getElementById('loading-progress');
  
  const loadingPhrases = [
    "Inicializando sistema...", "Cargando módulos...", "Preparando interfaz...",
    "Conectando con servidor...", "¡Listo para comenzar!"
  ];
  
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 100) progress = 100;
    loadingProgress.style.width = `${progress}%`;
    
    const phraseIndex = Math.min(Math.floor(progress / 25), loadingPhrases.length - 1);
    loadingText.textContent = loadingPhrases[phraseIndex];
    
    if (progress >= 100) {
      clearInterval(progressInterval);
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);
      }, 500);
    }
  }, 200);

  // Menu hamburguesa
  const menuToggle = document.getElementById('menu-toggle');
  const navBtns = document.getElementById('nav-btns');
  
  menuToggle.addEventListener('click', () => {
    navBtns.classList.toggle('active');
    menuToggle.innerHTML = navBtns.classList.contains('active') ? 
      '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Cerrar menu al hacer click en un enlace
  document.querySelectorAll('.nav-btn').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navBtns.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const html = document.documentElement;
  
  const savedTheme = localStorage.getItem('theme') || 
                   (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  
  if (savedTheme === 'light') {
    html.setAttribute('data-theme', 'light');
    themeToggle.checked = true;
  } else {
    html.removeAttribute('data-theme');
    themeToggle.checked = false;
  }
  
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    }
  });

  AOS.init({ duration: 800, once: true });

  const typingElement = document.getElementById("typing-text");
  if (typingElement) {
    const baseText = "user@eNanak~$ ";
    const typingTexts = [
      "Available commands", "whoami", "skills", "contact", "clear", "exit", 
      "quote", "cv", "ascii", "scan", "writeups", "certs", "theme"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isTyping = true;

    function typeWriter() {
      const currentTextToType = typingTexts[textIndex];
      const fullText = baseText + currentTextToType;
      if (isTyping) {
        if (charIndex <= fullText.length) {
          typingElement.textContent = fullText.slice(0, charIndex++);
          setTimeout(typeWriter, 60);
        } else {
          isTyping = false;
          setTimeout(typeWriter, 1500);
        }
      } else {
        if (charIndex >= baseText.length) {
          typingElement.textContent = fullText.slice(0, charIndex--);
          setTimeout(typeWriter, 30);
        } else {
          isTyping = true;
          textIndex = (textIndex + 1) % typingTexts.length;
          setTimeout(typeWriter, 500);
        }
      }
    }
    setTimeout(typeWriter, 1500);
  }

  const overlay = document.getElementById("terminal-overlay");
  const input = document.getElementById("terminal-command");
  const history = document.getElementById("terminal-history");
  const closeTerminalBtn = document.querySelector(".close-terminal");
  const commandHistory = [];
  let historyIndex = -1;
  const specialKeys = [
    "Control", "Alt", "Shift", "Delete", "Home", "End", "PageUp", "PageDown", 
    "PrintScreen", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Meta", 
    "Escape", "Tab", "CapsLock", "Insert", "NumLock"
  ];

  // Hacer que al hacer click en cualquier parte de la terminal se pueda escribir
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === document.getElementById('terminal-content')) {
      input.focus();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (specialKeys.includes(e.key) || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || e.target === input) return;
    if (e.key === "Escape") closeTerminal();
    else if (overlay.style.display !== "flex") openTerminal();
  });

  closeTerminalBtn.addEventListener("click", closeTerminal);
  function openTerminal() { overlay.style.display = "flex"; input.focus(); }
  function closeTerminal() { overlay.style.display = "none"; }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = e.target.value.trim();
      if (cmd) {
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
      }
      const output = document.createElement("p");
      output.innerHTML = `<span class="prompt-user">user@eNanak</span><span class="prompt-symbol">~$</span> ${cmd}`;
      history.appendChild(output);
      executeCommand(cmd);
      e.target.value = "";
      history.scrollTop = history.scrollHeight;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        historyIndex = Math.max(0, historyIndex - 1);
        input.value = commandHistory[historyIndex] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const commands = ['help', 'whoami', 'skills', 'contact', 'writeups', 'quote', 'clear', 'exit', 'theme'];
      const currentInput = e.target.value.toLowerCase();
      const match = commands.find(cmd => cmd.startsWith(currentInput));
      if (match) e.target.value = match;
    }
  });

  function executeCommand(cmd) {
    const response = document.createElement("div");
    response.classList.add("command-output");
    switch (cmd.toLowerCase()) {
      case "help":
        response.innerHTML = `<p>Comandos validos：</p><ul><li>'whoami'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Sobre mí</li><li>'skills'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Mis habilidades tecnicas</li><li>'contact'&nbsp;&nbsp;&nbsp;&nbsp;- Hablame!</li><li>'writeups'&nbsp;&nbsp;- Mira mis write-ups</li><li>'quote'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Obten una frase aleatoria</li><li>'theme'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Cambiar tema (claro/oscuro)</li><li>'clear'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Borra la terminal</li><li>'exit'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Cierra la terminal</li></ul>`;
        break;
      case "whoami":
        response.innerHTML = `<p>Cybersecurity student and CTF player.</p><p>Focus areas: Penetration Testing, Web Security, Cryptography.</p><p>Currently preparing for OSCP certification.</p>`;
        break;
      case "skills":
        response.innerHTML = `<ul><li>> Linux system administration</li><li>> Python scripting & Automation</li><li>> Web application testing (Burp Suite, OWASP ZAP)</li><li>> Network security tools (Nmap, Wireshark)</li><li>> Basic binary exploitation & reverse engineering</li></ul>`;
        break;
      case "contact":
        response.innerHTML = `<ul><li>> Email: <a href="mailto:contact@enanak.io">contact@enanak.io</a></li><li>> GitHub: <a href="https://github.com/eNanak" target="_blank">github.com/eNanak</a></li><li>> LinkedIn: <a href="https://linkedin.com/in/enanak" target="_blank">linkedin.com/in/enanak</a></li></ul>`;
        break;
      case "quote":
        const quotes = ["Si no lo documentas, es como si no existiera.", "Un firewall no es una muralla, solo una puerta con candado.", "El código perfecto es solo un mito, el que funciona es el que vale."];
        response.textContent = quotes[Math.floor(Math.random() * quotes.length)];
        break;
      case "theme":
        themeToggle.click();
        response.textContent = `Tema cambiado a ${themeToggle.checked ? 'claro' : 'oscuro'}`;
        break;
      case "clear":
        history.innerHTML = "";
        return;
      case "exit":
        closeTerminal();
        return;
      case "writeups":
        window.location.href = "#writeups";
        response.textContent = "Redirigiendo a la sección de Write Ups...";
        break;
      case "cv": case "ascii": case "scan": case "certs":
        response.textContent = `Comando '${cmd}' en desarrollo. ¡Vuelve pronto!`;
        break;
      default:
        response.innerHTML = `<span class="command-error">Comando no encontrado: ${cmd}. Escribe 'help' para ver comandos.</span>`;
        break;
    }
    history.appendChild(response);
  }
});