import numpy as np
import csv
import os

def get_user_input():
    """
    To be replaced with actual user input mechanism.
    """
    user_mga = {
        1966: 5000,
        1967: 5000,
        1968: 5100,
        1969: 5200,
        1970: 5300,
        1971: 5400,
        1972: 5500,
        1973: 5900,
        1974: 6600,
        1975: 7400,
        1976: 8300,
        1977: 9300,
        1978: 10400,
        1979: 11700,
        1980: 13100,
        1981: 14700,
        1982: 16500,
        1983: 18500,
        1984: 20800,
        1985: 23400,
        1986: 25800,
        1987: 25900,
        1988: 26500,
        1989: 27700,
        1990: 28900,
        1991: 30500,
        1992: 32200,
        1993: 33400,
        1994: 34400,
        1995: 34900,
        1996: 35400,
        1997: 35800,
        1998: 36900,
        1999: 37400,
        2000: 37600,
        2001: 38300,
        2002: 39100,
        2003: 39900,
        2004: 40500,
        2005: 41100,
        2006: 42100,
        2007: 43700,
        2008: 44900,
        2009: 46300,
        2010: 47200,
        2011: 48300,
        2012: 50100,
        2013: 51100,
        2014: 52500,
        2015: 53600,
        2016: 54900,
        2017: 55300,
        2018: 55900,
        2019: 57400,
        2020: 58700,
        2021: 61600,
        2022: 64900,
        2023: 66600,
        2024: 68500,
        2025: 71300,
        2026: 73400,
        2027: 75600,
        2028: 77900,
        2029: 80200,
        2030: 82700,
        2031: 85100,
        2032: 87700,
        2033: 90300,
        2034: 93000,
        2035: 95800,
        2036: 98700,
        2037: 101700,
        2038: 104700,
        2039: 107900,
        2040: 111100,
        2041: 114400,
        2042: 117900,
        2043: 121400,
        2044: 125100,
        2045: 128800,
        2046: 132700,
        2047: 136700,
        2048: 140800,
        2049: 145000,
        2050: 149300,
        2051: 153800,
        2052: 158400,
        2053: 163200,
        2054: 168100,
        2055: 173100,
        2056: 178300,
        2057: 183700,
        2058: 189200,
        2059: 194900,
        2060: 200700,
        2061: 206700,
        2062: 212900,
        2063: 219300,
        2064: 225900,
        2065: 232700,
        2066: 239700,
        2067: 246800,
        2068: 254300,
        2069: 261900,
        2070: 269700,
        2071: 277800,
        2072: 286200,
        2073: 294800,
        2074: 303600,
        2075: 312700,
        2076: 322100,
        2077: 331800,
        2078: 341700,
        2079: 352000,
        2080: 362500,
        2081: 373400,
        2082: 384600,
        2083: 396100,
        2084: 408000,
        2085: 420300,
        2086: 432900,
        2087: 445900,
        2088: 459300,
        2089: 473000,
        2090: 487200,
        2091: 501800,
        2092: 516900,
        2093: 532400,
        2094: 548400,
        2095: 564800,
        2096: 581800,
        2097: 599200,
        2098: 617200,
        2099: 635700,
        2100: 654800
    }
    user_salary = [
        3690,
        22440,
        22560,
        22980,
        23460,
        23940,
        24300,
        24660,
        25260,
        26220,
        26940,
        27780,
        28320,
        28980,
        75150,
        76650,
        78750,
        80400,
        82350,
        82950,
        83850,
        86100,
        88050,
        92400,
        97350,
        99900,
        102750,
        106950,
        110100,
        113400,
        116850,
        120300,
        124050,
        127650,
        131550,
        135450,
        139500,
        143700,
        148050,
        152550,
        157050,
        161850,
        166650,
        171600,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ]
    user_birth_month = 10
    user_intro_v1 = {
        1966: 0, 1967: 0, 1968: 0, 1969: 0, 1970: 0, 1971: 0, 1972: 0, 1973: 0, 1974: 0, 1975: 0,
        1976: 0, 1977: 0, 1978: 0, 1979: 0, 1980: 0, 1981: 0, 1982: 0, 1983: 0, 1984: 0, 1985: 0,
        1986: 0, 1987: 0, 1988: 0, 1989: 0, 1990: 0, 1991: 0, 1992: 0, 1993: 0, 1994: 0, 1995: 0,
        1996: 0, 1997: 0, 1998: 0, 1999: 0, 2000: 0, 2001: 0, 2002: 0, 2003: 0, 2004: 0, 2005: 0,
        2006: 0, 2007: 0, 2008: 0, 2009: 0, 2010: 0, 2011: 0, 2012: 0, 2013: 0, 2014: 0, 2015: 0,
        2016: 0, 2017: 0, 2018: 0,
        2019: 0.15,
        2020: 0.30,
        2021: 0.50,
        2022: 0.75,
        2023: 1.00,
        2024: 1, 2025: 1, 2026: 1, 2027: 1, 2028: 1, 2029: 1, 2030: 1, 2031: 1, 2032: 1, 2033: 1,
        2034: 1, 2035: 1, 2036: 1, 2037: 1, 2038: 1, 2039: 1, 2040: 1, 2041: 1, 2042: 1, 2043: 1,
        2044: 1, 2045: 1, 2046: 1, 2047: 1, 2048: 1, 2049: 1, 2050: 1, 2051: 1, 2052: 1, 2053: 1,
        2054: 1, 2055: 1, 2056: 1, 2057: 1, 2058: 1, 2059: 1, 2060: 1, 2061: 1, 2062: 1, 2063: 1,
        2064: 1, 2065: 1, 2066: 1, 2067: 1, 2068: 1, 2069: 1, 2070: 1, 2071: 1, 2072: 1, 2073: 1,
        2074: 1, 2075: 1, 2076: 1, 2077: 1, 2078: 1, 2079: 1, 2080: 1, 2081: 1, 2082: 1, 2083: 1,
        2084: 1, 2085: 1, 2086: 1, 2087: 1, 2088: 1, 2089: 1, 2090: 1, 2091: 1, 2092: 1, 2093: 1,
        2094: 1, 2095: 1, 2096: 1, 2097: 1, 2098: 1, 2099: 1, 2100: 1
    }
    user_msga = {
        1966: 0, 1967: 0, 1968: 0, 1969: 0, 1970: 0, 1971: 0, 1972: 0, 1973: 0, 1974: 0, 1975: 0,
        1976: 0, 1977: 0, 1978: 0, 1979: 0, 1980: 0, 1981: 0, 1982: 0, 1983: 0, 1984: 0, 1985: 0,
        1986: 0, 1987: 0, 1988: 0, 1989: 0, 1990: 0, 1991: 0, 1992: 0, 1993: 0, 1994: 0, 1995: 0,
        1996: 0, 1997: 0, 1998: 0, 1999: 0, 2000: 0, 2001: 0, 2002: 0, 2003: 0, 2004: 0, 2005: 0,
        2006: 0, 2007: 0, 2008: 0, 2009: 0, 2010: 0, 2011: 0, 2012: 0, 2013: 0, 2014: 0, 2015: 0,
        2016: 0, 2017: 0, 2018: 0, 2019: 0, 2020: 0, 2021: 0, 2022: 0, 2023: 0,
        2024: 73200, 2025: 81200, 2026: 83600, 2027: 86100, 2028: 88800, 2029: 91400, 2030: 94200, 2031: 97000, 2032: 99900, 2033: 102900,
        2034: 106000, 2035: 109200, 2036: 112500, 2037: 115900, 2038: 119300, 2039: 123000, 2040: 126600, 2041: 130400, 2042: 134400, 2043: 138300,
        2044: 142600, 2045: 146800, 2046: 151200, 2047: 155800, 2048: 160500, 2049: 165300, 2050: 170200, 2051: 175300, 2052: 180500, 2053: 186000,
        2054: 191600, 2055: 197300, 2056: 203200, 2057: 209400, 2058: 215600, 2059: 222100, 2060: 228700, 2061: 235600, 2062: 242700, 2063: 250000,
        2064: 257500, 2065: 265200, 2066: 273200, 2067: 281300, 2068: 289900, 2069: 298500, 2070: 307400, 2071: 316600, 2072: 326200, 2073: 336000,
        2074: 346100, 2075: 356400, 2076: 367100, 2077: 378200, 2078: 389500, 2079: 401200, 2080: 413200, 2081: 425600, 2082: 438400, 2083: 451500,
        2084: 465100, 2085: 479100, 2086: 493500, 2087: 508300, 2088: 523600, 2089: 539200, 2090: 555400, 2091: 572000, 2092: 589200, 2093: 606900,
        2094: 625100, 2095: 643800, 2096: 663200, 2097: 683000, 2098: 703600, 2099: 724600, 2100: 746400
    }
    user_birth_date = [1980, 10, 10]  # YYYY, MM, DD
    user_ret_age = 65  # Example retirement age
    user_annee_courante = 2025  # Current year
    user_mgam5_12 = {
        1966: 0, 1967: 0, 1968: 0, 1969: 0, 1970: 0, 1971: 0, 1972: 0, 1973: 0, 1974: 0, 1975: 0,
        1976: 0, 1977: 0, 1978: 0, 1979: 0, 1980: 0, 1981: 0, 1982: 0, 1983: 0, 1984: 0, 1985: 0,
        1986: 0, 1987: 0, 1988: 0, 1989: 0, 1990: 0, 1991: 0, 1992: 0, 1993: 0, 1994: 0, 1995: 0,
        1996: 0, 1997: 0, 1998: 0, 1999: 0, 2000: 0, 2001: 0, 2002: 0, 2003: 0, 2004: 0, 2005: 0,
        2006: 0, 2007: 0, 2008: 0, 2009: 0, 2010: 0, 2011: 0, 2012: 0, 2013: 0,
        2014: 4153, 2015: 4260, 2016: 4370, 2017: 4457, 2018: 4537, 2019: 4618, 2020: 4703, 2021: 4815, 2022: 4975, 2023: 5153,
        2024: 5338, 2025: 5548, 2026: 5745, 2027: 5923, 2028: 6112, 2029: 6307, 2030: 6497, 2031: 6692, 2032: 6893, 2033: 7100,
        2034: 7313, 2035: 7532, 2036: 7758, 2037: 7992, 2038: 8232, 2039: 8480, 2040: 8735, 2041: 8997, 2042: 9267, 2043: 9545,
        2044: 9832, 2045: 10126.666667, 2046: 10432, 2047: 10745, 2048: 11068, 2049: 11400, 2050: 11742, 2051: 12093, 2052: 12455, 2053: 12828,
        2054: 13213, 2055: 13610, 2056: 14018, 2057: 14440, 2058: 14873, 2059: 15320, 2060: 15780, 2061: 16253, 2062: 16740, 2063: 17242,
        2064: 17758, 2065: 18292, 2066: 18842, 2067: 19407, 2068: 19990, 2069: 20590, 2070: 21207, 2071: 21842, 2072: 22498, 2073: 23173,
        2074: 23868, 2075: 24585, 2076: 25323, 2077: 26083, 2078: 26865, 2079: 27672, 2080: 28502, 2081: 29357, 2082: 30237, 2083: 31143,
        2084: 32077, 2085: 33040, 2086: 34032, 2087: 35053, 2088: 36107, 2089: 37190, 2090: 38305, 2091: 39453, 2092: 40637, 2093: 41855,
        2094: 43112, 2095: 44405, 2096: 45738, 2097: 47110, 2098: 48523, 2099: 49978, 2100: 51478
    }
    user_benefit_age = 60  # Example benefit age

    return user_mga, user_salary, user_birth_month, user_intro_v1, user_msga, user_birth_date, user_ret_age, user_mgam5_12, user_annee_courante

def calculate_pension_benefits(F1, D2, Protection = False):
    """
    Calculate pension benefits following the proper dependency order.
    
    Parameters:
    F1: Retirement year input
    D2: Career duration input  
    Protection: Boolean to run calculation for the 65 years protection (used by the function itself)

    Returns:
    M64: Final calculated pension benefit
    """
    
    # Initialize arrays (55 years from age 17 to 71)
    annee = np.zeros(55) # col. B
    age = np.zeros(55) # col. C
    salaire_base = np.zeros(55) # col. D
    mga = np.zeros(55) # col. E
    mois = np.zeros(55) # col. F
    rajustes_1 = np.zeros(55) # col. G
    rajustes_2 = np.zeros(55) # col. H
    out = np.zeros(55) # col. I
    retranches = np.zeros(55) # col. J
    moy_5 = np.full(55, np.nan) # col. K (filled with NaN initially)
    volet_1 = np.zeros(55) # col. L
    volet_2 = np.zeros(55) # col. M
    testing_rang = np.zeros(55) # col. N
    rang = np.zeros(55) # col. O
    col_p = np.zeros(55) # col. P
    col_q = np.zeros(55) # col. Q
    col_r = np.zeros(55) # col. R
    col_s = np.zeros(55) # col. S
    v1 = np.zeros(55) # col. T
    col_u = np.zeros(55) # col. U
    sal = np.zeros(55) # col. V
    rg = np.zeros(55) # col. W
    salaire = np.zeros(55) # col. X
    col_y = np.zeros(55) # col. Y
    col_z = np.zeros(55) # col. Z
    col_aa = np.zeros(55) # col. AA

    # Get user inputs
    user_mga, user_salary, user_birth_month, user_intro_v1, user_msga, user_birth_date, user_ret_age, user_mgam5_12, user_annee_courante = get_user_input()

    # 65 years protection adjustment
    if Protection:
        # Handle month rollover: if birth month is December (12), next month is January (1) of next year
        if user_birth_month == 12:
            F1 = [user_birth_date[0]+65+1, 1, 1]  # Add 1 to year, set month to 1
        else:
            F1 = [user_birth_date[0]+65, user_birth_month+1, 1]

        print(f"65 years protection applied. New retirement date: {F1[0]}-{F1[1]:02d}-{F1[2]:02d}")
    
    # PHASE 1: Initialize variables
    G1 = F1[0]

    if user_birth_date[2] == 1:
        F2 = np.round(np.round((F1[0]-user_birth_date[0])*12)/12)

    else:
        F2 = np.round((F1[0]-user_birth_date[0])*12)/12

    # PHASE 2: First pass - basic arrays needed for moy_5
    for i in range(55):
        # annee
        annee[i] = user_birth_date[0]+18 + i
        
        # age
        age[i] = 17 + i
        
        # mga
        if annee[i] > G1:
            mga[i] = 0
        else:
            mga[i] = user_mga[annee[i]]
        
        # moy_5 (depends on mga)
        if i < 4:
            moy_5[i] = np.nan
        else:
            moy_5[i] = (mga[i-4]+mga[i-3]+mga[i-2]+mga[i-1]+mga[i]) / 5

    # PHASE 3: Calculate global variables from moy_5
    K2 = np.nanmax(moy_5)  # Use nanmax to ignore NaN values
    H2 = K2/12
    
    # PHASE 4: Second pass - basic arrays now that H2 is available
    for i in range(55):
        # salaire (assuming this should be user_salary)
        salaire[i] = user_salary[i]
        
        # mois
        if i == 0:
            if user_birth_month < 12:
                mois[i] = 12 - user_birth_month
            else:
                mois[i] = 12
        else:
            if annee[i] > G1:
                mois[i] = 0
            elif annee[i] == G1:
                # mois[i] = F1[1] - user_birth_month # à vérifier dans mes notes pourquoi j'avais ça
                mois[i] = F1[1]-1
            else:
                mois[i] = 12
        
        # col_y
        col_y[i] = np.max([0, np.min([salaire[i]-mga[i], user_msga.get(int(annee[i]), 0)-mga[i]])])
    
    # PHASE 5: Calculate variables from basic arrays
    F59 = np.sum(mois)
    O2 = 0.15 * F59 / 12
    I2 = O2 * 12
    Q3 = np.ceil(I2)
    
    # PHASE 6: Third pass - arrays needing H2
    for i in range(55):
        # salaire_base
        if i+1 <= D2:
            salaire_base[i] = np.min([user_salary[i], mga[i]])
        else:
            salaire_base[i] = 0
        
        # rajustes_2
        if annee[i] <= G1:
            if mois[i] > 0:
                x = (salaire_base[i] * 12 / mois[i]) * H2 / mga[i] if mga[i] > 0 else 0
            else:
                x = 0
        else:
            x = 0
        
        rajustes_2[i] = np.min([H2, x])
        
        # rajustes_1
        if mois[i] > 0:
            rajustes_1[i] = rajustes_2[i] * mois[i]
        else:
            rajustes_1[i] = 0
        
        # testing_rang
        testing_rang[i] = rajustes_2[i] + (annee[i]/100000) + (mois[i]/100)

        if annee[i] > G1: # added condition to match excel logic
            testing_rang[i] = 0

        # if annee[i] >= user_ret_age+user_birth_date[0]+1: # added condition to match excel logic
        #     testing_rang[i] = 0

        # col_p
        if mois[i] == 0:
            col_p[i] = 1000000 + testing_rang[i]
        else:
            col_p[i] = testing_rang[i]
    
    # PHASE 7: Calculate rankings (need complete col_p array)
    rang_croissant = np.argsort(np.argsort(col_p)) + 1
    for i in range(55):
        rang[i] = rang_croissant[i]
    
    # PHASE 8: Calculate intermediate variables
    # First calculate Q59 to get R3
    Q59 = 0  # Will be calculated in phase 9
    temp_col_q = np.zeros(55)
    for i in range(55):
        if rang[i] <= int(O2):
            temp_col_q[i] = mois[i]
        else:
            temp_col_q[i] = 0
    Q59 = np.sum(temp_col_q)
    
    R3 = Q3 - Q59
    
    # Calculate R59 to get S3
    R59 = 0
    temp_col_r = np.zeros(55)
    for i in range(55):
        if rang[i] == int(O2+1):
            temp_col_r[i] = np.min([mois[i], R3])
        else:
            temp_col_r[i] = 0
    R59 = np.sum(temp_col_r)
    
    S3 = R3 - R59
    
    # PHASE 9: Fourth pass - arrays depending on rankings
    for i in range(55):
        # col_q
        if rang[i] <= int(O2):
            col_q[i] = mois[i]
        else:
            col_q[i] = 0
        
        # col_r
        if rang[i] == int(O2+1):
            col_r[i] = np.min([mois[i], R3])
        else:
            col_r[i] = 0
        
        # col_s
        if rang[i] == int(O2+2):
            col_s[i] = np.min([mois[i], S3])
        else:
            col_s[i] = 0
        
        # out
        out[i] = col_q[i] + col_r[i] + col_s[i]
        
        # retranches
        retranches[i] = out[i] * rajustes_2[i]
    
    # PHASE 10: Fifth pass - remaining calculations
    for i in range(55):
        # v1
        v1[i] = user_intro_v1[annee[i]]
        
        # col_u
        col_u[i] = np.sum(v1[:i+1])  # Cumulative sum up to current index
        
        # sal
        if annee[i] >= 2019:
            sal[i] = testing_rang[i] * v1[i]
        else:
            sal[i] = (annee[i]/10000)*v1[i]
    
    # PHASE 11: Calculate sal rankings (need complete sal array)
    rg_croissant = np.argsort(np.argsort(sal)) + 1
    for i in range(55):
        rg[i] = rg_croissant[i]
    
    # PHASE 12: Sixth pass - final calculations
    for i in range(55):
        # volet_1
        if rg[i] > np.max(rg)-40:
            x = 1
        else:
            x = 0
        
        if annee[i] < 2019:
            volet_1[i] = np.nan
        else:
            volet_1[i] = v1[i] * rajustes_1[i] * x
        
        # col_z
        if salaire_base[i] >= mga[i]:
            x = col_y[i] * mois[i]/12
        else:
            x = 0
        
        if mga[i] > 0:
            y = K2/mga[i]
        else:
            y = 1
        
        if annee[i] >= 2024:
            col_z[i] = (x*y) + annee[i]/100000
        else:
            col_z[i] = 0

        # if annee[i] > G1: # added condition to match excel logic
        #     col_z[i] = 0

        # if annee[i] >= user_ret_age+user_birth_date[0]+1: # added condition to match excel logic
        #     col_z[i] = 0
    
    # PHASE 13: Calculate col_z rankings (need complete col_z array)
    col_aa_croissant = np.argsort(np.argsort(-col_z)) + 1  # Negative sign for decreasing order
    for i in range(55):
        col_aa[i] = col_aa_croissant[i]
    
    # PHASE 14: Final pass
    for i in range(55):
        # volet_2
        if col_aa[i] <= 40:
            volet_2[i] = col_z[i]
        else:
            volet_2[i] = 0
    
    # Calculate additional variables not used
    S59 = np.sum(col_s)

    # Final output calculations
    G59 = np.sum(rajustes_1)
    I59 = np.sum(out)
    J59 = np.sum(retranches)
    L59 = np.sum(volet_1, where=~np.isnan(volet_1))  # Ignore NaN values in volet_1
    M59 = np.sum(volet_2)

    G61 = G59 - J59
    F61 = F59 - I59
    G62 = G61 / F61

    O64 = user_mgam5_12.get(int(G1), 0)
    O65 = user_mgam5_12.get(user_annee_courante, 0)

    if Protection: # If running for 65 years protection, return only G62 and O64
        return G62, O64

    G62_protected, O64_protected = calculate_pension_benefits(F1, D2, Protection=True) # Run once to get protected values

    L61 = L59 * 0.0833
    M61 = M59 * 0.3333
    L62 = L61 / 480
    M62 = M61 / 480

    G64 = G62_protected * O64 / O64_protected

    if F2 >= 65:
        x = G64
    else:
        x = 0

    J61 = 0.25 * np.max([G62, x])

    if F2 == 65:
        K62 = 0
    elif F2 > 65:
        K62 = 0.007
    else:
        K62 = 0.005 + 0.001 * J61/(0.25*H2)

    J62 = np.min([1+(F2-65)*K62*12, 158.8/100])

    L63 = L62 * J62
    M63 = M62 * J62

    J63 = J61 * J62
    J64 = J63 * 12 # not used anywhere

    M64 = np.round(J63 + L63 + M63, 2)

    M65 = M64 * O65/O64 # not used anywhere

    
    
    # Print all calculated values
    # print("Calculation completed successfully!")
    # print("\n=== Key Variables ===")
    # print(f"K2 (max moy_5): {K2}")
    # print(f"H2: {H2}")
    # print(f"F59 (total months): {F59}")
    # print(f"O2: {O2}")
    # print(f"I2: {I2}")
    # print(f"Q3: {Q3}")
    # print(f"Q59: {Q59}")
    # print(f"R3: {R3}")
    # print(f"R59: {R59}")
    # print(f"S3: {S3}")
    # print(f"S59: {S59}")
    # print(f"G1 (retirement year): {G1}")
    # print("#######################################")
    # print(f"G59: {G59}")
    # print(f"I59: {I59}")
    # print(f"J59: {J59}")
    # print(f"L59: {L59}")
    # print(f"M59: {M59}")
    # print(f"G61: {G61}")
    # print(f"F61: {F61}")
    # print(f"G62: {G62}")
    # print(f"G62 (65 years protection): {G62_protected}")
    # print(f"O64 (MGA at retirement year): {O64_protected}")
    # print(f"L61: {L61}")
    # print(f"M61: {M61}")
    # print(f"L62: {L62}")
    # print(f"M62: {M62}")
    # print(f"G64: {G64}")
    # print(f"O64: {O64}")
    # print(f"O65: {O65}")
    # print(f"J61: {J61}")
    # print(f"K62: {K62}")
    # print(f"J62: {J62}")
    # print(f"L63: {L63}")
    # print(f"M63: {M63}")
    # print(f"J63: {J63}")
    # print(f"M64: {M64}")
    # print(f"M65 (Final Pension Benefit): {M65}")
    
    # # Save to CSV file
    # csv_filename = "results/pension_calculation_results.csv"
    # with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
    #     writer = csv.writer(csvfile)
        
    #     # Write header
    #     writer.writerow(["Index", "Annee", "Age", "Salaire", "MGA", "Mois", "Rajustes_1", "Rajustes_2", 
    #                     "Out", "Retranches", "Moy_5", "Volet_1", "Volet_2", "Testing_Rang", "Rang", 
    #                     "Col_P", "Col_Q", "Col_R", "Col_S", "V1", "Col_U", "Sal", "RG", 
    #                     "Salaire_Base", "Col_Y", "Col_Z", "Col_AA"])
        
    #     # Write data rows
    #     for i in range(55):
    #         moy_5_val = f"{moy_5[i]:.2f}" if not np.isnan(moy_5[i]) else "NaN"
    #         volet_1_val = f"{volet_1[i]:.4f}" if not np.isnan(volet_1[i]) else "NaN"
            
    #         writer.writerow([
    #             i+1, f"{annee[i]:.0f}", f"{age[i]:.0f}", f"{salaire[i]:.2f}", f"{mga[i]:.2f}", f"{mois[i]:.2f}",
    #             f"{rajustes_1[i]:.4f}", f"{rajustes_2[i]:.4f}", f"{out[i]:.2f}", f"{retranches[i]:.4f}",
    #             moy_5_val, volet_1_val, f"{volet_2[i]:.4f}", f"{testing_rang[i]:.6f}", f"{rang[i]:.0f}",
    #             f"{col_p[i]:.6f}", f"{col_q[i]:.2f}", f"{col_r[i]:.2f}", f"{col_s[i]:.2f}", f"{v1[i]:.2f}",
    #             f"{col_u[i]:.2f}", f"{sal[i]:.6f}", f"{rg[i]:.0f}", f"{salaire_base[i]:.2f}", f"{col_y[i]:.2f}",
    #             f"{col_z[i]:.6f}", f"{col_aa[i]:.0f}"
    #         ])
    
    # print(f"\nResults saved to {csv_filename}")

    return M64

def tabulate_pension_over_years(user_birth_date):
    """
    Tabulate pension benefits over a range of retirement years.
    
    Parameters:
    user_birth_date: User's birth date

    Returns:
    Array with retirement years and corresponding pension benefits
    """
    # Extract year, month, day from user_birth_date
    start_year = user_birth_date[0] + 60

    table = np.zeros((13, 55))  # 13 years (60 to 72) and 55 career durations (1 to 55)

    for i in range(13):
        for j in range(55):
            # Handle month rollover: if birth month is December (12), next month is January (1) of next year
            if user_birth_date[1] == 12:
                retirement_year = start_year + i + 1
                retirement_month = 1
            else:
                retirement_year = start_year + i
                retirement_month = user_birth_date[1] + 1
            
            value = calculate_pension_benefits(F1=[retirement_year, retirement_month, 1], D2=j+1)
            table[i, j] = value

    print("Tabulation completed successfully!")
    # export to CSV
    csv_filename = "results/pension_tabulation_results.csv"
    with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write header
        header = ["Retirement Age/Career Duration"] + [f"{k+1}" for k in range(55)]
        writer.writerow(header)
        
        # Write data rows
        for i in range(13):
            row = [f"{60+i}"] + [f"{table[i, j]:.2f}" for j in range(55)]
            writer.writerow(row)


    return table

def tabulate_difference_in_pension(user_birth_date):
    """
    Tabulate difference in pension benefits between retirement ages 65 and 67.
    
    Parameters:
    user_birth_date: User's birth date

    Returns:
    Array with difference in pension benefits between ages 65 and 67
    """
    diff_table = np.zeros((13, 55))  # 1 row for difference and 55 career durations (1 to 55)

    table = tabulate_pension_over_years(user_birth_date)
    for i in range(55):
        if i == 0 :
            diff_table[:, i] = table[:, i]
        else:
            diff_table[:, i] = table[:, i] - table[:, i-1]

    
    csv_filename = "results/pension_tabulation_diff_results.csv"
    with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write header
        header = ["Retirement Age/Career Duration"] + [f"{k+1}" for k in range(55)]
        writer.writerow(header)
        
        # Write data rows
        for i in range(13):
            row = [f"{60+i}"] + [f"{diff_table[i, j]:.2f}" for j in range(55)]
            writer.writerow(row)


    return diff_table

# Example usage (hardcoded for testing)
if __name__ == "__main__":

    
    # Call the function with F1=2045, D2=55
    # print(calculate_pension_benefits(F1=[2052,11,1], D2=55))

    tabulate_difference_in_pension(user_birth_date=[1980,10,10])
