# Elsewhere

> Explore the lives you could have lived.

Elsewhere is a cinematic AI experience that generates 3 alternate future versions of you based on one decision you're facing. Built for the MeDo Hackathon 2026.

## What it does

Answer 5 questions about your life and the decision you're facing. Elsewhere generates:
- 3 alternate future selves (Safe Path, Bold Path, Unexpected Path)
- A cinematic first-person diary entry per self
- Emotional meters: Fulfillment, Regret, Freedom, Connection
- A life trajectory from Year 1 to Year 20
- A closing quote from that version of you to your present self
- A shareable future card (downloadable PNG)

## Tech Stack

- MeDo — intake experience
- Claude API (Anthropic) — AI generation engine
- HTML / CSS / Vanilla JS — cinematic frontend
- Netlify — hosting

## Setup

1. Clone the repo
2. Open `scripts/generate.js`
3. Replace `YOUR_CLAUDE_API_KEY_HERE` with your actual Claude API key from console.anthropic.com
4. Open `index.html` in your browser or deploy to Netlify

## Live Demo

[elsewhere-ai.netlify.app](https://elsewhere-ai.netlify.app)

## Built by

Built in 4 days for the MeDo Hackathon 2026.
