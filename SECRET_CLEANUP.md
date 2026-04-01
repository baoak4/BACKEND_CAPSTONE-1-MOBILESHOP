# Secret Cleanup Instructions

## ⚠️ GitHub Push Protection Alert

Your repository has secrets detected in committed files that are blocking pushes.

## 🔧 Fix Options

### Option 1: Allow the Secret (Recommended for Testing)
GitHub has detected the exposed Stripe test key. You can allow it temporarily:

1. Go to: https://github.com/baoak4/BACKEND_CAPSTONE-1-MOBILESHOP/security/secret-scanning/unblock-secret/3Bl7JXHN8bOrYBTwmepnSGBKIYq

2. Click "Allow secret"

3. Now you can push

### Option 2: Rotate Keys (Best Practice)
1. Go to https://dashboard.stripe.com/apikeys
2. Create new Stripe keys (revoke old ones)
3. Update your `.env` file with new keys
4. Never commit real keys to git

### Option 3: Clean Git History (Advanced)
```bash
# Rewrite history to remove secrets
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch src/config/key.js' \
  --prune-empty --tag-name-filter cat -- --all

git push --force origin main
```

## ✅ What We've Fixed

- ✅ Removed hardcoded secrets from `src/config/key.js`
- ✅ Updated to use `process.env` variables
- ✅ Created `.env.example` template
- ✅ Added documentation to `.gitignore`

## 📋 Current Status

Files with secrets still in history:
- `STRIPE_COMPLETE_SETUP.md` (line 58)
- `STRIPE_TESTING_GUIDE.md` (line 7)
- `src/config/key.js` (commit 6771c42)

These are now in `.gitignore` so they won't be tracked going forward.

## 🚀 Next Steps

1. Allow the secret on GitHub (Option 1)
2. Or rotate your Stripe keys (Option 2)
3. Then you can push normally

Your current code is secure - it loads keys from `.env` which is already in `.gitignore`.
