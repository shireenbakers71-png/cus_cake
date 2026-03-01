$scriptContent = Get-Content -Raw -Path "script.js"

# We'll use a regex to replace the whole search block logic in script.js
$newSearchLogic = "// Category search functionality for header
const searchInput = document.getElementById('categorySearch');
const searchResults = document.getElementById('searchResults');
let dynamicCategories = [];

document.addEventListener('DOMContentLoaded', () => {
    // Populate dynamic categories on page load
    const cards = document.querySelectorAll('.category-minimal');
    cards.forEach(card => {
        const titleEl = card.querySelector('.minimal-title');
        const imgEl = card.querySelector('img');
        const href = card.getAttribute('href');
        
        if (titleEl && imgEl && href !== '#') {
            dynamicCategories.push({
                title: titleEl.textContent.trim(),
                image: imgEl.getAttribute('src'),
                link: href
            });
        }
    });

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            if (query.length === 0) {
                searchResults.style.display = 'none';
                searchResults.innerHTML = '';
                return;
            }

            // Find matches and calculate position
            const matches = dynamicCategories.map(cat => {
                const titleLower = cat.title.toLowerCase();
                const index = titleLower.indexOf(query);
                return {
                    ...cat,
                    index: index
                };
            }).filter(item => item.index !== -1);

            // Sort so that options starting with criteria appear first
            matches.sort((a, b) => {
                if (a.index === 0 && b.index !== 0) return -1;
                if (b.index === 0 && a.index !== 0) return 1;
                return a.index - b.index;
            });

            if (matches.length > 0) {
                searchResults.innerHTML = matches.map(cat => \\\ + \
\ +
\                    <a href="\ + \\\ + \" class="search-item" style="display: flex; align-items: center; padding: 10px; text-decoration: none; color: #333; border-bottom: 1px solid #f0f0f0; transition: background 0.2s;">\ + \\\ + \
\ +
\                        <img src="\ + \\\ + \" alt="\ + \\\ + \" style="width: 40px; height: 40px; object-fit: contain; border-radius: 6px; margin-right: 12px; background: #fff; border: 1px solid #eee;">\ + \\\ + \
\ +
\                        <span style="font-weight: 500; font-size: 0.9rem;">\ + \\\ + \</span>\ + \\\ + \
\ +
\                    </a>\ + \\\ + \
\ +
\                \).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = \<div style="padding: 12px; color: #888; text-align: center; font-size: 0.9rem;">No cakes found</div>\;
                searchResults.style.display = 'block';
            }
        });

        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
});"

$scriptContent = $scriptContent -replace '(?s)// Category search functionality for header.*?if \(!searchInput\.contains\(e\.target\).*?}\);.*?}','<<SEARCH_MARKER>>'

$scriptContent = $scriptContent.Replace('<<SEARCH_MARKER>>', $newSearchLogic)

Set-Content -Path "script.js" -Value $scriptContent -Encoding UTF8
