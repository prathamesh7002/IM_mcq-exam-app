import PyPDF2
import json
import re
import sys
from pathlib import Path

def extract_questions_from_pdf(pdf_path):
    """Extract MCQ questions from PDF"""
    questions = []
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            full_text = ""
            
            # Extract text from all pages
            for page in pdf_reader.pages:
                full_text += page.extract_text() + "\n"
            
            print(f"Extracted {len(full_text)} characters from PDF")
            
            # Parse questions - looking for pattern: number. question text
            # Followed by options A), B), C), D)
            # And answer indication
            
            lines = full_text.split('\n')
            i = 0
            question_id = 1
            
            while i < len(lines):
                line = lines[i].strip()
                
                # Look for question number pattern (e.g., "1.", "2.", etc.)
                question_match = re.match(r'^(\d+)\.\s*(.+)', line)
                
                if question_match:
                    question_num = question_match.group(1)
                    question_text = question_match.group(2).strip()
                    
                    # If question text is too short, it might continue on next line
                    if len(question_text) < 10 and i + 1 < len(lines):
                        i += 1
                        question_text += " " + lines[i].strip()
                    
                    # Look for options in the next few lines
                    options = []
                    answer_index = 0
                    j = i + 1
                    
                    # Extract options A), B), C), D)
                    while j < len(lines) and len(options) < 4:
                        option_line = lines[j].strip()
                        
                        # Match option patterns: A), a), A., a.
                        option_match = re.match(r'^([A-Da-d])[\)\.]\s*(.+)', option_line)
                        
                        if option_match:
                            option_letter = option_match.group(1).upper()
                            option_text = option_match.group(2).strip()
                            
                            # Check if this option continues on next line
                            if len(option_text) < 5 and j + 1 < len(lines):
                                next_line = lines[j + 1].strip()
                                if not re.match(r'^[A-Da-d][\)\.]\s*', next_line):
                                    option_text += " " + next_line
                                    j += 1
                            
                            options.append(option_text)
                        
                        j += 1
                        
                        # Stop if we've gone too far (more than 10 lines)
                        if j - i > 15:
                            break
                    
                    # Look for answer in the next few lines
                    for k in range(j, min(j + 5, len(lines))):
                        answer_line = lines[k].strip().lower()
                        
                        # Look for answer patterns
                        if 'answer' in answer_line or 'ans' in answer_line:
                            # Extract the answer letter
                            answer_match = re.search(r'[:\s]([A-Da-d])', answer_line)
                            if answer_match:
                                answer_letter = answer_match.group(1).upper()
                                answer_index = ord(answer_letter) - ord('A')
                                break
                    
                    # Only add if we have a valid question with 4 options
                    if question_text and len(options) == 4:
                        questions.append({
                            "id": question_id,
                            "question": question_text,
                            "options": options,
                            "answerIndex": max(0, min(3, answer_index))
                        })
                        question_id += 1
                        i = j
                    else:
                        i += 1
                else:
                    i += 1
            
            print(f"Successfully extracted {len(questions)} questions")
            return questions
            
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return []

def main():
    project_root = Path(__file__).resolve().parents[1]
    pdf_path = project_root / "IM_MCQ_UNITS3,4,5,6.pdf"
    output_path = project_root / "public" / "questions.json"
    
    print("Starting PDF extraction...")
    questions = extract_questions_from_pdf(str(pdf_path))
    
    if questions:
        # Write to JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Successfully created questions.json with {len(questions)} questions")
        print(f"Output: {output_path}")
        
        # Show first question as sample
        if len(questions) > 0:
            print("\n📋 Sample question:")
            print(json.dumps(questions[0], indent=2))
        
        if len(questions) < 213:
            print(f"\n⚠️  Note: Expected 213 questions but found {len(questions)}")
    else:
        print("\n❌ No questions were extracted from the PDF")
        sys.exit(1)

if __name__ == "__main__":
    main()
