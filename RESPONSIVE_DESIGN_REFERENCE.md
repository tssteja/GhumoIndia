# Quick Reference: Responsive Design System

## Global Container Pattern (Use Everywhere)

```tsx
<section className="py-10 sm:py-16 md:py-24 bg-white">
  <div className="max-w-7xl mx-auto px-4 md:px-6">
    {/* Your content here */}
  </div>
</section>
```

**Always use this pattern for:**
- Top-level sections
- Hero sections
- Featured content
- Directory pages
- Detail pages

---

## Responsive Breakpoints

```tailwind
sm:  640px   (landscape phones, small tablets)
md:  768px   (tablets)
lg:  1024px  (small laptops)
xl:  1280px  (desktops)
2xl: 1536px  (large desktops)
```

---

## Button Standardization

### Primary Button (CTAs, Actions)
```tsx
className="px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl 
           bg-secondary/5 hover:bg-secondary text-secondary hover:text-white 
           font-black text-xs sm:text-sm md:text-base 
           border border-secondary/10 hover:border-secondary 
           transition-all touch-manipulation"
```

### Secondary Button (Navigation)
```tsx
className="px-3 md:px-4 py-2 md:py-2.5 rounded-full 
           bg-white/10 hover:bg-white/20 text-white 
           font-semibold border border-white/20 
           transition-all touch-manipulation"
```

### Social Icon Button
```tsx
className="w-12 h-12 rounded-full flex items-center justify-center 
           text-white hover:scale-110 active:scale-95 
           shadow-sm transition-all touch-manipulation"
```

---

## Map Overlay Structure

```tsx
<div className="absolute inset-0 pointer-events-none z-20">
  {/* Top bar */}
  <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-10 
                   right-3 sm:right-auto md:w-[480px] pointer-events-auto">
    {/* Search input + Near Me button */}
  </div>

  {/* Left side */}
  <button className="absolute left-3 sm:left-4 md:left-6 top-16 sm:top-20 
                     md:top-auto md:bottom-32 pointer-events-auto">
    See List
  </button>

  {/* Bottom center */}
  <div className="absolute bottom-3 sm:bottom-4 md:bottom-8 
                  left-1/2 -translate-x-1/2 md:left-auto md:right-8 
                  md:translate-x-0 pointer-events-auto">
    Sacred Sites Counter
  </div>
</div>
```

**Key:** `pointer-events-none` on parent, `pointer-events-auto` on children

---

## Typography Hierarchy

```tsx
<h1 className="font-serif font-black text-3xl sm:text-5xl md:text-6xl tracking-tight">
  Page Title
</h1>

<h2 className="font-serif font-black text-2xl sm:text-4xl md:text-5xl tracking-tight">
  Section Title
</h2>

<h3 className="font-serif font-black text-xl sm:text-2xl md:text-3xl tracking-tight">
  Subsection Title
</h3>

<p className="font-body text-base leading-relaxed">
  Body text uses Plus Jakarta Sans
</p>
```

---

## Mobile-First Spacing

```tsx
{/* Mobile default: sm: adjusts at 640px, md: adjusts at 768px */}

{/* Padding */}
className="p-3 sm:p-4 md:p-6"     // 12px → 16px → 24px
className="px-4 sm:px-5 md:px-6"   // 16px → 20px → 24px
className="py-2 sm:py-3 md:py-4"   // 8px → 12px → 16px

{/* Margin */}
className="mb-4 sm:mb-6 md:mb-8"   // 16px → 24px → 32px
className="gap-3 sm:gap-4 md:gap-6" // 12px → 16px → 24px

{/* Font sizes */}
className="text-sm sm:text-base md:text-lg"  // 14px → 16px → 18px
className="text-2xl sm:text-3xl md:text-4xl" // 24px → 30px → 36px
```

---

## Card/Container Styling

```tsx
className="rounded-2xl md:rounded-3xl 
           shadow-md hover:shadow-lg 
           border border-primary/10 
           p-4 sm:p-6 
           h-full flex flex-col gap-3 sm:gap-4"
```

---

## Bottom Sheet Pattern (Mobile Modal)

```tsx
className="fixed bottom-0 left-0 right-0 
           w-[calc(100%-24px)] sm:w-[calc(100%-32px)] 
           max-w-md 
           md:inset-auto md:top-6 md:right-6 md:bottom-6 md:left-auto 
           z-[80] 
           max-h-[80vh] 
           rounded-t-3xl md:rounded-2xl 
           bg-white/95 backdrop-blur-3xl 
           overflow-y-auto"
```

---

## Social Icon Row

```tsx
className="flex flex-wrap items-center gap-3 sm:gap-4 
           justify-start sm:justify-end w-full"
```

**Icons inside:**
```tsx
className="w-12 h-12 rounded-full 
           flex items-center justify-center 
           text-white hover:scale-110 active:scale-95 
           transition-all shadow-sm touch-manipulation"
```

---

## Hidden/Visible Classes

```tsx
{/* Show only on mobile/tablet, hide on desktop */}
className="md:hidden"

{/* Show only on desktop, hide on mobile/tablet */}
className="hidden md:block"

{/* Show only on very wide desktop */}
className="hidden lg:block"

{/* Mobile-first: shown by default, hidden from sm up */}
className="sm:hidden"
```

---

## Z-Index Hierarchy

```
z-20   - Map overlay container (pointer-events-none)
z-[60-70] - Search dropdown
z-[80] - Sidebars, modals, near me panel
z-[90] - Mobile bottom nav
z-[100] - Navbar, main UI
z-[110] - Navbar logo/branding
z-[130] - Search suggestions
z-[160] - Search container
z-[170] - Search dropdown results
z-50   - Loading overlay
```

---

## Common Responsive Mistakes to Avoid

❌ Using `px-8` on mobile (too much padding)  
✅ Use `px-4 md:px-6` instead

❌ Using `max-w-screen-xl` (can cause overflow)  
✅ Use `max-w-7xl mx-auto px-4 md:px-6` instead

❌ Fixed width buttons in flex containers  
✅ Use `flex-1` or `w-full sm:w-auto` instead

❌ Large font sizes on mobile  
✅ Use responsive sizing: `text-sm sm:text-base md:text-lg`

❌ Hardcoded container widths  
✅ Use TailwindCSS responsive utilities

---

## Mobile-First Development Workflow

1. **Design for mobile first** (320px minimum)
2. **Add responsive classes** at breakpoints: `sm:`, `md:`, `lg:`
3. **Test at real breakpoints:**
   - 320px (iPhone SE)
   - 390px (iPhone 12)
   - 768px (iPad)
   - 1024px (iPad Pro/Desktop)
   - 1280px (Wide desktop)
4. **Check:** No overflow, no clipping, proper touch targets
5. **Verify:** All content readable without zoom

---

## Quick Component Checklist

- [ ] Uses global container pattern
- [ ] Has responsive padding (px-4 md:px-6)
- [ ] Uses responsive font sizes
- [ ] All buttons have 48px minimum height/width
- [ ] Images have proper aspect ratios
- [ ] Text uses line-clamp for overflow
- [ ] No hardcoded pixel widths
- [ ] Uses touch-manipulation class
- [ ] Tested on mobile and desktop
- [ ] No horizontal scrolling

---

## Debugging Responsive Issues

### Check container width
```tsx
// Bad
<div className="px-8 w-full">  // 32px padding on phones!

// Good
<div className="px-4 md:px-6 max-w-7xl mx-auto">
```

### Check button/icon sizing
```tsx
// Bad
<button className="w-8 h-8">  // Too small to tap

// Good
<button className="w-12 h-12 min-h-12 min-w-12">  // 48px tap target
```

### Check z-index stacking
```tsx
// Open browser DevTools → Inspect element
// Check computed z-index value
// Compare with other elements
```

### Check overflow
```tsx
// Mobile DevTools: Enable device toolbar
// Scroll horizontally: should not be possible
// All content should fit within viewport
```

---

## Useful TailwindCSS Resources

- https://tailwindcss.com/docs/responsive-design
- https://tailwindcss.com/docs/screens
- https://tailwindcss.com/docs/z-index

