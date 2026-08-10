# Conflict 1 — full chronology

Cause: two branches edited the same line of `index.html`.

## Step 1 — the merge attempt

    $ git merge origin/main
    Auto-merging index.html
    CONFLICT (content): Merge conflict in index.html
    Automatic merge failed; fix conflicts and then commit the result.

## Step 2 — the raw conflict markers

    <<<<<<< HEAD
              <h1>Honest prices on everyday technology.</h1>
    =======
              <h1>Tech you actually need, at prices that make sense.</h1>
    >>>>>>> origin/main

Screenshot: `conflict_evidence_1.png`

## Step 3 — resolution

See `conflict_1_resolution.txt` for the merge commit and the resolved line.
