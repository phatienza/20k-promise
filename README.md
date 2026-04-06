# The 20K Promise

**🌐 Live site:** [the20kpromise.com](https://the20kpromise.com)

A public investment portfolio tracker. ₱20,000 invested every month, documented honestly — stocks, prices, gains, losses, and the reason behind every buy.

---

## How to update every month

The only file you ever need to edit is **`data/portfolio.json`**.

### 1. Log a new month

Add an entry to `monthlyLog`:

```json
{
  "month": "2026-04",
  "label": "April 2026",
  "deposited": 20000,
  "breakdown": {
    "BDO": 10000,
    "ALI": 10000
  },
  "notes": "Stayed consistent. Added to both positions."
}
```

### 2. Add a new stock buy

Add an entry to `holdings`:

```json
{
  "ticker": "MBT",
  "name": "Metropolitan Bank & Trust",
  "exchange": "PSE",
  "shares": 100,
  "avgCost": 58.50,
  "totalCost": 5890,
  "fees": 40,
  "dateBought": "2026-04-30",
  "reason": "Diversifying into another bank. Strong fundamentals."
}
```

### 3. Buying more of an existing stock (e.g. more BDO)

Just add another BDO entry with the new buy details. The site automatically merges all BDO entries into one card and calculates the blended average cost. Your followers can tap "Buy history" to see every individual transaction.

---

## Publishing updates

After editing `portfolio.json`, run these 3 commands:

```bash
git add .
git commit -m "April 2026 update"
git push
```

The site updates automatically in about 60 seconds. ✅

---

## Live stock prices

Prices are pulled automatically from Yahoo Finance every 15 minutes during market hours. No setup needed — it just works.

---

## Disclaimer

This site is not financial advice. It's one person's public commitment to build wealth — documented honestly, wins and losses included.
