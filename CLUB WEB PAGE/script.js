// Navigation function to replace anchor tags (define globally before DOMContentLoaded)
function navigateTo(url) {
    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const menuBtn = document.getElementById('menu-toggle');

    // Initialize theme from localStorage or document attribute
    const savedTheme = localStorage.getItem('theme') || root.getAttribute('data-theme') || 'dark';
    root.setAttribute('data-theme', savedTheme);
    console.log('Initial theme:', savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const current = root.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            console.log('Theme changed to:', next);
        });
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', String(!expanded));
            document.body.classList.toggle('nav-open');
        });
    }

    // Club database
    const clubDatabase = [
        { name: "HEARTBEATS", cat: "Music", keywords: "music singing vocals instruments band performance", folder: "music" },
        { name: "DNB", cat: "Music", keywords: "drum and bass music electronic beats band production singing edm hiphop", folder: "music" },
        { name: "EUPHONY", cat: "Music", keywords: "classical choir music harmony band singing acoustic", folder: "music" },
        { name: "WEBWIZ", cat: "Coding", keywords: "coding javascript html css react fullstack frontend development", folder: "music" },
        { name: "APS", cat: "Coding", keywords: "coding algorithms competitive programming java c++", folder: "music" },
        { name: "GTA", cat: "Coding", keywords: "coding game development unity unreal graphics c# gaming gta", folder: "music" },
        { name: "CYBORG", cat: "Development", keywords: "development robotics hardware arduino embedded systems sensors automation", folder: "music"},
        { name: "UDAAN", cat: "Development", keywords: "innovation development drone aerospace flying tech competition projects aero modelling", folder: "music"},
        { name: "ML4E", cat: "Development", keywords: "machine learning development ai artificial intelligence data science python neural", folder: "music"},
        { name: "MAVERICKS", cat: "Dance", keywords: "hiphop street classical dance urban energy choreography", folder: "music" },
        { name: "SYNERGY", cat: "Dance", keywords: "contemporary ballet graceful dance hiphop", folder: "music" },
        { name: "RITVIC", cat: "Drama", keywords: "acting theater stage drama play production", folder: "music" },
        { name: "PANTOMIME", cat: "Drama", keywords: "mime expression silent comedy theater drama acting", folder: "music" },
        { name: "RAINBOWDOT", cat: "Social Service", keywords: "social service work charity kindness volunteer community help", folder: "music" },
        { name: "BLESS & BLISS", cat: "Social Service", keywords: "social service work mental health wellness support happiness", folder: "music" },
        { name: "CLARION", cat: "Literature", keywords: "debate mun speaking logic argument public speaker journalism", folder: "music" },
        { name: "OSS", cat: "Literature", keywords: "odia sahitya samaja writing culture odisha", folder: "music" },
        { name: "HOURGLASS", cat: "Literature", keywords: "public speaking mun debate writing english journalism", folder: "music" },
        { name: "AKRITI", cat: "Art", keywords: "art craft painting drawing illustrations sketching design", folder: "music" },
        { name: "CHITRAANG", cat: "Art", keywords: "art graffiti wall painting sketching illustrations design", folder: "music" },
        { name: "FUSION", cat: "Fashion", keywords: "fashion model modelling catwalk design cloth clothes", folder: "music" },
        { name: "CINEMATICS", cat: "Film", keywords: "movie acting filmmaking editing directing script cinema movie", folder: "music" },
        { name: "THIRDEYE", cat: "Photography", keywords: "photography camera dslr lens landscape editing photo photoshoot", folder: "music" },
    ];

    function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

    // Add Enter key support for the input field
    const inputEl = document.getElementById('interest-input');
    if (inputEl) {
        inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.suggestClubs();
            }
        });
    }

    // Expose global function used by inline onclick
    window.suggestClubs = function() {
        const inputEl = document.getElementById('interest-input');
        const output = document.getElementById('suggestion-output');
        if (!inputEl || !output) return;

        const q = inputEl.value.toLowerCase().trim();
        if (q.length < 2) { output.innerHTML = "<p style='color: var(--accent-alt);'>Type at least 2 letters to search...</p>"; return; }

        const matches = clubDatabase.filter(club => {
            return club.name.toLowerCase().includes(q) ||
                   club.keywords.toLowerCase().includes(q) ||
                   club.cat.toLowerCase().includes(q);
        });

        if (matches.length === 0) {
            output.innerHTML = "<p>No matches found. Try 'coding', 'music', or 'dance'.</p>";
            return;
        }

        const html = `\n            <div class="search-results-container">\n                <p style="color: var(--accent);">Top Matches for "${escapeHtml(q)}":</p>\n                <div class="results-grid">\n                    ${matches.map(club => {
                        const filename = club.name.toLowerCase().replace(/\s+/g,'').replace(/[^a-z0-9&-]/gi,'');
                        return `<button class="search-item" onclick="navigateTo('/${filename}')"><strong>${escapeHtml(club.name)}</strong><span>${escapeHtml(club.cat)}</span></button>`;
                    }).join('')}\n                </div>\n            </div>`;

        output.innerHTML = html;
    };
});
