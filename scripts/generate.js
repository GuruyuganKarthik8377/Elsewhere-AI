// IMPORTANT: Replace YOUR_CLAUDE_API_KEY_HERE with your actual Claude API key
// Get your key at console.anthropic.com
// Never commit your real API key to GitHub
// Read from URL params first, then localStorage fallback
const params = new URLSearchParams(window.location.search);
let input;

if (params.get('age') && params.get('situation')) {
  input = {
    age: params.get('age'),
    situation: params.get('situation'),
    decision: params.get('decision'),
    fear: params.get('fear'),
    want: params.get('want')
  };
  localStorage.setItem('elsewhere_input', JSON.stringify(input));
  console.log('Input loaded from URL params:', input);
} else {
  const stored = localStorage.getItem('elsewhere_input');
  if (!stored) {
    console.log('No input found — redirecting to intake');
    window.location.href = 'index.html';
  } else {
    input = JSON.parse(stored);
    console.log('Input loaded from localStorage:', input);
  }
}

const texts = [
  "Simulating parallel identities…",
  "Tracing emotional trajectories…",
  "Exploring unrealized futures…",
  "Constructing alternate memories…"
];

const textElement = document.getElementById('loadingText');
let textIndex = 0;

function cycleText() {
  textIndex++;
  if (textIndex >= texts.length) {
    textIndex = 0; // Loop just in case
  }

  if (textElement) {
    textElement.classList.add('fade-out');

    setTimeout(() => {
      textElement.textContent = texts[textIndex];
      textElement.classList.remove('fade-out');
    }, 500); // Wait for fade out to complete before changing text
  }
}

// Start cycling text every 2.5 seconds
const cycleInterval = setInterval(cycleText, 2500);

// After 25s, show a reassuring message below the cycling text
const reassureTimeout = setTimeout(() => {
  const generatingMain = document.getElementById('gen-container') || document.querySelector('.generating-container');
  if (generatingMain && !document.getElementById('reassureText')) {
    const reassure = document.createElement('div');
    reassure.id = 'reassureText';
    reassure.textContent = "This is taking a little longer than usual. Still simulating your futures…";
    reassure.style.fontSize = '0.8rem';
    reassure.style.color = 'rgba(136,136,170,0.5)';
    reassure.style.marginTop = '24px';
    reassure.style.textAlign = 'center';
    reassure.style.maxWidth = '480px';
    reassure.style.lineHeight = '1.5';
    reassure.style.opacity = '0';
    reassure.style.transition = 'opacity 0.8s ease-in';
    generatingMain.appendChild(reassure);
    requestAnimationFrame(() => { reassure.style.opacity = '1'; });
  }
}, 25000);

function showCinematicError() {
  clearInterval(cycleInterval);
  clearTimeout(reassureTimeout);

  // Hide cycling text and reassurance
  const txt = document.getElementById('loadingText');
  if (txt) txt.style.display = 'none';
  const reassure = document.getElementById('reassureText');
  if (reassure) reassure.style.display = 'none';

  const generatingMain = document.getElementById('gen-container') || document.querySelector('.generating-container');
  if (!generatingMain) return;

  const errorBlock = document.createElement('div');
  errorBlock.id = 'errorBlock';
  errorBlock.style.display = 'flex';
  errorBlock.style.flexDirection = 'column';
  errorBlock.style.alignItems = 'center';
  errorBlock.style.gap = '24px';
  errorBlock.style.marginTop = '32px';
  errorBlock.style.opacity = '0';
  errorBlock.style.transition = 'opacity 0.8s ease-in';

  const msg = document.createElement('div');
  msg.textContent = "The simulation encountered an unexpected reality.";
  msg.style.fontSize = '1rem';
  msg.style.color = 'rgba(220,210,255,0.7)';
  msg.style.fontStyle = 'italic';
  msg.style.textAlign = 'center';
  msg.style.maxWidth = '480px';
  msg.style.lineHeight = '1.6';

  const tryBtn = document.createElement('button');
  tryBtn.textContent = 'Try again';
  tryBtn.style.background = 'transparent';
  tryBtn.style.border = '1px solid rgba(124,106,255,0.3)';
  tryBtn.style.color = 'rgba(220,210,255,0.85)';
  tryBtn.style.padding = '12px 28px';
  tryBtn.style.borderRadius = '100px';
  tryBtn.style.fontSize = '0.9rem';
  tryBtn.style.fontFamily = "'Inter', sans-serif";
  tryBtn.style.letterSpacing = '0.02em';
  tryBtn.style.cursor = 'pointer';
  tryBtn.style.transition = 'border-color 0.3s, background 0.3s';
  tryBtn.addEventListener('mouseenter', () => {
    tryBtn.style.borderColor = 'rgba(124,106,255,0.6)';
    tryBtn.style.background = 'rgba(124,106,255,0.05)';
  });
  tryBtn.addEventListener('mouseleave', () => {
    tryBtn.style.borderColor = 'rgba(124,106,255,0.3)';
    tryBtn.style.background = 'transparent';
  });
  tryBtn.addEventListener('click', () => {
    window.location.href = 'intake.html';
  });

  errorBlock.appendChild(msg);
  errorBlock.appendChild(tryBtn);
  generatingMain.appendChild(errorBlock);
  requestAnimationFrame(() => { errorBlock.style.opacity = '1'; });
}

async function generateIdentities() {
  try {
    // Input is already loaded at the top of the file (URL params or localStorage)
    if (!input) return;

    // 3. Build this exact system prompt string
    const SYSTEM_PROMPT = "You are a cinematic narrator and speculative fiction writer. Generate 3 alternate future selves for a real person based on their life inputs. Output ONLY valid JSON — no preamble, no markdown, no explanation. Exactly this structure: an array of 3 objects, each with: path (string), identity_title (string), year (string), identity_summary (string), meters (object with fulfillment/regret/freedom/connection as integers 0-100), diary_entry (string, 150-200 words, first person, specific morning, cinematic, eerily real, no generic language), closing_quote (string, one haunting memorable sentence), timeline (object with year_1/year_5/year_10/year_20 as strings). Paths are: THE SAFE PATH, THE BOLD PATH, THE UNEXPECTED PATH. Be emotionally specific to this person's exact inputs. Allow complexity — fulfillment and regret can coexist. Write like a literary author, not an AI assistant. Output ONLY raw JSON. Start your response with [ and end with ]. No markdown. No backticks. No explanation before or after the JSON. CRITICAL RULES: Never invent or use any name for the user. Never refer to the user by any name whatsoever — not a first name, not a last name, not a nickname. Refer to the user only as \"you\" or \"your\" throughout every diary entry, identity title, closing quote, and timeline entry. If you are tempted to write a name, write \"you\" instead. The user has not provided their name and does not want one assigned to them.";

    // 4. Build the user message string:
    const userMessage = `Age: ${input.age}\nCurrent life: ${input.situation}\nDecision: ${input.decision}\nFear: ${input.fear}\nWant: ${input.want}`;

    // 5. Call the Anthropic Claude API:
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_CLAUDE_API_KEY_HERE',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // 6. Parse response
    console.log("API response received");
    const data = await response.json();
    let rawText = data.content[0].text;
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const selves = JSON.parse(rawText);

    console.log("Selves parsed:", selves);

    // 7. Save to localStorage
    localStorage.setItem('elsewhere_output', JSON.stringify(selves));
    console.log("Saved to localStorage. Navigating...");

    // 8. Navigate to selves.html
    window.location.href = 'selves.html';

  } catch (error) {
    // On error: log to console AND show a cinematic error state with a "Try again" button
    console.error(error);
    showCinematicError();
  }
}

// Run the generation process on load
generateIdentities();
