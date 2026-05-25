const questions = [
  {
    id: 'age',
    text: "How old are you?",
    type: "number",
    placeholder: "22"
  },
  {
    id: 'situation',
    text: "Describe your current life in one sentence.",
    type: "text",
    placeholder: "I'm a student figuring out what comes next."
  },
  {
    id: 'decision',
    text: "What decision are you struggling with right now?",
    type: "text",
    placeholder: "Whether to take a job or pursue something bigger."
  },
  {
    id: 'fear',
    text: "What is your biggest fear?",
    type: "text",
    placeholder: "Ending up somewhere that doesn't feel like mine."
  },
  {
    id: 'want',
    text: "What is one thing you deeply want?",
    type: "text",
    placeholder: "To build something that matters."
  }
];

let currentIndex = 0;
const answers = {
  age: "",
  situation: "",
  decision: "",
  fear: "",
  want: ""
};

const progressEl = document.getElementById('progress');
const questionBlock = document.getElementById('questionBlock');
const questionText = document.getElementById('questionText');
const questionInput = document.getElementById('questionInput');
const continueBtn = document.getElementById('continueBtn');
const submitBtn = document.getElementById('submitBtn');
const charCountEl = document.getElementById('charCount');

function renderQuestion() {
  const q = questions[currentIndex];
  progressEl.textContent = `${currentIndex + 1} of ${questions.length}`;
  questionText.textContent = q.text;
  questionInput.type = q.type;
  questionInput.placeholder = q.placeholder;
  questionInput.value = answers[q.id] || "";
  
  continueBtn.textContent = "Continue";

  // On the final question, swap Continue for the dedicated submit button
  if (currentIndex === questions.length - 1) {
    continueBtn.style.display = 'none';
    submitBtn.style.display = 'block';
  } else {
    continueBtn.style.display = '';
    submitBtn.style.display = 'none';
    submitBtn.style.opacity = '0';
    submitBtn.style.pointerEvents = 'none';
  }

  checkInput();
  
  // Focus input after rendering
  setTimeout(() => {
    questionInput.focus();
  }, 50);
}

function checkInput() {
  const len = questionInput.value.length;
  charCountEl.textContent = len;
  const hasInput = questionInput.value.trim().length > 0;

  if (currentIndex === questions.length - 1) {
    // Final question — fade in the dedicated submit button
    if (hasInput) {
      submitBtn.style.opacity = '1';
      submitBtn.style.pointerEvents = 'auto';
    } else {
      submitBtn.style.opacity = '0';
      submitBtn.style.pointerEvents = 'none';
    }
  } else {
    if (hasInput) {
      continueBtn.classList.add('visible');
    } else {
      continueBtn.classList.remove('visible');
    }
  }
}

let isSubmitting = false;

function nextQuestion() {
  if (isSubmitting) return;
  if (questionInput.value.trim().length === 0) return;

  // Save answer
  const q = questions[currentIndex];
  answers[q.id] = questionInput.value.trim();

  if (currentIndex === questions.length - 1) {
    // Final submit — lock button to prevent double clicks / double API calls
    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Generating…';
    submitBtn.style.opacity = '0.6';
    submitBtn.style.cursor = 'not-allowed';
    localStorage.setItem('elsewhere_input', JSON.stringify(answers));
    window.location.href = 'generating.html';
    return;
  }
  
  // Transition
  questionBlock.classList.add('fade-out');
  continueBtn.classList.remove('visible');
  
  setTimeout(() => {
    currentIndex++;
    renderQuestion();
    questionBlock.classList.remove('fade-out');
  }, 300);
}

questionInput.addEventListener('input', checkInput);

questionInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    nextQuestion();
  }
});

continueBtn.addEventListener('click', nextQuestion);
submitBtn.addEventListener('click', nextQuestion);

// Initial render
renderQuestion();
