# Project Submission Report

## 1. Student Details

- **Full Name:** Sharon Mugure Kariuki
- **GitHub Username:** [SharonKariuki](https://github.com/SharonKariuki)
- **Email:** sharon.kariuki@strathmore.edu
- **Admission Number:** 169276
- **Class Group:** ICS 4D

---

## 2. Deployed Project Link

- **Live GitHub Pages URL:** https://is-project-2026.github.io/sokoni-storefront-169276/
- **Repository:** https://github.com/IS-PROJECT-2026/sokoni-storefront-169276

---

## 3. Reflection: Grounded in Your Git History

### A. Your Best Commit

- **Commit URL:** https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/commit/135ae2264883123b0777d34015311e1448cc8bbd

- **Why this one?** The subject is 44 characters and in the imperative. I used `refactor` because nothing the site does actually changed, so `feat` would have been wrong. The body says why I did it rather than repeating the diff: I had the delivery rule written out twice, and if the two copies drifted the total would change between the cart and the checkout. Each screen would still look right on its own, which is what makes that kind of bug hard to spot.

### B. A Mistake or Struggle

- **Link to the evidence:** https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/commit/fa0c85c443c214c08b0b3268b12f475378ed5380

- **What happened and how did you recover?** In that commit I put `FREE_DELIVERY_FROM` and `DELIVERY_FEE` into `checkout.js`, forgetting I had already written the same two constants in `cart.js` on an earlier branch. I noticed while reading my own diff before merging [PR #18](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/pull/18), and fixed it in the same pull request by moving both into `pricing.js` and having the two pages call `deliveryFor()`. I left it as two commits instead of amending, so the history shows the mistake going in and then coming out.

The worse mistake was branch protection. I set the rule up but left *"Include administrators"* off, and because I own the repository my first test push went straight to `main` anyway, printing `Bypassed rule violations for refs/heads/main`. The rule existed but did not apply to me, which is the least useful kind of protection. I removed that commit, turned on `enforce_admins`, and tested again. `main` now refuses direct pushes with `GH006`, and I saved the output in [`evidence/branch-protection-rejection.txt`](evidence/branch-protection-rejection.txt).

### C. A Pull Request You're Proud Of

- **PR URL:** https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/pull/16

- **What did you check before merging?** Instead of just adding something and watching it appear, I tried the inputs that would break it: broken JSON in `localStorage`, a saved value that is not an array, a product id that no longer exists, and negative and fractional quantities. All of them end up as an empty or corrected cart rather than an error. I also made `Store.add()` return `false` when stock caps the request, so the page can say so instead of quietly changing the number someone asked for.

### D. One Thing You Would Do Differently

- **What would you change?** Pull `main` and branch from it before starting anything, every time. Twice I made the next branch while still sitting on the previous one, so it forked off the feature branch instead of the merge commit. The pull request diffs were still correct, since git compares against the merge base, but the history looks messier than it needed to. One of those times `git checkout main` also refused to run because I had uncommitted work.

- **Link to the evidence of the original decision:** https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/pull/15

---

## 4. Screenshots of Key GitHub Features

### A. Milestones and Issues

<img width="2079" height="803" alt="image" src="https://github.com/user-attachments/assets/d6fa391f-80a3-46db-b8c5-c391329e6f1a" />


* **Caption:** Four milestones: [M1 Catalogue Foundation](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/milestone/1) with 4 issues, [M2 Cart & Checkout](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/milestone/2) with 3, [M3 Discovery, Polish & Release](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/milestone/3) with 10, and [M4 Visual identity and real product photos](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/milestone/4) with 4. Every issue was opened and put on its milestone before I made the branch for it.

### B. Project Board

<img width="1621" height="1070" alt="image" src="https://github.com/user-attachments/assets/2692388f-276d-4802-a10e-bce16df95081" />


* **Board URL:** https://github.com/orgs/IS-PROJECT-2026/projects/130

* **Caption:** [Kanban board](https://github.com/orgs/IS-PROJECT-2026/projects/130) linked to this repository. All 22 issues are on it, across **To Do**, **In Progress** and **Done**. Each one started in To Do and went through In Progress before reaching Done, so the board shows the transitions and not just the finished state. Nothing is left open.

### C. Branching Architecture

<img width="1855" height="756" alt="image" src="https://github.com/user-attachments/assets/c48abfbb-371e-4013-912f-9f8b85882c51" />


* **Caption:** Each branch is named after the issue it closes, with a prefix for the kind of change: `feat/3-product-grid`, `feat/7-checkout-flow`, `style/10-responsive-layout`, `refactor/25-trim-hero-stats`, `docs/11-readme-and-pages`. Nothing went onto `main` directly, so it only ever moves forward through merge commits.

### D. Pull Requests & Traceability

<img width="1427" height="1031" alt="image" src="https://github.com/user-attachments/assets/b876af70-d20a-4ed5-b8d4-1ad001696355" />


* **Caption:** [PR #18](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/pull/18) closing issue #7, showing the linked issue in the sidebar and the self-review notes in the description.

---

## 5. Merge Conflict Evidence

I made three conflicts, each from a different cause. Only the first is the
"two people edited the same line" case everyone pictures. The other two happen
for reasons that have nothing to do with overlapping lines.

---

### Conflict 1: Full Chronology

**What cause did you use?** Two branches editing the same line. Both rewrote the same `<h1>` in `index.html`.

#### Step 1: Generating the Clash

```console
$ git merge origin/main
Auto-merging index.html
CONFLICT (content): Merge conflict in index.html
Automatic merge failed; fix conflicts and then commit the result.
```

* **Caption:** `style/23-hero-tagline-revision` collided with `main`, which had already taken the competing rewrite from `style/23-hero-tagline` via [PR #28](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/pull/28). Git reports `CONFLICT (content)` and stops the merge.

#### Step 2: Inside the Code Editor (Conflict Markers)

![Conflict 1 markers](evidence/conflict_evidence_1.png)

* **Caption:** Git can merge two edits to the same file by itself, but not two different replacements of the same line, because there is no way to decide which order they go in. So it writes both versions into the file and leaves the choice to me. `HEAD` is my branch's wording, `origin/main` is the one already merged. Neither was better, so I kept the price claim from mine and the "tech you actually need" phrasing from main.

#### Step 3: Resolution & Clean Merge

Resolved in commit [`3e8518e`](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/commit/3e8518e6339cdf710cead75937a492139e92b9c1) and merged through [PR #29](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/pull/29). The line on `main` now reads:

```html
<h1>Honest prices on tech you actually need.</h1>
```

* **Caption:** The merge commit keeps both parents, so the history still shows the branches splitting and coming back together instead of one side overwriting the other.

---

### Conflict 2: Different Cause

**What cause did you use?** Add/add. Both branches created the same new file, `CHANGELOG.md`, without knowing about each other.

**Why does this cause trigger a conflict?** Git works out a merge by comparing both sides against their common ancestor. Here there is no ancestor, because the file did not exist at the merge base. Both sides created it from nothing, so git cannot say which one is the change and which is the original, and the whole file ends up contested instead of a single line. Git gives this its own label, `CONFLICT (add/add)`, because it is not a line-level disagreement at all.

![Conflict 2 markers](evidence/conflict_evidence_2.png)

* **Caption:** `docs/24-changelog-milestones` against `main`, which already had `CHANGELOG.md` from [PR #27](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/pull/27). The marked region covers the whole document, not one line. I combined the two by putting my milestone grouping inside the Keep a Changelog structure from main, so nothing was lost ([PR #30](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/pull/30)).

---

### Conflict 3: Different Cause

**What cause did you use?** Delete against modify. One branch deleted a block of lines that the other branch had edited.

**Why does this cause trigger a conflict?** The two sides disagree about whether the content should be there at all, and git cannot settle that on its own. `main` deleted the `.hero-stats` block, while my branch rewrote the labels inside it. An edit cannot be applied to lines that are gone on the other side, so git shows the whole block against an empty side and asks whether to keep it. Unlike the first conflict there is no rival version to pick. The question is whether it exists, not how it is worded.

![Conflict 3 markers](evidence/conflict_evidence_3.png)

* **Caption:** `style/25-hero-stats-copy` against `main`, which had already dropped the block in [PR #26](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/pull/26). `HEAD` has my relabelled figures, `origin/main` has nothing. I took the deletion. Those numbers were hard-coded and went out of date whenever stock changed, and better labels on wrong numbers are still wrong numbers ([PR #31](https://github.com/IS-PROJECT-2026/sokoni-storefront-169276/pull/31)).

---

## 6. Workflow Summary

| Requirement | Evidence |
|---|---|
| Milestones | 4: catalogue, cart and checkout, release, then the visual rework |
| Issues | 22, each put on a milestone before its branch existed, all closed |
| Feature branches | 27, all named `type/issue-number-description` |
| Pull requests | 27, all merged, each referencing the issue it closes |
| Direct commits to `main` | 0. `main` rejects direct pushes with `GH006`. The one commit that did not come through a pull request is the root commit, which GitHub created with the repository |
| Conventional commit types | 5: `feat`, `fix`, `docs`, `style`, `refactor` |
| Merge conflicts | 3, from 3 distinct causes, all resolved and merged |
| Deployment | Live on GitHub Pages from the repository root |
| Portfolio fork | [SharonKariuki/sokoni-storefront-169276](https://github.com/SharonKariuki/sokoni-storefront-169276), a real fork so the link back to the original is kept |

---

## 7. Feedback & Evaluation

- [ ] **Anonymous Evaluation Form:** [Course & Instructor Evaluation](https://forms.gle/YLybnsyXXErKEg3s9)

---

## Final Submission

> **Submission Form:** [https://forms.gle/KrT4VxtFtkU3wtYu8](https://forms.gle/KrT4VxtFtkU3wtYu8)
