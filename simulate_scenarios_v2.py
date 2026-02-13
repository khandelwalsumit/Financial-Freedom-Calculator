
import math

def calculate_effective_rate(rate, tax_slab, is_home_loan):
    if not is_home_loan or tax_slab == 0:
        return rate
    tax_benefit = tax_slab / 100
    return rate * (1 - tax_benefit * 0.5)

def apply_monthly_return(amount, annual_return):
    monthly_return = annual_return / 100 / 12
    return amount * (1 + monthly_return)

def format_currency(amount):
    if amount >= 10000000: return f"₹{amount/10000000:.2f}Cr"
    if amount >= 100000: return f"₹{amount/100000:.2f}L"
    return f"₹{amount:.0f}"

class Simulation:
    def __init__(self):
        # Base Config
        self.loan_principal = 4700000
        self.loan_interest_rate = 7.1
        self.current_emi = 97382
        self.loan_type = 'home'
        self.tax_slab = 30
        
        self.current_cash = 2000000
        self.current_equity = 20000000 # 2 Cr
        self.current_debt = 0
        
        self.equity_sip = 400000
        self.debt_sip = 0
        self.cash_sip = 0
        
        self.monthly_income = 625000
        self.monthly_expenses = 50000
        self.surplus = 575000
        
        self.equity_return = 12
        self.debt_return = 7
        self.cash_return = 4
        
        self.forecast_months = 60
        self.enable_switch_after_loan = True
        
        # Switch Allocation
        self.reinvest_equity_percent = 60
        self.reinvest_debt_percent = 30
        self.reinvest_cash_percent = 10

    def run_scenario(self, name, extra_emi=0, prepayment=0):
        # Initial State
        loan_balance = self.loan_principal
        cash_balance = self.current_cash
        equity_balance = self.current_equity
        debt_balance = self.current_debt
        
        # Apply Prepayment (from Cash)
        if prepayment > 0:
            if cash_balance >= prepayment:
                cash_balance -= prepayment
                loan_balance -= prepayment
            else:
                remaining = prepayment - cash_balance
                cash_balance = 0
                equity_balance -= remaining
                loan_balance -= prepayment
                
        effective_rate = calculate_effective_rate(self.loan_interest_rate, self.tax_slab, True)
        base_emi = self.current_emi
        
        total_interest_paid = 0
        loan_closure_month = 0
        loan_closed = False
        
        if loan_balance <= 0:
            loan_balance = 0
            loan_closed = True
            loan_closure_month = 0
        
        for month in range(1, self.forecast_months + 1):
            # 1. Apply Returns
            equity_balance = apply_monthly_return(equity_balance, self.equity_return)
            debt_balance = apply_monthly_return(debt_balance, self.debt_return)
            cash_balance = apply_monthly_return(cash_balance, self.cash_return)
            
            # 2. Add SIPs
            equity_balance += self.equity_sip
            debt_balance += self.debt_sip
            cash_balance += self.cash_sip
            
            # 3. Loan Payment
            actual_extra = 0
            if not loan_closed:
                if extra_emi > 0: actual_extra = extra_emi
                
                payment = base_emi + actual_extra
                interest = loan_balance * (effective_rate / 100 / 12)
                
                if payment > loan_balance + interest:
                    payment = loan_balance + interest
                
                principal = payment - interest
                if principal > loan_balance: principal = loan_balance
                
                loan_balance -= principal
                total_interest_paid += interest
                
                if loan_balance <= 0.1:
                    loan_balance = 0
                    loan_closed = True
                    loan_closure_month = month
            
            # 4. Surplus Allocation
            if not loan_closed:
                fs_net_surplus = self.surplus - base_emi - actual_extra
                cash_balance += fs_net_surplus
                
            elif self.enable_switch_after_loan:
                # Switch Logic: Freed EMI = Base + Extra (if from income)
                freed_emi = base_emi + extra_emi
                
                equity_balance += freed_emi * (self.reinvest_equity_percent / 100.0)
                debt_balance += freed_emi * (self.reinvest_debt_percent / 100.0)
                cash_balance += freed_emi * (self.reinvest_cash_percent / 100.0)
                
                cash_balance += self.surplus
            else:
                cash_balance += self.surplus
                
        net_worth = equity_balance + debt_balance + cash_balance - loan_balance
        
        return {
            "name": name,
            "net_worth": net_worth,
            "interest_paid": total_interest_paid,
            "closure_month": loan_closure_month,
            "final_equity": equity_balance,
            "final_debt": debt_balance,
            "final_cash": cash_balance
        }

sim = Simulation()
results = []
results.append(sim.run_scenario("EMI+50K", extra_emi=50000))
results.append(sim.run_scenario("pre_20L", prepayment=2000000))
results.append(sim.run_scenario("pre_10L + emi_50K", prepayment=1000000, extra_emi=50000))
results.append(sim.run_scenario("pre_10L", prepayment=1000000))
results.append(sim.run_scenario("Status Quo", extra_emi=0, prepayment=0))

output = []
output.append(f"{'Scenario':<20} {'Net Worth':<15} {'Interest':<15} {'CloseMo':<10} {'Equity':<15} {'Debt':<15} {'Cash':<15}")
output.append("-" * 105)
for r in results:
    output.append(f"{r['name']:<20} {format_currency(r['net_worth']):<15} {format_currency(r['interest_paid']):<15} {r['closure_month']:<10} {format_currency(r['final_equity']):<15} {format_currency(r['final_debt']):<15} {format_currency(r['final_cash']):<15}")

best_nw = max(r['net_worth'] for r in results)
worst_nw = min(r['net_worth'] for r in results)
diff = best_nw - worst_nw
output.append(f"\nBest vs Worst Difference: {format_currency(diff)}")

with open('simulation_output.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print('\n'.join(output))
