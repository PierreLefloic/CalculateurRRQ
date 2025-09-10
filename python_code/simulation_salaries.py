"""
Python code for the form-management.js file

Performs calculations for the MGA.csv table based on user inputs
and calculates the salary for the salary table
"""


import numpy as np
import pandas as pd


# User input ################################################################
#############################################################################
birthdate = [2000,11,15]
current_year = 2025

percentage_before = 1.14
percentage_after = 0.5
in_percent = False

retirement_age = 71
benefit_age = 60
expected_lifespan = 95
self_employed = False

inflation_rate = 2.1
salary_increase = 3.0

# inputs = np.full(73-17, 10)
inputs = np.array([np.nan,np.nan,np.nan,np.nan,np.nan,np.nan,np.nan,np.nan,np.nan,np.nan,np.nan])



# MGA page logic #######################################################################
########################################################################################

# Read CSV with pandas to handle text and spaces in numbers
df = pd.read_csv("MGA.csv", delimiter=';', na_values=['nan'])

# Convert columns to numeric, replacing spaces and handling NaN
def clean_numeric(series):
    return pd.to_numeric(series.astype(str).str.replace(' ', '').str.replace('$', '').str.replace('%', ''), errors='coerce')

MGA_years = clean_numeric(df.iloc[:, 0]).values
MGA = clean_numeric(df.iloc[:, 1]).values
MGAM5 = clean_numeric(df.iloc[:, 2]).values
MGAM5_12 = clean_numeric(df.iloc[:, 3]).values
MSGA = clean_numeric(df.iloc[:, 4]).values
taux_base = clean_numeric(df.iloc[:, 5]).values
Exemption = clean_numeric(df.iloc[:, 6]).values
Taux_supp_V1 = clean_numeric(df.iloc[:, 7]).values
Taux_supp_V2 = clean_numeric(df.iloc[:, 8]).values
non_arrondi = clean_numeric(df.iloc[:, 9]).values
Introduction_V1 = clean_numeric(df.iloc[:, 10]).values

# Filling all the NaN values
for i in range(len(non_arrondi)):
    if np.isnan(non_arrondi[i]):
        non_arrondi[i] = non_arrondi[i-1]*(1+salary_increase/100)

for i in range(len(MGA)):
    if np.isnan(MGA[i]):
        MGA[i] = np.floor(non_arrondi[i] / 100) * 100

for i in range(len(MGAM5)):
    if np.isnan(MGAM5[i]):
        MGAM5[i] = (MGA[i-4]+MGA[i-3]+MGA[i-2]+MGA[i-1]+MGA[i]) / 5

for i in range(len(MGAM5_12)):
    if np.isnan(MGAM5_12[i]):
        MGAM5_12[i] = MGAM5[i]/12

for i in range(len(MSGA)):
    if np.isnan(MSGA[i]):
        MSGA[i] = np.floor(MGA[i]*(1+0.14)/100) * 100 # hardcoded percentage??????????

#rebind the table
mga_lookup_table = pd.Series(MGA, index=MGA_years).to_dict()


# Saisie page logic ####################################################################
########################################################################################
age_start = 17 if birthdate[1] != 12 else 18
ages = np.arange(age_start,73,1)
years = np.arange(birthdate[0]+age_start+1, birthdate[0]+1+73, 1)
percentages = np.array([percentage_before if year < current_year else percentage_after for year in years])
print(percentages)

salaries = np.array([])



# Excel formula converted to Python logic with descriptive variables
def calculate_benefit(ages, inputs, percentages, years, benefit_age, retirement_age, in_percent, birthdate, mga_lookup_table, i):
    """
    Convert Excel formula logic to Python
    """
    
    # Level 1: Check if I53 >= G$18 (some threshold check)
    # Special check for the first year (as per the excel file)
    if i == 0 and ages[i] >= benefit_age:
        return 0
    # Skip this check for the first element (i=0) since ages[i-1] would be ages[-1]
    if i > 0 and ages[i-1] >= benefit_age:
        return 0
    
    # Level 2: Check if I54 >= G$17 (another threshold check)
    if ages[i] >= retirement_age:
        return 0
    
    # Level 3: Check if K54 is empty/blank
    if inputs[i] == "" or inputs[i] is None or (isinstance(inputs[i], float) and np.isnan(inputs[i])):
        
        # Level 4a: Special case when K54 is empty AND I54 equals G$17-1
        if ages[i] == (retirement_age - 1):
            # VLOOKUP equivalent: find J54 in MGA table, get column 3 value
            vlookup_result = mga_lookup_table.get(years[i], 0)  # Default to 0 if not found
            month_from_date = birthdate[1]  # Assuming G8 is already the month number
            
            # Pro-rated calculation with month factor
            result = (percentages[i] * vlookup_result / 100 * 100 * month_from_date / 12)
            return result
        
        # Level 4b: K54 is empty but I54 is NOT G$17-1
        else:
            vlookup_result = mga_lookup_table.get(years[i], 0)
            result = percentages[i] * vlookup_result / 100 * 100
            return result
    
    # Level 5: K54 has a value, check if G$14 is TRUE
    else:
        if in_percent == True:
            # Use K54 as percentage with VLOOKUP
            vlookup_result = mga_lookup_table.get(years[i], 0)
            result = inputs[i] / 100 * vlookup_result
            return result
        else:
            # Just return K54 as-is
            return inputs[i]
        
# testing the function

for i in range(len(inputs)):
    salaries = np.append(salaries, calculate_benefit(ages, inputs, percentages, years, benefit_age, retirement_age, in_percent, birthdate, mga_lookup_table, i))

print(salaries)

# Original formula as reference:
formula = "=IF(I53>=G$18;0;IF(I54>=G$17;0;IF(K54=\"\";IF(I54=$G$17-1;(L54*VLOOKUP(J54;MGA!$A:$C;3;0)/100*100*(MONTH($G$8))/12);L54*VLOOKUP(J54;MGA!$A:$C;3;0)/100*100);IF($G$14=TRUE;K54/100*VLOOKUP(J54;MGA!$A:$C;3;0);K54))))"






