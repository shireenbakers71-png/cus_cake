const fs = require('fs');
const path = require('path');

const catDir = path.join(__dirname, 'categories');

const whatsappSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.399a7.682 7.682 0 0 0-10.86 0 7.636 7.636 0 0 0-2.012 5.087c0 1.636.425 3.235 1.232 4.65l-1.325 4.846 4.954-1.3a7.71 7.71 0 0 0 4.011 1.111h.001c4.254 0 7.715-3.46 7.715-7.714a7.675 7.675 0 0 0-2.253-5.462zM8.5 13.911a6.388 6.388 0 0 1-3.257-.887l-.234-.139-2.42.636.645-2.358-.153-.243a6.357 6.357 0 0 1-1.025-3.472C2.056 3.996 5.53 1.332 9.006 1.332c1.725 0 3.35.672 4.568 1.892 1.218 1.22 1.889 2.843 1.889 4.568 0 3.472-2.824 6.297-6.297 6.297z"/><path d="M11.854 9.692c-.17-.085-1.002-.495-1.157-.552-.155-.057-.268-.085-.38.085-.113.17-.438.552-.537.665-.099.113-.198.128-.368.043-.17-.085-.716-.264-1.364-.845-.505-.452-.846-1.003-.945-1.173-.099-.17-.01-.262.075-.347.075-.075.17-.198.255-.298.085-.099.113-.17.17-.283.057-.113.028-.212-.014-.298-.043-.085-.38-1.018-.521-1.396-.139-.368-.28-.318-.38-.323-.094-.005-.203-.005-.311-.005a.604.604 0 0 0-.437.203c-.155.17-.594.58-.594 1.414s.608 1.64.693 1.753c.085.113 1.196 1.828 2.898 2.544.405.17.72.271.966.347.408.128.78.11 1.074.068.328-.047 1.002-.41 1.144-.805.141-.395.141-.734.099-.805-.043-.07-.156-.113-.326-.198z"/></svg>`;

// The button HTML to inject into the template literal (inside the backtick string)
const buttonHTML = `
            <a href="#" class="order-now-btn" onclick="openWhatsApp(this, event)" style="margin-top:12px;width:100%;background:#25D366;color:#fff;border:none;padding:10px;border-radius:6px;font-weight:700;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;font-size:.95rem;">
              ${whatsappSVG}
              Order Now
            </a>`;

// The openWhatsApp function to inject before </script>
const orderFunction = `
    function openWhatsApp(btn, event) {
      event.preventDefault();
      var cardBody = btn.closest('.cake-body');
      var sel = cardBody.querySelector('.weight-select');
      var customIn = cardBody.querySelector('.custom-weight-input');
      var priceEl = cardBody.querySelector('.price-display');
      var weight;
      if (sel.value === 'custom') {
        weight = customIn && customIn.value ? customIn.value + ' lbs' : 'custom';
      } else {
        weight = sel.options[sel.selectedIndex].text;
      }
      var price = priceEl.textContent;
      var cakeType = '';
      var titleEl = document.querySelector('.page-title');
      if (titleEl) cakeType = titleEl.textContent.trim().replace(/\\s+/g, ' ');
      var imgEl = btn.closest('.cake-card').querySelector('.cake-img');
      var imgName = '';
      if (imgEl) { var s = imgEl.src; imgName = decodeURIComponent(s.substring(s.lastIndexOf('/') + 1)); }
      var msg = 'Hi Shireen Bakers!\\n\\nI would like to place an order:\\n' +
        '*Category*: ' + cakeType + '\\n' +
        '*Weight*: ' + weight + '\\n' +
        '*Price*: ' + price + '\\n' +
        '*Cake*: ' + imgName + '\\n\\n' +
        'Please confirm availability and delivery details.';
      window.open('https://wa.me/923288521441?text=' + encodeURIComponent(msg), '_blank');
    }`;

let count = 0;

fs.readdirSync(catDir).forEach(file => {
  if (path.extname(file) !== '.html') return;
  const filePath = path.join(catDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already injected
  if (content.includes('order-now-btn')) {
    console.log('SKIP (already has button):', file);
    return;
  }

  // STEP 1: Inject the button into the template literal.
  // We look for the closing of the price row div followed by closing cake-body and cake-card divs
  // Pattern: </h5>\n            </div>\n          </div>\n        </div>\n      `;
  // We want to add the button AFTER the price </div> and BEFORE </div></div> (card closers)

  // The exact pattern in the template literal:
  //   </div>
  //         </div>
  //       </div>
  //     `;
  // The price row ends with </h5> then </div>, then cake-body </div>, then cake-card </div>

  const templateEndRegex = /(<h5 class="price-display[^"]*"[^>]*>Rs\.[^<]*<\/h5>\s*<\/div>)\s*(<\/div>\s*<\/div>\s*`\s*;)/;

  if (templateEndRegex.test(content)) {
    content = content.replace(templateEndRegex, '$1' + buttonHTML + '\n          $2');
    
    // STEP 2: Inject the openWhatsApp function before </script>
    content = content.replace(/(\s*<\/script>)/, '\n' + orderFunction + '$1');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('UPDATED:', file);
    count++;
  } else {
    console.log('NO MATCH:', file);
  }
});

console.log('\nTotal updated:', count);
