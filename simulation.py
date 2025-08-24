import numpy as np


# User input ################################################################
birthdate = [1996,10,14]
age_start = 17 if birthdate[1] != 12 else 18
ages = np.arange(age_start,73,1)
years = np.arange(birthdate[0]+age_start+1, birthdate[0]+1+73, 1)
pourcentage = 1.14

# MGA #######################################################################
mga_years = np.arange(1966,2101,1)
unrounded_mga = ()