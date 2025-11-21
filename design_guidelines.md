# Derby Prediction Game - Design Guidelines

## Design Approach
**Reference-Based Approach** drawing from sports betting and gaming platforms (DraftKings, FanDuel, ESPN Fantasy) combined with modern form interfaces. The design should feel energetic and competitive while maintaining clarity for quick decision-making during match excitement.

## Core Design Principles
1. **Mobile-First Excellence**: Design primarily for mobile screens where users will make predictions
2. **Scan-Friendly Options**: Clear visual hierarchy allowing rapid question scanning and selection
3. **Progress Confidence**: Always show users where they are and what's left
4. **Sports Energy**: Inject competitive spirit through bold typography and decisive interactions

## Typography System
- **Primary Font**: Inter or Manrope (modern, highly legible)
- **Display Font**: Same as primary but use bold weights (700-800) for questions and headings
- **Question Text**: text-lg md:text-xl font-bold
- **Option Text**: text-base font-medium
- **Body/Helper Text**: text-sm
- **Leaderboard Rankings**: Use tabular numbers for alignment

## Layout System
**Spacing Units**: Tailwind units of 3, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: py-8 md:py-12
- Card gaps: gap-4
- Container max-width: max-w-2xl (optimal form width)

## Component Library

### Welcome Screen
- User name input with large, welcoming prompt
- Stadium/football atmosphere background image (optional subtle overlay)
- Clear "Start Predictions" CTA button

### Question Cards
- Each question in individual card with border
- Question number badge (1/12, 2/12, etc.)
- Bold question text in Turkish
- Radio buttons or button-style options for selections
- Selected state clearly distinguishable with border emphasis
- Generous touch targets (min-h-12) for mobile

### Progress Indicator
- Top-sticky bar showing completion (e.g., "8/12 Completed")
- Visual progress bar or step indicators
- Green checkmarks for completed questions

### Player ID Section
- Appears after all 12 questions answered
- Clear helper text explaining Player ID requirement
- Input field with validation feedback
- Distinct visual separation from prediction questions

### Leaderboard
- Accessible via tab/navigation after submission
- Ranked list with position numbers (1st, 2nd, 3rd with special styling)
- Player names, scores, and key predictions visible
- Current user's entry highlighted
- Sticky header with total participants count

### Buttons
- Primary CTA: Large, full-width on mobile (w-full md:w-auto)
- High contrast for sports betting context
- Clear hover/active states
- Disabled state for incomplete forms

### Form Validation
- Inline validation messages
- Required field indicators
- Success confirmation after submission
- Error states with helpful messages in Turkish

## Interaction Patterns
- Single-page scrolling form (no multi-step wizard unless requested)
- Smooth scroll to uncompleted questions on submit attempt
- Auto-save progress to localStorage (prevent data loss)
- Optimistic UI updates for leaderboard
- Loading states for Firestore operations

## Responsive Behavior
- Mobile (base): Single column, full-width cards, stacked options
- Tablet (md:): Can use 2-column grid for option buttons where appropriate
- Desktop (lg:): Centered form container, sidebar for leaderboard preview

## Images
- **Hero Background**: Stadium atmosphere or football derby crowd scene on welcome screen (subtle, not distracting)
- **No other images required** - focus on clean form interface

## Accessibility
- Semantic HTML for all form elements
- Clear focus indicators for keyboard navigation
- Proper label associations
- ARIA labels for progress indicators
- High contrast ratios throughout