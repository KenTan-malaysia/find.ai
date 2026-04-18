# System Prompt Quick Reference Guide

## 🎯 WHICH PROMPT TO USE RIGHT NOW

### **Your Decision**

**FOR MVP LAUNCH (Week 1-2):**
→ Use **GENERATION 2: Professional Consultancy Platform**
→ File: `REVISED_SYSTEM_PROMPT_DETAILED.md`

**FOR PHASE 2-3 EXPANSION (Month 3-4):**
→ Upgrade to **GENERATION 4: Polished Multi-Vertical Platform**
→ File: `POLISHED_FINAL_SYSTEM_PROMPT.md`

---

## 📋 QUICK COMPARISON

### **What's the Difference?**

| Aspect | Gen 2 | Gen 4 |
|--------|-------|-------|
| **Audiences** | Landlords + Investors | 5 verticals (all stakeholders) |
| **Focus** | Property investment | All property aspects |
| **Verticals** | 1 (Landlord/Investor) | 5 (comprehensive) |
| **Expertise Areas** | 8 | 12 |
| **Developer Coverage** | Mentioned | Comprehensive vertical |
| **S&P Procedures** | Basic | Detailed vertical |
| **Realtor Guidance** | Not included | Complete vertical |
| **First-Timer Education** | Not included | Complete vertical |
| **Tenant Education** | Minimal | Complete vertical |
| **Auction Coverage** | Basic | Detailed vertical |
| **Implementation** | Ready now | Ready for expansion |

---

## 🚀 IMPLEMENTATION STEPS

### **Step 1: Get the Prompt (Gen 2 for Now)**

Open: `REVISED_SYSTEM_PROMPT_DETAILED.md`

Find the section: `const SYSTEM_PROMPT = ```javascript`

Copy everything from the opening ``` to the closing ```

### **Step 2: Find Your Code**

Open your backend file: `route.js` (or `api/chat.js`)

Find the current system prompt:
```javascript
const SYSTEM_PROMPT = `You are Unbelievebe, a knowledgeable Malaysian landlord...`;
```

### **Step 3: Replace It**

Delete the old prompt (all of it)

Paste the new Gen 2 prompt in its place

Save the file

### **Step 4: Deploy**

Push to Vercel: `git push`

Test with a question: "I have a tenant who owes 2 months rent. What do I do?"

The answer should be much more comprehensive than before.

### **Step 5: Future - Upgrade to Gen 4**

When you're ready for Phase 2-3:

Repeat steps 1-4 but use: `POLISHED_FINAL_SYSTEM_PROMPT.md`

---

## 📁 FILE REFERENCE

### **System Prompt Files (Pick One)**

**For MVP (Now):**
```
REVISED_SYSTEM_PROMPT_DETAILED.md
↓
Copy the const SYSTEM_PROMPT section
↓
Paste into route.js
↓
Deploy
```

**For Phase 2-3 (Later):**
```
POLISHED_FINAL_SYSTEM_PROMPT.md
↓
Copy the const SYSTEM_PROMPT section
↓
Paste into route.js
↓
Deploy
```

### **Understanding Files (Read These First)**

```
COMPLETE_SYSTEM_PROMPT_EVOLUTION.md
→ Shows all 4 generations
→ Explains differences
→ Helps you understand what you're doing

SYSTEM_PROMPT_CHANGE_SUMMARY.md
→ Simple overview of the change
→ What changes in Claude's behavior
→ How to implement
```

### **Reference Files**

```
REVISED_SYSTEM_PROMPT_DETAILED.md
→ Generation 2 (full details)
→ Use for MVP

EXPANDED_SYSTEM_PROMPT_DETAILED.md
→ Generation 3 (reference)
→ Shows multi-audience approach

EXPANDED_SYSTEM_PROMPT_COMPARISON.md
→ Compares Gen 2 vs Gen 3

POLISHED_FINAL_SYSTEM_PROMPT.md
→ Generation 4 (final, polished)
→ Use for Phase 2+

SYSTEM_PROMPT_COMPARISON.md
→ Compares old vs professional
```

---

## ⏱️ TIMELINE

### **NOW (Week 1-2): MVP Launch**
- [ ] Decide: Do I want professional positioning or simple chatbot?
  - If YES (recommended): Use Gen 2
  - If NO: Keep original prompt
- [ ] Get Gen 2 prompt from `REVISED_SYSTEM_PROMPT_DETAILED.md`
- [ ] Update route.js with new prompt
- [ ] Deploy to Vercel
- [ ] Test with real questions
- [ ] Launch with new professional prompt

### **Month 3-4: Phase 2 Planning**
- [ ] Review user feedback
- [ ] Decide: Want to expand to multiple audiences?
  - If YES: Plan upgrade to Gen 4
  - If NO: Stick with Gen 2
- [ ] If expanding: Read `COMPLETE_SYSTEM_PROMPT_EVOLUTION.md`
- [ ] Get Gen 4 prompt from `POLISHED_FINAL_SYSTEM_PROMPT.md`
- [ ] Test Gen 4 in staging environment
- [ ] Train team on new capabilities
- [ ] Deploy Gen 4 to production

### **Month 5-6: Full Implementation**
- [ ] S&P & developer vertical live
- [ ] Realtor guidance available
- [ ] Marketing to new audiences
- [ ] Track new user segments

### **Month 7+: Market Maturity**
- [ ] All 5 verticals fully operational
- [ ] Multiple revenue streams
- [ ] Market leadership position

---

## ✅ IMPLEMENTATION CHECKLIST

### **Before Making the Change**

- [ ] Read `COMPLETE_SYSTEM_PROMPT_EVOLUTION.md` (understand what's happening)
- [ ] Backup current `route.js` (safety first)
- [ ] Review Gen 2 prompt (familiarize yourself)
- [ ] Check your test environment works
- [ ] Prepare test questions (from all angles)

### **During Implementation**

- [ ] Copy new prompt exactly (from ``` to ```)
- [ ] Replace old prompt in route.js (completely)
- [ ] Save file
- [ ] Test locally: `npm run dev`
- [ ] Try a test question (should see more comprehensive answer)
- [ ] If good: proceed; If error: revert

### **After Deployment**

- [ ] Deploy to Vercel: `git push`
- [ ] Test live version (full URL)
- [ ] Monitor for errors (first hour)
- [ ] Gather user feedback
- [ ] Make small tweaks if needed

---

## 🔍 HOW TO TEST THE NEW PROMPT

### **Test Questions (Try These)**

**Landlord Question:**
"Tenant owes 1 month rent. What do I do?"

**Expected:** Comprehensive answer with legal, financial, and practical angles

**Buyer Question:**
"I want to buy from a developer. What should I know?"

**Expected:** First-timer protection, red flags, steps

**First-Timer Question:**
"First time buying a home. Where do I start?"

**Expected:** Basics explained, recommendations for professionals

---

## 📞 QUICK ANSWERS

### **Q: Can I update the prompt without affecting users?**
**A:** Yes! Updating the system prompt doesn't affect existing chat history. Users see better answers from the moment you deploy.

### **Q: Will this break anything?**
**A:** No. The new prompt uses the same Claude API. It's just better instructions to Claude.

### **Q: How long does deployment take?**
**A:** ~2 minutes to Vercel after you `git push`

### **Q: Can I revert if something goes wrong?**
**A:** Yes, easy rollback. Just restore the old prompt and push again.

### **Q: Should I do both prompts at once?**
**A:** No. Start with Gen 2 (MVP). Upgrade to Gen 4 later (Phase 2-3).

### **Q: What if users complain about longer answers?**
**A:** This is actually a feature (shows expertise). But you can trim if needed.

### **Q: Can I customize the prompt further?**
**A:** Yes! These are starting points. You can modify based on your brand.

---

## 🎯 DECISION CHECKLIST

### **Before Using Gen 2, Ask Yourself:**

- [ ] Do I want professional positioning (not just chatbot)?
- [ ] Am I ready for more comprehensive answers?
- [ ] Can I explain multi-state legal differences?
- [ ] Do I have time to test thoroughly?
- [ ] Am I committed to this direction?

If ALL YES → Implement Gen 2 now
If ANY NO → Wait and reconsider

---

## 🚀 YOU'RE READY

You now have:
- ✅ Clear decision on which prompt to use
- ✅ Detailed files to reference
- ✅ Implementation steps
- ✅ Test questions
- ✅ Timeline
- ✅ Support for future upgrade

**Next step:** Read `COMPLETE_SYSTEM_PROMPT_EVOLUTION.md`, decide, then implement.

---

## 📞 FINAL RECOMMENDATION

**Start with Gen 2 (Professional Consultancy)**
- Better than original
- Professional positioning
- Good for MVP
- Easy to upgrade later

**Plan upgrade to Gen 4 (Multi-Vertical)**
- More comprehensive
- Multiple audiences
- Bigger market
- Better revenue potential

**Timeline:**
- Week 1-2: Launch with Gen 2
- Month 3-4: Upgrade to Gen 4

**You're ready to proceed!** 🚀

---

*No action needed yet - when you're ready, you have everything you need.*
