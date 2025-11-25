/**
 * PDF to JSON Converter Script
 * Converts IM_MCQ_UNITS3,4,5,6.pdf to questions.json
 * 
 * Usage: node scripts/pdf-to-json.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow overriding the PDF file via CLI argument, defaulting to the latest units PDF
const PDF_FILE = process.argv[2] ?? 'IM_MCQ_UNITS3,4,5,6.pdf';
const PDF_PATH = path.join(__dirname, '..', PDF_FILE);
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'questions.json');

/**
 * Parse PDF text and extract questions
 * This is a basic parser - you may need to adjust based on PDF format
 */
function parseQuestions(text) {
  const questions = [];
  
  // Split by question numbers (assuming format like "1.", "2.", etc.)
  const questionBlocks = text.split(/\n\s*\d+\.\s+/).filter(block => block.trim());
  
  questionBlocks.forEach((block, index) => {
    try {
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length < 5) return; // Need at least question + 4 options
      
      const questionText = lines[0];
      const options = [];
      let answerIndex = 0;
      
      // Extract options (looking for A), B), C), D) or a), b), c), d))
      for (let i = 1; i < lines.length && options.length < 4; i++) {
        const line = lines[i];
        const optionMatch = line.match(/^[A-Da-d][\)\.]\s*(.+)/);
        
        if (optionMatch) {
          options.push(optionMatch[1].trim());
        }
      }
      
      // Try to find answer (looking for "Answer:", "Ans:", etc.)
      const answerLine = lines.find(line => 
        line.toLowerCase().includes('answer') || 
        line.toLowerCase().includes('ans:')
      );
      
      if (answerLine) {
        const answerMatch = answerLine.match(/[A-Da-d]/);
        if (answerMatch) {
          const answerLetter = answerMatch[0].toUpperCase();
          answerIndex = answerLetter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
        }
      }
      
      if (questionText && options.length === 4) {
        questions.push({
          id: questions.length + 1,
          question: questionText,
          options: options,
          answerIndex: Math.max(0, Math.min(3, answerIndex)) // Ensure valid index
        });
      }
    } catch (err) {
      console.warn(`Warning: Failed to parse question block ${index + 1}:`, err.message);
    }
  });
  
  return questions;
}

/**
 * Main conversion function
 */
async function convertPdfToJson() {
  try {
    console.log('📄 Reading PDF file...');
    
    // Check if PDF exists
    if (!fs.existsSync(PDF_PATH)) {
      throw new Error(`PDF file not found at: ${PDF_PATH}`);
    }
    
    // Read PDF
    const dataBuffer = fs.readFileSync(PDF_PATH);
    const data = await pdfParse(dataBuffer);
    
    console.log('📝 Extracting text from PDF...');
    console.log(`   Pages: ${data.numpages}`);
    console.log(`   Text length: ${data.text.length} characters`);
    
    // Parse questions
    console.log('🔍 Parsing questions...');
    const questions = parseQuestions(data.text);
    
    console.log(`✅ Found ${questions.length} questions`);
    
    if (questions.length === 0) {
      console.warn('\n⚠️  WARNING: No questions were extracted!');
      console.log('   The PDF format may not be compatible with automatic parsing.');
      console.log('   Please use manual conversion (see README.md for instructions).\n');
      return;
    }
    
    // Create public directory if it doesn't exist
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write to JSON file
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(questions, null, 2));
    
    console.log(`\n✅ Successfully created questions.json with ${questions.length} questions`);
    console.log(`   Output: ${OUTPUT_PATH}`);
    
    // Show first question as sample
    if (questions.length > 0) {
      console.log('\n📋 Sample question:');
      console.log(JSON.stringify(questions[0], null, 2));
    }
    
    if (questions.length < 200) {
      console.log(`\n⚠️  Note: Expected 200 questions but found ${questions.length}`);
      console.log('   You may need to manually review and add missing questions.');
    }
    
  } catch (error) {
    console.error('\n❌ Error converting PDF:', error.message);
    console.log('\n💡 If automatic conversion fails, please use manual conversion:');
    console.log('   1. Open the PDF file');
    console.log('   2. Copy questions to public/questions.json');
    console.log('   3. Follow the format in public/questions-sample.json');
    process.exit(1);
  }
}

// Run the conversion
convertPdfToJson();
