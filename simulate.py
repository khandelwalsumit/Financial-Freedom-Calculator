
import math

def calculate_effective_rate(rate, tax_slab, is_home_loan):
    if not is_home_loan or tax_slab == 0:
        return rate
    tax_benefit = tax_slab / 100
    # Conservative estimate from utils.ts
    return rate * (1 - tax_benefit * 0.5)

def apply_monthly_return(amount, annual_return):
    monthly_return = annual_return / 100 / 12
    return amount * (1 + monthly_return)

def format_indian_number(num):
    return f"{num:,.2f}"

def run_simulation():
    # User Inputs
    loan_principal = 4700000
    loan_interest_rate = 7.1
    loan_tenure_months = 57 # Remaining? 
    # Note: If tenure is passed to calculateEMI, it's total tenure. 
    # But code uses loanTenureMonths for calculateEMI. 
    # Here we have explicit EMI, so tenure is only used for that if EMI missing.
    
    current_emi = 97382
    loan_type = 'home'
    
    current_cash = 2000000
    current_equity = 0
    current_debt = 0
    
    equity_sip = 0
    debt_sip = 0
    cash_sip = 0
    
    monthly_income = 225000
    monthly_expenses = 50000
    
    equity_return = 12
    debt_return = 7
    cash_return = 4
    
    inflation_rate = 6
    enable_inflation = True # "Inflation Adj: Off"? User says "Inflation Adj: Off" in text!
    # Wait: "Inflation: 6% p.a. ... Inflation Adj: Off".
    # This usually means the VIEW is not inflation adjusted, but does the calculation apply inflation to expenses?
    # Code: 
    # if (baseConfig.enableInflation && month > 1) {
    #   monthlyExpenses = monthlyExpenses * ...
    # }
    # Let's assume enableInflation is FALSE based on "Inflation Adj: Off".
    # OR it means the results (Net Worth) are shown in nominal terms. 
    # Usually "Inflation Adj: Off" in UI means "Show me Nominal Values". 
    # But "Inflation: 6%" inputs usually imply expenses grow.
    # Let's try with Inflation ON for expenses first? Or OFF?
    # User text: "Inflation Adj: Off". I'll assume expenses stay flat for now.
    
    tax_slab = 30
    forecast_months = 60
    enable_switch_after_loan = True # "The Switch: On"
    
    # Status Quo Scenario Defaults
    reinvest_equity_percent = 60
    reinvest_debt_percent = 30
    reinvest_cash_percent = 10
    
    # Initialization
    loan_balance = loan_principal
    equity_balance = current_equity
    debt_balance = current_debt
    cash_balance = current_cash
    
    effective_rate = calculate_effective_rate(loan_interest_rate, tax_slab, loan_type == 'home')
    print(f"Effective Rate: {effective_rate}%")
    
    base_emi = current_emi
    curr_monthly_expenses = monthly_expenses
    
    loan_closed = False
    
    print(f"{'Month':<5} {'Loan':<15} {'Cash':<15} {'Equity':<15} {'Debt':<15} {'Net Worth':<15} {'Surplus':<15}")
    
    for month in range(1, forecast_months + 1):
        # 0. Inflation (If enabled) -> User says "Inflation Adj: Off". Assuming expenses flat.
        # If user meant "Inflation: 6%" applies to expenses, I might need to enable this.
        # But commonly "Inflation Adj" toggle refers to Real vs Nominal outputs.
        # I'll stick to flat expenses for first pass.
        
        # 1. Monthly Surplus
        monthly_surplus = monthly_income - curr_monthly_expenses
        
        # 2. Apply Returns
        equity_balance = apply_monthly_return(equity_balance, equity_return)
        debt_balance = apply_monthly_return(debt_balance, debt_return)
        cash_balance = apply_monthly_return(cash_balance, cash_return)
        
        # 3. Add SIPs (0 here)
        equity_balance += equity_sip
        debt_balance += debt_sip
        cash_balance += cash_sip
        
        # 4. Loan Payment
        actual_extra_emi = 0
        
        if not loan_closed and loan_balance > 0:
            interest = loan_balance * (effective_rate / 100 / 12)
            total_payment = base_emi + actual_extra_emi
            
            # Cap payment to balance + interest
            payment = min(total_payment, loan_balance + interest)
            principal_paid = payment - interest
            
            if loan_balance - principal_paid <= 0.1: # float tolerance
                principal_paid = loan_balance
                loan_balance = 0
                loan_closed = True
            else:
                loan_balance -= principal_paid
        
        # 5. Surplus Allocation
        if not loan_closed:
            # Net Surplus = Income - Expenses - BaseEMI - ExtraEMI(from income)
            net_surplus = monthly_surplus - base_emi - actual_extra_emi
            cash_balance += net_surplus
        elif enable_switch_after_loan:
            # Switch Logic
            freed_emi = base_emi
            
            equity_balance += freed_emi * (reinvest_equity_percent / 100.0)
            debt_balance += freed_emi * (reinvest_debt_percent / 100.0)
            cash_balance += freed_emi * (reinvest_cash_percent / 100.0)
            
            # Logic Bug (?) Reproduce:
            # Code: cashBalance += monthlySurplus;
            cash_balance += monthly_surplus
        else:
            cash_balance += monthly_surplus
            
        total_assets = equity_balance + debt_balance + cash_balance
        net_worth = total_assets - loan_balance
        
        if month % 12 == 0 or month == forecast_months:
             print(f"{month:<5} {loan_balance:<15.2f} {cash_balance:<15.2f} {equity_balance:<15.2f} {debt_balance:<15.2f} {net_worth:<15.2f} {monthly_surplus:<15.2f}")

    print(f"\nFinal Net Worth: {net_worth/100000:.2f} Lakhs")

run_simulation()
