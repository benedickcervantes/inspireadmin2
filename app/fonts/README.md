# Font Setup

This directory should contain the following font files for optimal display:

## Google Sans (for titles, headers, and numbers)
- GoogleSans-Regular.woff2
- GoogleSans-Medium.woff2  
- GoogleSans-Bold.woff2

## QuestTrial (for body text)
- QuestTrial-Regular.woff2
- QuestTrial-Medium.woff2
- QuestTrial-SemiBold.woff2

## Current Setup
Currently using fallback fonts:
- Google Sans → Plus Jakarta Sans (similar characteristics)
- QuestTrial → Inter (clean, readable body font)

## Font Usage
- **Google Sans**: Applied to headings (h1-h6), semibold/bold text, numbers, and UI labels
- **QuestTrial**: Applied to body text, paragraphs, and regular content

To use the actual fonts, add the font files to this directory and update the font imports in `app/layout.tsx`.