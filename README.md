# The 20K Promise

**🌐 Live site:** [the20kpromise.com](https://the20kpromise.com)

A public investment portfolio tracker. ₱20,000 invested every month, documented honestly — stocks, prices, gains, losses, and the reason behind every buy.

---

## How to update every month

The only file you ever need to edit is **`data/portfolio.json`**.

### 1. Update current prices

Update the `currentPrice` field for each holding and set `lastUpdated`:

```json
"meta": {
  "lastUpdated": "2026-04-30"
},
"holdings": [
  {
    "ticker": "BDO",
    "currentPrice": 118.50
  }
]
```

Check prices at [PSE Edge](https://edge.pse.com.ph) or your broker app.

### 2. Log a new month

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

### 3. Add a new stock buy

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
  "currentPrice": 58.50,
  "reason": "Diversifying into another bank. Strong fundamentals."
}
```

### 4. Buying more of an existing stock (e.g. more BDO)

Just add another BDO entry with the new buy details. The site automatically merges all BDO entries into one card and calculates the blended average cost.

---

## Publishing updates

```bash
git add .
git commit -m "April 2026 update"
git push
```

Site updates automatically in about 60 seconds. ✅

---

## Disclaimer

This site is not financial advice. It's one person's public commitment to build wealth — documented honestly, wins and losses included.
