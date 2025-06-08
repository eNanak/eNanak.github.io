document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.writeups-container')) return;

    // Inicialización de AOS para animaciones
    AOS.init({ duration: 800, once: true });

    const views = {
        'category-view': document.getElementById('category-view'),
        'machine-list-view': document.getElementById('machine-list-view'),
        'machine-detail-view': document.getElementById('machine-detail-view'),
    };
    const pageTitle = document.getElementById('writeups-title');
    const machineListContainer = document.getElementById('machine-list-container');
    const writeupDetailContainer = document.getElementById('writeup-detail-container');
    
    let currentCategory = '';
    
    const writeupData = {
        htb: {
            name: "HackTheBox",
            machines: [
                { 
                    id: 'lame', 
                    name: 'Lame', 
                    os: 'linux', 
                    difficulty: 'easy', 
                    content: `
                        <h2>Write-up: Lame</h2>
                        <p>Lame es una máquina clásica y sencilla, ideal para principiantes. El vector de ataque principal es una vulnerabilidad en Samba...</p>
                        <pre><code>nmap -sV -sC 10.10.10.3</code></pre>
                        <p>Se descubre una versión vulnerable de Samba (3.0.20-Debian). Usando el exploit usermap_script en Metasploit, se obtiene acceso como root.</p>
                        <pre><code>use exploit/multi/samba/usermap_script
set RHOSTS 10.10.10.3
exploit</code></pre>
                    `
                },
                { 
                    id: 'legacy', 
                    name: 'Legacy', 
                    os: 'windows', 
                    difficulty: 'easy', 
                    content: '<h2>Write-up: Legacy</h2><p>Esta máquina explota la conocida vulnerabilidad MS08-067 en Windows XP...</p>'
                }
            ]
        },
        thm: {
            name: "TryHackMe",
            machines: [
                { 
                    id: 'blue', 
                    name: 'Blue', 
                    os: 'windows', 
                    difficulty: 'easy', 
                    content: '<h2>Write-up: Blue</h2><p>Similar a Legacy, Blue es vulnerable a MS17-010 (EternalBlue). El proceso involucra escanear puertos, identificar la vulnerabilidad y explotarla para obtener un shell de sistema.</p>'
                },
                { 
                    id: 'kenobi', 
                    name: 'Kenobi', 
                    os: 'linux', 
                    difficulty: 'easy', 
                    content: '<h2>Write-up: Kenobi</h2><p>La máquina Kenobi se centra en enumerar ProFTPd y Samba para encontrar vulnerabilidades y escalar privilegios a través de un binario con SUID.</p>'
                }
            ]
        },
        hmv: { name: "HackMyVM", machines: [] },
        docker: { name: "DockerLabs", machines: [] }
    };

    function switchView(targetViewId) {
        Object.values(views).forEach(v => v.classList.remove('active'));
        if (views[targetViewId]) {
            views[targetViewId].classList.add('active');
            window.scrollTo(0,0);
        }
    }
    
    function getDifficultyClass(d) { 
        return `difficulty-${d}`; 
    }

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            currentCategory = card.dataset.category;
            const data = writeupData[currentCategory];
            pageTitle.textContent = `Máquinas de ${data.name}`;
            machineListContainer.innerHTML = '';
            
            if(data.machines.length > 0) {
                data.machines.forEach(m => {
                    const el = document.createElement('li');
                    el.className = 'machine-item';
                    el.dataset.machineId = m.id;
                    el.innerHTML = `
                        <div>
                            <h4>${m.name}</h4>
                        </div>
                        <div class="machine-meta">
                            <span class="${getDifficultyClass(m.difficulty)}">
                                ${m.difficulty.charAt(0).toUpperCase() + m.difficulty.slice(1)}
                            </span>
                            <i class="fab fa-${m.os} fa-lg"></i>
                        </div>
                    `;
                    machineListContainer.appendChild(el);
                });
            } else {
                machineListContainer.innerHTML = '<p style="text-align:center; color: var(--secondary-color);">Aún no hay write-ups para esta categoría. ¡Vuelve pronto!</p>';
            }
            switchView('machine-list-view');
        });
    });
    
    machineListContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.machine-item');
        if(item) {
            const machineId = item.dataset.machineId;
            const machineData = writeupData[currentCategory].machines.find(m => m.id === machineId);
            if (machineData) {
                pageTitle.textContent = machineData.name;
                writeupDetailContainer.innerHTML = machineData.content;
                switchView('machine-detail-view');
            }
        }
    });

    document.querySelectorAll('.back-button').forEach(button => {
        button.addEventListener('click', () => {
            const targetView = button.dataset.target;
            if (targetView === 'category-view') {
                pageTitle.textContent = "Write-Ups";
            } else if (targetView === 'machine-list-view') {
                pageTitle.textContent = `Máquinas de ${writeupData[currentCategory].name}`;
            }
            switchView(targetView);
        });
    });
});