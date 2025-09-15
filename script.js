// Kaomoji Sticker Inventory Application
class KaomojiInventory {
    constructor() {
        this.kaomoji = [];
        this.stickerGrid = document.getElementById('stickerGrid');
        this.init();
    }

    async init() {
        try {
            await this.loadKaomoji();
            this.renderStickers();
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to initialize kaomoji inventory:', error);
            this.showError('Failed to load kaomoji inventory');
        }
    }

    async loadKaomoji() {
        try {
            const response = await fetch('kaomoji-inventory.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.kaomoji = data.kaomoji;
        } catch (error) {
            console.error('Error loading kaomoji:', error);
            // Fallback data if JSON fails to load
            this.kaomoji = [
                {
                    id: "shrug",
                    symbol: "¯\\_(ツ)_/¯",
                    name: "Shrug",
                    description: "I don't know / Whatever",
                    animation: "shrug",
                    category: "expressions",
                    tags: ["shrug", "dunno", "whatever", "indifferent"]
                }
            ];
        }
    }

    renderStickers() {
        this.stickerGrid.innerHTML = '';
        
        this.kaomoji.forEach(kaomoji => {
            const stickerCard = this.createStickerCard(kaomoji);
            this.stickerGrid.appendChild(stickerCard);
        });
    }

    createStickerCard(kaomoji) {
        const card = document.createElement('div');
        card.className = 'sticker-card';
        card.dataset.kaomojiId = kaomoji.id;
        
        let kaomojiHtml;
        
        // Special handling for kaomoji that need split elements for individual animations
        if (kaomoji.id === 'shrug') {
            kaomojiHtml = `
                <div class="kaomoji ${kaomoji.animation}" data-symbol="${kaomoji.symbol}">
                    <span class="shrug-left-hand">¯\\_</span><span class="shrug-face">(ツ)</span><span class="shrug-right-hand">_/¯</span>
                </div>
            `;
        } else if (kaomoji.id === 'love') {
            kaomojiHtml = `
                <div class="kaomoji ${kaomoji.animation}" data-symbol="${kaomoji.symbol}">
                    <span class="love-bracket">(</span><span class="love-left-heart">♥</span><span class="love-smile">‿</span><span class="love-right-heart">♥</span><span class="love-bracket">)</span>
                </div>
            `;
        } else if (kaomoji.id === 'wink') {
            kaomojiHtml = `
                <div class="kaomoji ${kaomoji.animation}" data-symbol="${kaomoji.symbol}">
                    <span class="wink-bracket">(</span><span class="wink-eye">^</span><span class="wink-nose">_</span><span class="wink-closed">-</span><span class="wink-bracket">)</span>
                </div>
            `;
        } else if (kaomoji.id === 'crying') {
            kaomojiHtml = `
                <div class="kaomoji ${kaomoji.animation}" data-symbol="${kaomoji.symbol}">
                    <span class="cry-bracket">(</span><span class="cry-left-tear">T</span><span class="cry-nose">_</span><span class="cry-right-tear">T</span><span class="cry-bracket">)</span>
                </div>
            `;
        } else {
            kaomojiHtml = `
                <div class="kaomoji ${kaomoji.animation}" data-symbol="${kaomoji.symbol}">
                    ${kaomoji.symbol}
                </div>
            `;
        }
        
        card.innerHTML = `
            ${kaomojiHtml}
            <div class="sticker-name">${kaomoji.name}</div>
            <div class="sticker-description">${kaomoji.description}</div>
            <div class="export-controls">
                <button class="export-btn gif-export" onclick="exportAsGif('${kaomoji.id}')">GIF</button>
                <button class="export-btn html-export" onclick="exportAsHtml('${kaomoji.id}')">HTML</button>
                <button class="export-btn code-export" onclick="exportAsCode('${kaomoji.id}')">Code</button>
            </div>
        `;
        
        return card;
    }

    setupEventListeners() {
        // Add click listeners for copying kaomoji
        this.stickerGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.sticker-card');
            if (card) {
                const kaomojiElement = card.querySelector('.kaomoji');
                const symbol = kaomojiElement.dataset.symbol;
                this.copyToClipboard(symbol);
                this.showCopyFeedback(symbol);
            }
        });

        // Add hover effects for enhanced interactivity
        this.stickerGrid.addEventListener('mouseenter', (e) => {
            const kaomoji = e.target.closest('.kaomoji');
            if (kaomoji) {
                this.enhanceAnimation(kaomoji);
            }
        }, true);

        this.stickerGrid.addEventListener('mouseleave', (e) => {
            const kaomoji = e.target.closest('.kaomoji');
            if (kaomoji) {
                this.normalizeAnimation(kaomoji);
            }
        }, true);
    }

    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers or non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    }

    showCopyFeedback(symbol) {
        // Remove existing feedback
        const existingFeedback = document.querySelector('.copy-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create new feedback element
        const feedback = document.createElement('div');
        feedback.className = 'copy-feedback';
        feedback.textContent = `Copied: ${symbol}`;
        document.body.appendChild(feedback);

        // Show feedback
        setTimeout(() => feedback.classList.add('show'), 10);

        // Hide and remove feedback
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    enhanceAnimation(kaomojiElement) {
        const currentClasses = kaomojiElement.className;
        if (currentClasses.includes('shrug')) {
            // For shrug, enhance the hand animations
            const hands = kaomojiElement.querySelectorAll('.shrug-left-hand, .shrug-right-hand');
            const face = kaomojiElement.querySelector('.shrug-face');
            hands.forEach(hand => hand.style.animationDuration = '0.8s');
            if (face) face.style.animationDuration = '1.5s';
        } else if (currentClasses.includes('love')) {
            // For love, enhance only the heart animations (base elements stay static)
            const hearts = kaomojiElement.querySelectorAll('.love-left-heart, .love-right-heart');
            hearts.forEach(heart => heart.style.animationDuration = '0.8s');
        } else if (currentClasses.includes('wink')) {
            // For wink, enhance only the winking eye (base elements stay static)
            const eye = kaomojiElement.querySelector('.wink-eye');
            if (eye) eye.style.animationDuration = '1s';
        } else if (currentClasses.includes('cry')) {
            // For cry, enhance only the tear animations (base elements stay static)
            const tears = kaomojiElement.querySelectorAll('.cry-left-tear, .cry-right-tear');
            tears.forEach(tear => tear.style.animationDuration = '1.5s');
        } else if (currentClasses.includes('bounce')) {
            kaomojiElement.style.animationDuration = '0.8s';
        } else if (currentClasses.includes('wiggle')) {
            kaomojiElement.style.animationDuration = '0.5s';
        } else if (currentClasses.includes('pulse')) {
            kaomojiElement.style.animationDuration = '1s';
        } else if (currentClasses.includes('joy')) {
            kaomojiElement.style.animationDuration = '0.6s';
        } else if (currentClasses.includes('cry')) {
            kaomojiElement.style.animationDuration = '1s';
        } else if (currentClasses.includes('celebrate')) {
            kaomojiElement.style.animationDuration = '0.8s';
        } else if (currentClasses.includes('tableflip')) {
            kaomojiElement.style.animationDuration = '1s';
        } else if (currentClasses.includes('tablefix')) {
            kaomojiElement.style.animationDuration = '1.5s';
        } else if (currentClasses.includes('dance')) {
            kaomojiElement.style.animationDuration = '0.5s';
        } else if (currentClasses.includes('hug')) {
            kaomojiElement.style.animationDuration = '1.5s';
        } else if (currentClasses.includes('bear')) {
            kaomojiElement.style.animationDuration = '1s';
        }
    }

    normalizeAnimation(kaomojiElement) {
        const currentClasses = kaomojiElement.className;
        if (currentClasses.includes('shrug')) {
            // For shrug, normalize the hand animations
            const hands = kaomojiElement.querySelectorAll('.shrug-left-hand, .shrug-right-hand');
            const face = kaomojiElement.querySelector('.shrug-face');
            hands.forEach(hand => hand.style.animationDuration = '1.5s');
            if (face) face.style.animationDuration = '3s';
        } else if (currentClasses.includes('love')) {
            // For love, normalize only the heart animations (base elements stay static)
            const hearts = kaomojiElement.querySelectorAll('.love-left-heart, .love-right-heart');
            hearts.forEach(heart => heart.style.animationDuration = '1.5s');
        } else if (currentClasses.includes('wink')) {
            // For wink, normalize only the winking eye (base elements stay static)
            const eye = kaomojiElement.querySelector('.wink-eye');
            if (eye) eye.style.animationDuration = '2s';
        } else if (currentClasses.includes('cry')) {
            // For cry, normalize only the tear animations (base elements stay static)
            const tears = kaomojiElement.querySelectorAll('.cry-left-tear, .cry-right-tear');
            tears.forEach(tear => tear.style.animationDuration = '2.5s');
        } else if (currentClasses.includes('bounce')) {
            kaomojiElement.style.animationDuration = '1.5s';
        } else if (currentClasses.includes('wiggle')) {
            kaomojiElement.style.animationDuration = '1s';
        } else if (currentClasses.includes('pulse')) {
            kaomojiElement.style.animationDuration = '2s';
        } else if (currentClasses.includes('joy')) {
            kaomojiElement.style.animationDuration = '1.2s';
        } else if (currentClasses.includes('cry')) {
            kaomojiElement.style.animationDuration = '2s';
        } else if (currentClasses.includes('celebrate')) {
            kaomojiElement.style.animationDuration = '1.5s';
        } else if (currentClasses.includes('tableflip')) {
            kaomojiElement.style.animationDuration = '2s';
        } else if (currentClasses.includes('tablefix')) {
            kaomojiElement.style.animationDuration = '3s';
        } else if (currentClasses.includes('dance')) {
            kaomojiElement.style.animationDuration = '1s';
        } else if (currentClasses.includes('hug')) {
            kaomojiElement.style.animationDuration = '2.5s';
        } else if (currentClasses.includes('bear')) {
            kaomojiElement.style.animationDuration = '1.8s';
        }
    }

    showError(message) {
        this.stickerGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #ff6b6b; padding: 40px;">
                <h3>⚠️ Error</h3>
                <p>${message}</p>
            </div>
        `;
    }

    // Method to add new kaomoji (for future expansion)
    addKaomoji(newKaomoji) {
        this.kaomoji.push(newKaomoji);
        this.renderStickers();
    }

    // Method to filter kaomoji by category or tag
    filterKaomoji(filterType, filterValue) {
        const filtered = this.kaomoji.filter(kaomoji => {
            if (filterType === 'category') {
                return kaomoji.category === filterValue;
            } else if (filterType === 'tag') {
                return kaomoji.tags.includes(filterValue);
            }
            return true;
        });

        this.renderFilteredStickers(filtered);
    }

    renderFilteredStickers(filteredKaomoji) {
        this.stickerGrid.innerHTML = '';
        
        filteredKaomoji.forEach(kaomoji => {
            const stickerCard = this.createStickerCard(kaomoji);
            this.stickerGrid.appendChild(stickerCard);
        });
    }
}

// Export Functions
let kaomojiInventoryInstance;

// GIF Export functionality
async function exportAsGif(kaomojiId) {
    const kaomoji = kaomojiInventoryInstance.kaomoji.find(k => k.id === kaomojiId);
    if (!kaomoji) return;

    const modal = document.getElementById('exportModal');
    const title = document.getElementById('exportModalTitle');
    const body = document.getElementById('exportModalBody');
    
    title.textContent = `Export ${kaomoji.name} as GIF`;
    body.innerHTML = `
        <p>Creating animated GIF... <span class="loading-indicator"></span></p>
        <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">
            This may take a few seconds to capture the animation frames.
        </p>
    `;
    
    modal.classList.add('show');
    
    try {
        // Create a temporary container for recording
        const recordContainer = document.createElement('div');
        recordContainer.style.position = 'absolute';
        recordContainer.style.left = '-9999px';
        recordContainer.style.background = 'white';
        recordContainer.style.padding = '20px';
        recordContainer.style.fontSize = '3rem';
        recordContainer.style.fontFamily = 'Courier New, monospace';
        document.body.appendChild(recordContainer);
        
        // Clone the kaomoji element
        const originalElement = document.querySelector(`[data-kaomoji-id="${kaomojiId}"] .kaomoji`);
        const clonedElement = originalElement.cloneNode(true);
        recordContainer.appendChild(clonedElement);
        
        // Setup GIF creation
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: 200,
            height: 100,
            background: '#FFFFFF'
        });
        
        // Create canvas for recording frames
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        // Record frames
        const frameCount = 30;
        const animationDuration = kaomoji.animation === 'shrug' ? 1500 : 2000;
        
        for (let i = 0; i < frameCount; i++) {
            await new Promise(resolve => {
                setTimeout(async () => {
                    // Clear canvas
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw kaomoji text
                    ctx.fillStyle = '#000000';
                    ctx.font = '3rem Courier New, monospace';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(kaomoji.symbol, canvas.width / 2, canvas.height / 2);
                    
                    // Add frame to GIF
                    gif.addFrame(canvas, { delay: animationDuration / frameCount });
                    resolve();
                }, (animationDuration / frameCount) * i);
            });
        }
        
        // Clean up
        document.body.removeChild(recordContainer);
        
        // Render GIF
        gif.on('finished', function(blob) {
            const url = URL.createObjectURL(blob);
            body.innerHTML = `
                <p style="text-align: center; margin-bottom: 15px;">
                    <img src="${url}" alt="${kaomoji.name} GIF" style="max-width: 200px; border: 2px solid #eee; border-radius: 10px;">
                </p>
                <button class="download-btn" onclick="downloadFile('${url}', '${kaomoji.name.toLowerCase()}_kaomoji.gif')">
                    Download GIF
                </button>
            `;
        });
        
        gif.render();
        
    } catch (error) {
        console.error('GIF export failed:', error);
        body.innerHTML = `
            <p style="color: #ff6b6b; text-align: center;">
                ⚠️ Failed to create GIF. Try the HTML or Code export instead.
            </p>
            <button class="download-btn" onclick="closeExportModal()">Close</button>
        `;
    }
}

// HTML Export functionality
function exportAsHtml(kaomojiId) {
    const kaomoji = kaomojiInventoryInstance.kaomoji.find(k => k.id === kaomojiId);
    if (!kaomoji) return;

    const modal = document.getElementById('exportModal');
    const title = document.getElementById('exportModalTitle');
    const body = document.getElementById('exportModalBody');
    
    title.textContent = `Export ${kaomoji.name} as HTML`;
    
    // Generate standalone HTML
    const htmlContent = generateStandaloneHtml(kaomoji);
    
    body.innerHTML = `
        <p>Standalone HTML file for ${kaomoji.name}:</p>
        <textarea readonly>${htmlContent}</textarea>
        <button class="download-btn" onclick="downloadHtmlFile('${kaomoji.id}')">
            Download HTML File
        </button>
    `;
    
    modal.classList.add('show');
}

// Code Export functionality
function exportAsCode(kaomojiId) {
    const kaomoji = kaomojiInventoryInstance.kaomoji.find(k => k.id === kaomojiId);
    if (!kaomoji) return;

    const modal = document.getElementById('exportModal');
    const title = document.getElementById('exportModalTitle');
    const body = document.getElementById('exportModalBody');
    
    title.textContent = `Export ${kaomoji.name} Code`;
    
    const codeContent = generateKaomojiCode(kaomoji);
    
    body.innerHTML = `
        <p>HTML and CSS code for ${kaomoji.name}:</p>
        <textarea readonly>${codeContent}</textarea>
        <button class="download-btn" onclick="copyCodeToClipboard('${kaomoji.id}')">
            Copy to Clipboard
        </button>
    `;
    
    modal.classList.add('show');
}

// Helper functions
function generateStandaloneHtml(kaomoji) {
    const isShrug = kaomoji.id === 'shrug';
    const isLove = kaomoji.id === 'love';
    const isWink = kaomoji.id === 'wink';
    const isCry = kaomoji.id === 'crying';
    
    let kaomojiHtml;
    if (isShrug) {
        kaomojiHtml = `<span class="shrug-left-hand">¯\\_</span><span class="shrug-face">(ツ)</span><span class="shrug-right-hand">_/¯</span>`;
    } else if (isLove) {
        kaomojiHtml = `<span class="love-bracket">(</span><span class="love-left-heart">♥</span><span class="love-smile">‿</span><span class="love-right-heart">♥</span><span class="love-bracket">)</span>`;
    } else if (isWink) {
        kaomojiHtml = `<span class="wink-bracket">(</span><span class="wink-eye">^</span><span class="wink-nose">_</span><span class="wink-closed">-</span><span class="wink-bracket">)</span>`;
    } else if (isCry) {
        kaomojiHtml = `<span class="cry-bracket">(</span><span class="cry-left-tear">T</span><span class="cry-nose">_</span><span class="cry-right-tear">T</span><span class="cry-bracket">)</span>`;
    } else {
        kaomojiHtml = kaomoji.symbol;
    }
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${kaomoji.name} - Animated Kaomoji</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            font-family: 'Courier New', monospace;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .kaomoji {
            font-size: 4rem;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            white-space: nowrap;
            ${isShrug || isLove || isWink || isCry ? 'display: flex; justify-content: center; align-items: center; gap: 0;' : ''}
        }
        ${getAnimationCSS(kaomoji)}
    </style>
</head>
<body>
    <div class="kaomoji ${kaomoji.animation}">
        ${kaomojiHtml}
    </div>
</body>
</html>`;
}

function generateKaomojiCode(kaomoji) {
    const isShrug = kaomoji.id === 'shrug';
    const isLove = kaomoji.id === 'love';
    const isWink = kaomoji.id === 'wink';
    const isCry = kaomoji.id === 'crying';
    
    let htmlCode;
    if (isShrug) {
        htmlCode = `<div class="kaomoji ${kaomoji.animation}">
    <span class="shrug-left-hand">¯\\_</span><span class="shrug-face">(ツ)</span><span class="shrug-right-hand">_/¯</span>
</div>`;
    } else if (isLove) {
        htmlCode = `<div class="kaomoji ${kaomoji.animation}">
    <span class="love-bracket">(</span><span class="love-left-heart">♥</span><span class="love-smile">‿</span><span class="love-right-heart">♥</span><span class="love-bracket">)</span>
</div>`;
    } else if (isWink) {
        htmlCode = `<div class="kaomoji ${kaomoji.animation}">
    <span class="wink-bracket">(</span><span class="wink-eye">^</span><span class="wink-nose">_</span><span class="wink-closed">-</span><span class="wink-bracket">)</span>
</div>`;
    } else if (isCry) {
        htmlCode = `<div class="kaomoji ${kaomoji.animation}">
    <span class="cry-bracket">(</span><span class="cry-left-tear">T</span><span class="cry-nose">_</span><span class="cry-right-tear">T</span><span class="cry-bracket">)</span>
</div>`;
    } else {
        htmlCode = `<div class="kaomoji ${kaomoji.animation}">
    ${kaomoji.symbol}
</div>`;
    }
    
    return `HTML:
${htmlCode}

CSS:
${getAnimationCSS(kaomoji)}`;
}

function getAnimationCSS(kaomoji) {
    const baseCSS = `.kaomoji {
    font-family: 'Courier New', monospace;
    font-size: 3rem;
    white-space: nowrap;
    user-select: none;
}`;

    switch (kaomoji.animation) {
        case 'shrug':
            return `${baseCSS}

.kaomoji.shrug {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;
}

.shrug-left-hand,
.shrug-right-hand {
    display: inline-block;
    animation: shrugHands 1.5s ease-in-out infinite;
    transform-origin: bottom center;
}

.shrug-face {
    display: inline-block;
    animation: shrugFace 3s ease-in-out infinite;
}

.shrug-right-hand {
    animation-delay: 0.1s;
}

@keyframes shrugHands {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    30% {
        transform: translateY(-12px) rotate(3deg);
    }
    70% {
        transform: translateY(-10px) rotate(-1deg);
    }
}

@keyframes shrugFace {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}`;
        case 'bounce':
            return `${baseCSS}

.kaomoji.bounce {
    animation: bounce 1.5s ease-in-out infinite;
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}`;
        case 'wiggle':
            return `${baseCSS}

.kaomoji.wiggle {
    animation: wiggle 1s ease-in-out infinite;
}

@keyframes wiggle {
    0%, 100% {
        transform: rotate(0deg);
    }
    25% {
        transform: rotate(-3deg);
    }
    75% {
        transform: rotate(3deg);
    }
}`;
        case 'pulse':
            return `${baseCSS}

.kaomoji.pulse {
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
}`;
        case 'joy':
            return `${baseCSS}

.kaomoji.joy {
    animation: joy 1.2s ease-in-out infinite;
}

@keyframes joy {
    0%, 100% {
        transform: scale(1) rotate(0deg);
    }
    25% {
        transform: scale(1.15) rotate(-2deg);
    }
    50% {
        transform: scale(1.25) rotate(0deg);
    }
    75% {
        transform: scale(1.15) rotate(2deg);
    }
}`;
        case 'cry':
            return `${baseCSS}

.kaomoji.cry {
    animation: cry 2s ease-in-out infinite;
}

@keyframes cry {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    25% {
        transform: translateY(2px) rotate(-0.5deg);
    }
    50% {
        transform: translateY(0px) rotate(0deg);
    }
    75% {
        transform: translateY(2px) rotate(0.5deg);
    }
}`;
        case 'celebrate':
            return `${baseCSS}

.kaomoji.celebrate {
    animation: celebrate 1.5s ease-in-out infinite;
}

@keyframes celebrate {
    0%, 100% {
        transform: translateY(0px) rotate(0deg) scale(1);
    }
    25% {
        transform: translateY(-15px) rotate(-10deg) scale(1.1);
    }
    50% {
        transform: translateY(-5px) rotate(0deg) scale(1.05);
    }
    75% {
        transform: translateY(-15px) rotate(10deg) scale(1.1);
    }
}`;
        case 'tableflip':
            return `${baseCSS}

.kaomoji.tableflip {
    animation: tableflip 2s ease-in-out infinite;
}

@keyframes tableflip {
    0%, 100% {
        transform: rotate(0deg) translateX(0px);
    }
    25% {
        transform: rotate(-5deg) translateX(-5px);
    }
    50% {
        transform: rotate(15deg) translateX(10px);
    }
    75% {
        transform: rotate(-2deg) translateX(-2px);
    }
}`;
        case 'tablefix':
            return `${baseCSS}

.kaomoji.tablefix {
    animation: tablefix 3s ease-in-out infinite;
}

@keyframes tablefix {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
    }
    30% {
        transform: translateY(-5px) rotate(-1deg);
    }
    60% {
        transform: translateY(2px) rotate(1deg);
    }
    80% {
        transform: translateY(-2px) rotate(0deg);
    }
}`;
        case 'dance':
            return `${baseCSS}

.kaomoji.dance {
    animation: dance 1s ease-in-out infinite;
}

@keyframes dance {
    0%, 100% {
        transform: translateX(0px) rotate(0deg);
    }
    25% {
        transform: translateX(-8px) rotate(-5deg);
    }
    50% {
        transform: translateX(0px) rotate(0deg);
    }
    75% {
        transform: translateX(8px) rotate(5deg);
    }
}`;
        case 'hug':
            return `${baseCSS}

.kaomoji.hug {
    animation: hug 2.5s ease-in-out infinite;
}

@keyframes hug {
    0%, 100% {
        transform: scale(1) translateY(0px);
    }
    50% {
        transform: scale(1.1) translateY(-5px);
    }
}`;
        case 'love':
            return `${baseCSS}

.kaomoji.love {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;
}

.love-bracket,
.love-smile {
    display: inline-block;
    /* Static - no animation for maximum heart contrast */
}

.love-left-heart,
.love-right-heart {
    display: inline-block;
    animation: loveHearts 1.5s ease-in-out infinite;
    transform-origin: center;
}

.love-right-heart {
    /* Synchronized with left heart - no delay */
}

@keyframes loveHearts {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.5);
    }
}

/* Base elements are static for maximum heart contrast */`;
        case 'wink':
            return `${baseCSS}

.kaomoji.wink {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;
}

.wink-bracket,
.wink-nose,
.wink-closed {
    display: inline-block;
    /* Static - no animation for maximum wink contrast */
}

.wink-eye {
    display: inline-block;
    animation: winkEye 2s ease-in-out infinite;
    transform-origin: center;
}

@keyframes winkEye {
    0%, 85% {
        transform: scaleY(1);
    }
    90%, 95% {
        transform: scaleY(0.1);
    }
    100% {
        transform: scaleY(1);
    }
}`;
        case 'cry':
            return `${baseCSS}

.kaomoji.cry {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0;
}

.cry-bracket,
.cry-nose {
    display: inline-block;
    /* Static - no animation for maximum tear contrast */
}

.cry-left-tear,
.cry-right-tear {
    display: inline-block;
    animation: tearFlow 2.5s ease-in-out infinite;
    transform-origin: top center;
}

.cry-right-tear {
    animation-delay: 0.3s;
}

@keyframes tearFlow {
    0%, 100% {
        transform: translateY(0px) scaleY(1);
        opacity: 1;
    }
    50% {
        transform: translateY(3px) scaleY(1.2);
        opacity: 0.8;
    }
}`;
        case 'bear':
            return `${baseCSS}

.kaomoji.bear {
    animation: bear 1.8s ease-in-out infinite;
}

@keyframes bear {
    0%, 100% {
        transform: rotate(0deg) scale(1);
    }
    25% {
        transform: rotate(-2deg) scale(1.05);
    }
    50% {
        transform: rotate(0deg) scale(1.1);
    }
    75% {
        transform: rotate(2deg) scale(1.05);
    }
}`;
        default:
            return baseCSS;
    }
}

function downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadHtmlFile(kaomojiId) {
    const kaomoji = kaomojiInventoryInstance.kaomoji.find(k => k.id === kaomojiId);
    const htmlContent = generateStandaloneHtml(kaomoji);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    downloadFile(url, `${kaomoji.name.toLowerCase()}_kaomoji.html`);
}

function copyCodeToClipboard(kaomojiId) {
    const kaomoji = kaomojiInventoryInstance.kaomoji.find(k => k.id === kaomojiId);
    const codeContent = generateKaomojiCode(kaomoji);
    
    navigator.clipboard.writeText(codeContent).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

function closeExportModal() {
    const modal = document.getElementById('exportModal');
    modal.classList.remove('show');
}

// Close modal when clicking outside
document.getElementById('exportModal').addEventListener('click', (e) => {
    if (e.target.id === 'exportModal') {
        closeExportModal();
    }
});

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    kaomojiInventoryInstance = new KaomojiInventory();
});

// Add some fun keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'r' to reload/refresh the display
    if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        window.location.reload();
    }
    
    // Press 'Escape' to close export modal
    if (e.key === 'Escape') {
        closeExportModal();
    }
});
