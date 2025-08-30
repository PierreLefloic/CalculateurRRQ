import numpy as np
import pandas as pd


# User input ################################################################
birthdate = [1996,10,14]
current_year = 2025

# age_start = 17 if birthdate[1] != 12 else 18
# ages = np.arange(age_start,73,1)
# years = np.arange(birthdate[0]+age_start+1, birthdate[0]+1+73, 1)

percentage_before = 1.14
percentage_after = 1.14
in_percent = False

retirement_age = 65
benefit_age = 67
expected_lifespan = 85
self_employed = False

inflation_rate = 2.0
salary_increase = 3.0

# Calcul des salaires
salaries = np.array([50000, 52000, 54000, 56000, 58000, 60000, 62000, 64000, 66000, 68000])

# filling MGA #######################################################################

# Read CSV with pandas to handle text and spaces in numbers
df = pd.read_csv("MGA.csv", delimiter=';', na_values=['nan'])

# Convert columns to numeric, replacing spaces and handling NaN
def clean_numeric(series):
    return pd.to_numeric(series.astype(str).str.replace(' ', '').str.replace('$', '').str.replace('%', ''), errors='coerce')

years = clean_numeric(df.iloc[:, 0]).values
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
