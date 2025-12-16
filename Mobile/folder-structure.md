
# Folder Structure

## Summary
- **Total Folders**: 22
- **Total Files**: 88
- **Root Directory**: visitors-book

### File Types
- **.ts**: 19
- **.js**: 5
- **.tsx**: 40
- **.png**: 11
- **.jpg**: 3
- **.css**: 1
- **.json**: 6
- **other**: 1
- **.md**: 2

## Table of Contents
- [Directory Structure](#directory-structure)

## Directory Structure

```
visitors-book/
├─ 📁 utils
│  └─ 💻 Result.utils.ts (1.5 KB)
├─ 📁 store
│  ├─ 📁 types
│  │  ├─ 💻 feedback.ts (0.7 KB)
│  │  └─ 💻 guest.type.ts (0.2 KB)
│  ├─ 📁 slices
│  │  ├─ 💻 auth.slice.ts (1.2 KB)
│  │  ├─ 💻 canvas.slice.ts (1.2 KB)
│  │  ├─ 💻 guest.slice.ts (3.6 KB)
│  │  └─ 💻 records.slice.ts (3.8 KB)
│  ├─ 💻 hooks.ts (0.3 KB)
│  └─ 💻 store.ts (0.6 KB)
├─ 📁 services
│  ├─ 💻 feedback.service.ts (3.1 KB)
│  └─ 💻 guest.service.ts (1.1 KB)
├─ 📁 scripts
│  └─ 💻 reset-project.js (3.5 KB)
├─ 📁 hooks
│  ├─ 💻 use-color-scheme.ts (0.0 KB)
│  ├─ 💻 use-color-scheme.web.ts (0.5 KB)
│  └─ 💻 use-theme-color.ts (0.5 KB)
├─ 📁 data
│  └─ 💻 Canvas.ts (0.2 KB)
├─ 📁 constants
│  ├─ 💻 constant.ts (0.3 KB)
│  └─ 💻 theme.ts (1.6 KB)
├─ 📁 components
│  ├─ 📁 ui
│  │  ├─ 📄 background.tsx (0.6 KB)
│  │  ├─ 📄 button.tsx (0.7 KB)
│  │  ├─ 📄 collapsible.tsx (1.3 KB)
│  │  ├─ 📄 DrawingCanavs.tsx (8.8 KB)
│  │  ├─ 📄 icon-symbol.ios.tsx (0.6 KB)
│  │  └─ 📄 icon-symbol.tsx (1.4 KB)
│  ├─ 📄 Background.tsx (2.7 KB)
│  ├─ 📄 Buttons.tsx (0.3 KB)
│  ├─ 📄 colorPalette.tsx (1.4 KB)
│  ├─ 📄 CreateGuestButton.tsx (0.9 KB)
│  ├─ 📄 external-link.tsx (0.8 KB)
│  ├─ 📄 guestCard.tsx (1.1 KB)
│  ├─ 📄 haptic-tab.tsx (0.6 KB)
│  ├─ 📄 hello-wave.tsx (0.4 KB)
│  ├─ 📄 parallax-scroll-view.tsx (1.9 KB)
│  ├─ 📄 RecordDetailModal.tsx (7.6 KB)
│  ├─ 📄 SelectGuestCard.tsx (1.5 KB)
│  ├─ 📄 SelectMode.tsx (1.7 KB)
│  ├─ 📄 SelectTool.tsx (3.1 KB)
│  ├─ 📄 SignatureCanvas.tsx (4.4 KB)
│  ├─ 📄 TableHeader.tsx (1.3 KB)
│  ├─ 📄 themed-text.tsx (1.3 KB)
│  └─ 📄 themed-view.tsx (0.5 KB)
├─ 📁 assets
│  ├─ 📁 images
│  │  ├─ 🖼️ android-icon-background.png (275.7 KB)
│  │  ├─ 🖼️ android-icon-foreground.png (275.7 KB)
│  │  ├─ 🖼️ android-icon-monochrome.png (275.7 KB)
│  │  ├─ 🖼️ background.jpg (142.3 KB)
│  │  ├─ 🖼️ bg.jpg (190.0 KB)
│  │  ├─ 🖼️ bg2.jpg (425.2 KB)
│  │  ├─ 🖼️ favicon.png (275.7 KB)
│  │  ├─ 🖼️ icon.png (275.7 KB)
│  │  ├─ 🖼️ partial-react-logo.png (5.0 KB)
│  │  ├─ 🖼️ react-logo.png (6.2 KB)
│  │  ├─ 🖼️ react-logo@2x.png (13.9 KB)
│  │  ├─ 🖼️ react-logo@3x.png (20.8 KB)
│  │  └─ 🖼️ splash-icon.png (17.1 KB)
│  └─ 📁 background-pattern
│     ├─ 📄 Whitebg.tsx (1.9 KB)
│     └─ 🖼️ Whitegrid.png (8.4 KB)
├─ 📁 app
│  ├─ 📁 (tabs)
│  │  ├─ 📄 index.tsx (0.6 KB)
│  │  ├─ 📄 landingPage.tsx (4.4 KB)
│  │  ├─ 📄 loginPage.tsx (3.3 KB)
│  │  └─ 📄 _layout.tsx (0.9 KB)
│  ├─ 📁 (records_
│  ├─ 📁 (guest)
│  │  ├─ 📄 selectGuest.tsx (2.1 KB)
│  │  └─ 📄 _layout.tsx (0.8 KB)
│  ├─ 📁 (canvas)
│  │  ├─ 📄 Canvas.tsx (5.3 KB)
│  │  └─ 📄 _layout.tsx (1.0 KB)
│  ├─ 📁 (admin)
│  │  ├─ 📄 CreateGuest.tsx (5.6 KB)
│  │  ├─ 📄 Options.tsx (1.1 KB)
│  │  ├─ 📄 records.tsx (9.9 KB)
│  │  ├─ 📄 Setting.tsx (11.8 KB)
│  │  └─ 📄 _layout.tsx (0.6 KB)
│  ├─ 📄 global.css (0.1 KB)
│  ├─ 📄 modal.tsx (0.7 KB)
│  ├─ 📄 RootStack.tsx (1.0 KB)
│  └─ 📄 _layout.tsx (0.6 KB)
├─ 📁 .vscode
│  ├─ 📁 .react
│  ├─ 📊 extensions.json (0.0 KB)
│  └─ 📊 settings.json (0.1 KB)
├─ 📄 .gitignore (0.4 KB)
├─ 📊 app.json (1.3 KB)
├─ 💻 babel.config.js (0.3 KB)
├─ 💻 eslint.config.js (0.2 KB)
├─ 💻 expo-env.d.ts (0.1 KB)
├─ 📜 folder-structure.md (284.8 KB)
├─ 💻 metro.config.js (0.2 KB)
├─ 💻 nativewind-env.d.ts (0.0 KB)
├─ 📊 package-lock.json (531.6 KB)
├─ 📊 package.json (1.9 KB)
├─ 📜 README.md (1.7 KB)
├─ 💻 tailwind.config.js (0.3 KB)
└─ 📊 tsconfig.json (0.3 KB)

```
