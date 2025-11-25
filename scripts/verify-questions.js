/**
 * Questions Verification Script
 * Validates the questions.json file to ensure it's ready for the exam app
 * 
 * Usage: node scripts/verify-questions.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUESTIONS_PATH = path.join(__dirname, '..', 'public', 'questions.json');
const EXPECTED_COUNT = 200;

console.log('🔍 Verifying questions.json...\n');

// Check if file exists
if (!fs.existsSync(QUESTIONS_PATH)) {
  console.error('❌ ERROR: public/questions.json not found!');
  console.log('   Please create this file with questions from MCQ_IM_UNIT_1,2.pdf\n');
  process.exit(1);
}

// Read and parse JSON
let questions;
try {
  const fileContent = fs.readFileSync(QUESTIONS_PATH, 'utf8');
  questions = JSON.parse(fileContent);
} catch (error) {
  console.error('❌ ERROR: Invalid JSON format!');
  console.error(`   ${error.message}`);
  console.log('\n   Validate your JSON at: https://jsonlint.com/\n');
  process.exit(1);
}

// Verify it's an array
if (!Array.isArray(questions)) {
  console.error('❌ ERROR: questions.json must contain an array of questions!');
  process.exit(1);
}

console.log(`📊 Total questions found: ${questions.length}`);

if (questions.length !== EXPECTED_COUNT) {
  console.warn(`⚠️  WARNING: Expected ${EXPECTED_COUNT} questions, but found ${questions.length}`);
  console.log(`   You need to extract ${EXPECTED_COUNT - questions.length} more questions from the PDF\n`);
}

// Validate each question
let errors = 0;
let warnings = 0;

questions.forEach((q, index) => {
  const questionNum = index + 1;
  
  // Check required fields
  if (!q.id) {
    console.error(`❌ Question ${questionNum}: Missing 'id' field`);
    errors++;
  } else if (q.id !== questionNum) {
    console.warn(`⚠️  Question ${questionNum}: ID is ${q.id}, expected ${questionNum}`);
    warnings++;
  }
  
  if (!q.question || typeof q.question !== 'string') {
    console.error(`❌ Question ${questionNum}: Missing or invalid 'question' field`);
    errors++;
  }
  
  if (!Array.isArray(q.options)) {
    console.error(`❌ Question ${questionNum}: 'options' must be an array`);
    errors++;
  } else if (q.options.length !== 4) {
    console.error(`❌ Question ${questionNum}: Must have exactly 4 options, found ${q.options.length}`);
    errors++;
  }
  
  if (typeof q.answerIndex !== 'number') {
    console.error(`❌ Question ${questionNum}: 'answerIndex' must be a number`);
    errors++;
  } else if (q.answerIndex < 0 || q.answerIndex > 3) {
    console.error(`❌ Question ${questionNum}: 'answerIndex' must be 0, 1, 2, or 3 (found ${q.answerIndex})`);
    errors++;
  }
  
  // Check for empty options
  if (Array.isArray(q.options)) {
    q.options.forEach((opt, optIndex) => {
      if (!opt || opt.trim() === '') {
        console.warn(`⚠️  Question ${questionNum}: Option ${optIndex + 1} is empty`);
        warnings++;
      }
    });
  }
});

console.log('\n' + '='.repeat(50));

if (errors === 0 && warnings === 0 && questions.length === EXPECTED_COUNT) {
  console.log('✅ SUCCESS! All questions are valid!');
  console.log(`   ${questions.length} questions ready for the exam app\n`);
  console.log('🚀 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Test the application');
  console.log('   3. Build: npm run build');
  console.log('   4. Deploy to Netlify\n');
  process.exit(0);
} else {
  if (errors > 0) {
    console.error(`❌ Found ${errors} error(s)`);
  }
  if (warnings > 0) {
    console.warn(`⚠️  Found ${warnings} warning(s)`);
  }
  if (questions.length !== EXPECTED_COUNT) {
    console.warn(`⚠️  Question count: ${questions.length}/${EXPECTED_COUNT}`);
  }
  
  console.log('\n💡 Please fix the issues above before deploying\n');
  process.exit(errors > 0 ? 1 : 0);
}
