# MCQ Exam Application

A complete, production-ready React + TypeScript exam application for 200 MCQ questions covering IM Units 3–6. Built with Vite, styled with Tailwind CSS, and ready to deploy on Netlify.

**Made by Yogendra (yogi)** - [GitHub Profile](https://github.com/yogendra-08)

## ✨ Features

- **200 MCQ Questions** - Complete exam with multiple-choice questions
- **Interactive UI** - Clean, modern, and responsive design
- **Real-time Feedback** - Instant feedback on correct/wrong answers
- **Progress Tracking** - Visual progress bar and score tracking
- **Keyboard Navigation** - Full keyboard accessibility (arrow keys, number keys, Enter)
- **Results Download** - Export exam results as JSON
- **Mobile Responsive** - Works seamlessly on all devices
- **Accessibility** - WCAG compliant with ARIA labels and focus management

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm installed
- Git (optional, for version control)

### Installation

```bash
# Install dependencies
npm install
```

### Converting PDF to JSON

The project includes `IM_MCQ_UNITS3,4,5,6.pdf` which contains the 200 questions. You need to convert this PDF to JSON format.

You have two options:

#### Option 1: Automatic Conversion (Try this first)

```bash
# Run the PDF conversion script
npm run convert-pdf
```

This will attempt to automatically extract questions from `IM_MCQ_UNITS3,4,5,6.pdf` and create `public/questions.json`.

**Note:** PDF parsing success depends on the PDF structure. If automatic extraction doesn't work well or extracts fewer than 200 questions, use Option 2.

#### Option 2: Manual Conversion (Recommended for accuracy)

Since the PDF `IM_MCQ_UNITS3,4,5,6.pdf` contains all 200 questions, you'll need to manually extract them:

1. Open `IM_MCQ_UNITS3,4,5,6.pdf` in a PDF reader
2. Use the sample format from `public/questions-sample.json` as a template
3. Replace the content of `public/questions.json` with all 200 questions in this format:

```json
[
  {
    "id": 1,
    "question": "Your question text here?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answerIndex": 1
  },
  {
    "id": 2,
    "question": "Next question?",
    "options": ["A", "B", "C", "D"],
    "answerIndex": 0
  }
]
```

**Important:** 
- `answerIndex` is zero-based (0 = A, 1 = B, 2 = C, 3 = D)
- Ensure all 200 questions are included
- Validate JSON syntax using a JSON validator

### Development

```bash
# Start development server
npm run dev

# Or use the alias
npm start
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
# Create production build
npm run build
```

The build output will be in the `dist/` folder.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## 📦 Project Structure

```
mcq-exam-app/
├── public/
│   ├── questions.json              # Your 200 questions (create this)
│   └── questions-sample.json       # Sample format with 3 questions
├── scripts/
│   └── pdf-to-json.js             # PDF conversion script
├── src/
│   ├── components/
│   │   ├── ModalIntro.tsx         # Welcome modal
│   │   ├── QuestionCard.tsx       # Question display component
│   │   ├── ProgressBar.tsx        # Progress indicator
│   │   ├── Result.tsx             # Results screen
│   │   └── ConfirmQuit.tsx        # Quit confirmation modal
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   ├── index.css                  # Global styles with Tailwind
│   └── vite-env.d.ts             # Vite type definitions
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── IM_MCQ_UNITS3,4,5,6.pdf      # Source PDF file
└── README.md                     # This file
```

## 🌐 Deploy to Netlify

### Method 1: Drag and Drop (Easiest)

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to [Netlify](https://app.netlify.com/)
3. Drag and drop the `dist/` folder to Netlify's deploy zone
4. Your site is live! 🎉

### Method 2: GitHub Integration (Recommended for updates)

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. Go to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Choose your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Click "Deploy site"

### Method 3: Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Environment Considerations

- No environment variables required
- All configuration is in the codebase
- Questions are loaded from `public/questions.json`
- Base path is set to `./` for compatibility with subdirectories

## 🎮 How to Use

1. **Welcome Screen** - Click "Continue" to start the exam
2. **Answer Questions** - Select an option and click "Submit Answer"
3. **Get Feedback** - See if your answer is correct immediately
4. **Navigate** - Click "Next Question" to proceed
5. **Keyboard Shortcuts:**
   - `1-4` or `Arrow Keys` - Select options
   - `Enter` - Submit answer or go to next question
6. **Quit Anytime** - Click "Quit Exam" button (top-right)
7. **View Results** - See your score, download results, or restart

## 🛠️ Technology Stack

- **Framework:** React 18
- **Language:** TypeScript (strict mode)
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **PDF Parsing:** pdf-parse (for conversion script)

## 📝 Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server |
| `start` | `npm start` | Alias for dev |
| `build` | `npm run build` | Build for production |
| `preview` | `npm run preview` | Preview production build |
| `convert-pdf` | `npm run convert-pdf` | Convert PDF to JSON |

## 🔧 Customization

### Change Number of Questions

Edit `public/questions.json` to add/remove questions. The app automatically adapts to any number of questions.

### Modify Styling

- Edit `src/index.css` for global styles
- Modify component files for component-specific styling
- Update `tailwind.config.js` for theme customization

### Change GitHub Profile

Update the GitHub URL in:
- `src/components/ModalIntro.tsx`
- `src/components/Result.tsx`

## 🐛 Troubleshooting

### Questions not loading

- Ensure `public/questions.json` exists
- Validate JSON syntax at [jsonlint.com](https://jsonlint.com/)
- Check browser console for errors

### Build fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### PDF conversion fails

- Use manual conversion method (see above)
- Ensure PDF file is named `MCQ_IM_UNIT_1,2.pdf`
- Check that pdf-parse is installed: `npm install`

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

**Yogendra (yogi)**
- GitHub: [@yogendra-08](https://github.com/yogendra-08)

---

Made with ❤️ for education
