# 🎭 Animated Kaomoji Sticker Inventory

A beautiful web application for managing and displaying animated kaomoji (Japanese emoticon) stickers. Features smooth CSS animations and an intuitive interface for browsing and copying your favorite kaomoji.

## ✨ Features

- **Animated Stickers**: Each kaomoji has its own unique animation (shrug, bounce, wiggle, pulse)
- **Click to Copy**: Simply click any kaomoji to copy it to your clipboard
- **Export Options**: Export kaomoji as GIF, standalone HTML files, or copy CSS/HTML code
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Beautiful glass-morphism design with smooth animations
- **Extensible**: Easy to add new kaomoji to the inventory

## 🚀 Getting Started

1. Open `index.html` in your web browser
2. Browse the animated kaomoji stickers
3. Click on any kaomoji to copy it to your clipboard
4. Hover over cards to access export options (GIF, HTML, Code)
5. Use your kaomoji in messages, emails, or anywhere you want!

## 📁 Project Structure

```
my-first-repo/
├── index.html              # Main HTML file
├── styles.css              # CSS animations and styling
├── script.js               # JavaScript functionality
├── kaomoji-inventory.json  # Kaomoji data storage
└── README.md              # This file
```

## 🎨 Available Kaomoji

Currently includes:
- **¯\\_(ツ)_/¯** - Shrug (hands move up and down independently)
- **(◕‿◕)** - Happy Face (bouncing animation)
- **\\(^o^)/** - Excited (wiggling animation)
- **(♥‿♥)** - Love Eyes (synchronized hearts scale gently while face stays static)
- **(¬_¬)** - Thinking (rotating animation)
- **(^_-)** - Wink (^ eye winks while face stays static)
- **(＾▽＾)** - Joyful (scaling with rotation)
- **(T_T)** - Crying (T tears flow while face stays static)
- **ヽ(•‿•)ノ** - Celebration (arms waving up and down)
- **(╯°□°)╯︵ ┻━┻** - Table Flip (frustrated flipping motion)
- **┬─┬ ノ( ゜-゜ノ)** - Table Fix (gentle placement motion)
- **♪┏(・o･)┛♪ ┗( ･o･)┓♪** - Dancing (rhythmic side-to-side movement)
- **(づ｡◕‿‿◕｡)づ** - Hug (warm approaching motion)
- **ʕ•ᴥ•ʔ** - Bear Face (cute wiggling)

## 🔧 Adding New Kaomoji

To add new kaomoji to the inventory:

1. Edit `kaomoji-inventory.json`
2. Add a new object with the following structure:
```json
{
  "id": "unique-id",
  "symbol": "your-kaomoji-here",
  "name": "Display Name",
  "description": "Brief description",
  "animation": "shrug|bounce|wiggle|pulse|joy|cry|celebrate|tableflip|tablefix|dance|hug|bear",
  "category": "expressions|emotions|actions|animals",
  "tags": ["tag1", "tag2", "tag3"]
}
```

## 🎭 Animation Types

- **shrug**: Individual hand movements up and down with subtle rotation
- **bounce**: Vertical bouncing motion
- **wiggle**: Side-to-side rotation
- **pulse**: Scaling with opacity change
- **joy**: Scaling with rotation for extreme happiness
- **cry**: Gentle trembling motion for sadness
- **celebrate**: Arms waving with rotation and scaling
- **tableflip**: Frustrated flipping motion with rotation
- **tablefix**: Calm placement motion
- **dance**: Rhythmic side-to-side dancing movement
- **hug**: Warm approaching motion with scaling
- **bear**: Cute wiggling with rotation and scaling
- **love**: Synchronized hearts scale gently while face structure stays static
- **wink**: Eye winks (scaleY animation) while face structure stays static
- **cry**: Tears flow down (translateY with scaleY) while face structure stays static

## 📤 Export Features

Hover over any kaomoji card to reveal export options:

### **GIF Export** 🎞️
- Creates an animated GIF file of your kaomoji
- Perfect for use in messaging apps, social media, or presentations
- Downloads as `.gif` file ready to use anywhere

### **HTML Export** 📄
- Generates a standalone HTML file with embedded CSS
- Self-contained file that works in any web browser
- Perfect for embedding in websites or sharing with others

### **Code Export** 💻
- Copies the HTML and CSS code to your clipboard
- Ready to paste into your own projects
- Includes all necessary animations and styling

## 🌟 Keyboard Shortcuts

- **R**: Reload/refresh the display
- **Escape**: Close export modal

## 💡 Tips

- Hover over kaomoji for faster animations and to reveal export buttons
- The app works offline once loaded
- Copy feedback appears in the top-right corner
- All animations are CSS-based for optimal performance
- Export features let you use your animated kaomoji anywhere!

Enjoy your animated kaomoji stickers! ¯\\_(ツ)_/¯
