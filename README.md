# Financial Freedom Calculator 🎯

A sophisticated **multi-scenario** financial simulation engine built with Next.js, TypeScript, and Recharts. Compare up to unlimited loan repayment strategies side-by-side and visualize your path to financial freedom.

## ✨ Key Features

### 🎛️ **Minimized Base Configuration**
All fixed parameters are collapsed into a summary bar at the top:
- Loan details (principal, rate, tenure, type)
- Current assets (cash, equity, debt)
- Monthly SIPs and cash flow
- Expected returns (CAGR %)
- Advanced settings (inflation, tax slab)

Click **"Edit"** to modify base configuration - these stay constant across all scenarios.

### 📋 **Multi-Scenario Comparison**
Create 2-4+ scenarios with different strategies:
- **Extra EMI** with source selection (from Income, Cash, Equity, or Debt)
- **Money Transfers** at Month 0 between any buckets
- **The Switch** ⭐ — Custom reinvestment split when loan closes

Each scenario is a card with:
- Editable name
- Extra EMI amount + source (Income/Cash/Equity/Debt)
- Multiple money transfers
- Post-loan reinvestment allocation
- Duplicate & Delete options

### 💸 **Extra EMI Source Selection**
New feature! Specify where extra EMI payments come from:
- **From Income** (default) - Paid from monthly surplus
- **From Cash** - Withdrawn monthly from cash balance
- **From Equity** - Liquidated monthly from equity portfolio
- **From Debt** - Withdrawn monthly from debt investments

The engine validates source balance sufficiency and warns if it runs out.

### 📊 **Side-by-Side Comparison Table**
Instantly see which scenario wins on:
- Final Net Worth 🏆
- Total Interest Paid 🏆
- Loan Closure Speed 🏆
- Final Equity Balance

### 📈 **Interactive Visualizations**
Compare first two scenarios visually:
- **Freedom Cross** — Loan vs Assets crossover
- **Wealth Gap** — Portfolio growth comparison
- **Net Worth Trajectory** — Assets - Liabilities over time
- **Asset Breakdown** — Final allocation

### ⚠️ **Smart Warnings**
- Liquidity crunch (cash < 6× expenses)
- Insufficient extra EMI source balance
- Opportunity cost (high-return to low-return moves)
- Tax shield loss (Section 24(b))
- Cash flow deficits
- Invalid reinvestment splits

### 💾 **Save & Load**
Export all scenarios as JSON for future analysis or sharing.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Usage Flow

1. **Review Base Config** — Check the minimized summary bar
2. **Edit if Needed** — Click "Edit" to modify loan, assets, SIPs, returns
3. **Configure Scenarios** — Modify the 2 default scenarios or add more
   - Set extra EMI amount & source
   - Add money transfers (Cash→Loan, Equity→Loan, etc.)
   - Configure The Switch (post-loan reinvestment split)
4. **Calculate** — Click "Compare X Scenarios"
5. **Analyze Results** — Review comparison table, warnings, and charts
6. **Add More Scenarios** — Test different strategies (up to 4+ scenarios)
7. **Save** — Export your analysis as JSON

## 🎯 Example Scenarios

| Scenario | Extra EMI | Extra EMI Source | Transfers | The Switch |
|----------|-----------|------------------|-----------|------------|
| **Status Quo** | ₹0 | — | None | 60/30/10 |
| **Aggressive** | ₹10K | From Cash | ₹2L Cash→Loan | 70/20/10 |
| **Balanced** | ₹5K | From Income | None | 60/30/10 |
| **Conservative** | ₹0 | — | ₹1L Cash→Loan | 50/40/10 |

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Dark Theme)
- **Charts:** Recharts
- **Icons:** Lucide React

## 📂 Architecture

```
app/
├── page.tsx                    # Main app with multi-scenario UI
└── methodology/page.tsx        # Documentation

components/
├── BaseConfigSummary.tsx       # Minimized config bar
├── BaseConfigModal.tsx         # Full config editor
├── ScenarioCard.tsx            # Individual scenario editor
├── MultiScenarioComparison.tsx # Comparison table
├── WarningsDisplay.tsx         # Warnings panel
└── [4 Chart Components]        # Visualizations

lib/
├── simulation-engine.ts        # Multi-scenario simulation logic
├── utils.ts                    # EMI calc, currency formatting
└── default-inputs.ts           # Default base config & scenarios

types/
└── financial.ts                # BaseConfig, ScenarioConfig, Results
```

## 🔬 How It Works

### Base Configuration (Fixed)
- Loan details, assets, SIPs, income, expenses, returns
- Shared across all scenarios

### Scenario Configuration (Variable)
- Extra EMI amount + source
- Money transfers at Month 0
- The Switch reinvestment split

### Simulation Loop (per scenario)
1. Apply money transfers
2. For each month:
   - Deduct extra EMI from source (if applicable)
   - Pay EMI (interest + principal)
   - Apply returns to all buckets
   - Add SIPs
   - Allocate surplus (cash before loan closes, reinvest after)
3. Track: loan balance, assets, net worth, loan closure month

## ⚙️ Extra EMI Logic

| Source | Behavior |
|--------|----------|
| **Income** (default) | Paid from monthly surplus (Income - Expenses - Base EMI) |
| **Cash** | Withdrawn monthly from cash balance until depleted |
| **Equity** | Liquidated monthly from equity until depleted |
| **Debt** | Withdrawn monthly from debt investments until depleted |

If source balance runs out, extra EMI stops automatically. The engine warns if source can't sustain extra EMI for at least 12 months.

## ⚠️ Disclaimer

This is a **simulation tool for educational purposes only**. Actual returns may vary. Markets are volatile. Consult a certified financial advisor before making investment or loan decisions.

## 📝 License

MIT License

---

**Built with ❤️ using Next.js, TypeScript & Recharts**
