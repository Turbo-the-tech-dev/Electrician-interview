#!/bin/bash
################################################################################
# AI Mock Interview — Electrician Interview Prep
# Nation of Thinkers | Turbo-the-tech-dev
################################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
RESET='\033[0m'

echo -e "\n${WHITE}${BOLD}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         ⚡ AI MOCK INTERVIEW — ELECTRICIAN PREP              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${RESET}"

# Check for Gemini CLI
if ! command -v gemini &>/dev/null; then
    echo -e "${RED}✗${RESET} Gemini CLI not found."
    echo "Install: npm install -g @google/gemini-cli"
    exit 1
fi

echo -e "${CYAN}ℹ${RESET} What level are you interviewing for?"
echo "1) Apprentice"
echo "2) Journeyman"
echo "3) Master Electrician"
echo "4) Industrial Specialist"
echo ""
read -p "Choose (1-4): " level

case "$level" in
    1) LEVEL="apprentice" ;;
    2) LEVEL="journeyman" ;;
    3) LEVEL="master electrician" ;;
    4) LEVEL="industrial electrician" ;;
    *) LEVEL="journeyman" ;;
esac

echo ""
echo -e "${CYAN}ℹ${RESET} Starting $LEVEL mock interview..."
echo -e "${CYAN}══════════════════════════════════════${RESET}"
echo ""

# Start the AI mock interview
gemini ask "Act as a commercial electrical contractor conducting a job interview for a $LEVEL position.

Rules:
1. Ask ONE question at a time
2. Wait for my response
3. After I answer, provide:
   - Feedback on technical accuracy
   - What I got right
   - What I missed
   - Ideal answer with NEC references if applicable
4. Then ask the next question
5. Cover these topics over 10 questions:
   - Safety/LOTO
   - NEC code knowledge
   - Technical theory
   - Troubleshooting
   - Behavioral/situational

Start with: 'Welcome! Tell me about your experience as an electrician.'

Be professional but friendly. This is a practice interview to help me learn."

echo ""
echo -e "${CYAN}══════════════════════════════════════${RESET}"
echo -e "${GREEN}✓${RESET} Mock interview complete!"
echo ""
echo -e "${WHITE}${BOLD}Next Steps:${RESET}"
echo "1. Review feedback from AI"
echo "2. Study weak areas"
echo "3. Run this script again to practice"
echo "4. Check INTERVIEW_GUIDE.md for more prep"
echo ""
