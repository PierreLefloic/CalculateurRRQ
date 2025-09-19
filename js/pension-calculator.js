/**
 * Quebec Pension Plan Calculator - JavaScript Implementation
 * Translated from Python simulation_calculator.py
 * 
 * This calculator performs complex pension benefit calculations including:
 * - User input processing
 * - MGA (Maximum General Average) data handling
 * - Contribution calculations
 * - Internal Rate of Return (IRR) calculations
 * - Pension benefit tabulations
 * - Final results generation
 */

class UserInput {
    constructor() {
        this.salary = [
            3690, 22440, 22560, 22980, 23460, 23940, 24300, 24660, 25260, 26220,
            26940, 27780, 28320, 28980, 75150, 76650, 78750, 80400, 82350, 82950,
            83850, 86100, 88050, 92400, 97350, 99900, 102750, 106950, 110100, 113400,
            116850, 120300, 124050, 127650, 131550, 135450, 139500, 143700, 148050, 152550,
            157050, 161850, 166650, 171600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
        this.birth_date = [1990, 12, 1]; // [YYYY, MM, DD]
        this.ret_age = 65;
        this.current_year = 2025;
        this.benefit_age = 65;
        this.lifespan = 95;
        this.self_employed = false;
        this.salary_increase = 3.1;
        this.inflation = 2.1;
    }

    calculateSalary(mgaObj) {
        const x = this.birth_date[1] === 12 ? 1 : 0;

        for (let i = 0; i < 55; i++) {
            const year = this.birth_date[0] + 18 + x + i;
            
            // Calculate salary as percentage of MGA
            if (i < 14) {
                this.salary[i] = mgaObj.mga[year] * 1;
            } else {
                this.salary[i] = mgaObj.mga[year] * 1;
            }

            if (year >= this.birth_date[0] + this.ret_age + 1 || 
                year > this.birth_date[0] + this.benefit_age + 1) {
                this.salary[i] = 0;
            }
        }

        // Prorated for the first year if birth month is not December
        if (this.birth_date[1] !== 12) {
            this.salary[0] = this.salary[0] * (12 - this.birth_date[1]) / 12;
        }

        // Prorated for the last year if retirement month is not December
        if (this.ret_age !== 12) {
            this.salary[this.salary.length - 1] = this.salary[this.salary.length - 1] * (this.ret_age - 1) / 12;
        }
    }
}

class MGAData {
    constructor(salaryIncrease = 3.1) {
        this.mga = {};
        this.mgam5 = {};
        this.mgam5_12 = {};
        this.msga = {};
        this.taux_base = {};
        this.exemption = {};
        this.taux_sup_v1 = {};
        this.taux_sup_v2 = {};
        this.non_arrondi = {};
        this.intro_v1 = {};

        this.loadData(salaryIncrease);
    }

    async loadData(salaryIncrease = 3.1) {
        // For web implementation, you would typically load this from a JSON file or API
        // For now, we'll include the essential data inline
        
        // This would be replaced with actual CSV/JSON data loading
        const mgaBaseData = this.getBaseData();
        
        // Process the data similar to Python version
        this.processData(mgaBaseData, salaryIncrease);
    }

    getBaseData() {
        // This is a simplified version. In a real implementation, you would load this from MGA.csv
        // For demonstration, including key years of data
        return {
            years: [1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050, 2051, 2052, 2053, 2054, 2055, 2056, 2057, 2058, 2059, 2060, 2061, 2062, 2063, 2064, 2065, 2066, 2067, 2068, 2069, 2070, 2071, 2072, 2073, 2074, 2075, 2076, 2077, 2078, 2079, 2080, 2081, 2082, 2083, 2084, 2085, 2086, 2087, 2088, 2089, 2090, 2091, 2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099, 2100],
            mga: [5000, 5000, 5100, 5200, 5300, 5400, 5500, 5900, 6600, 7400, 8300, 9300, 10400, 11700, 13100, 14700, 16500, 18500, 20800, 23400, 25800, 25900, 26500, 27700, 28900, 30500, 32200, 33400, 34400, 34900, 35400, 35800, 36900, 37400, 37600, 38300, 39100, 39900, 40500, 41100, 42100, 43700, 44900, 46300, 47200, 48300, 50100, 51100, 52500, 53600, 54900, 55300, 55900, 57400, 58700, 61600, 64900, 66600, 68500, 71300, 73400, 75600, 77900, 80200, 82700, 85100, 87700, 90300, 93000, 95800, 98700, 101700, 104700, 107900, 111100, 114400, 117900, 121400, 125100, 128800, 132700, 136700, 140800, 145000, 149300, 153800, 158400, 163200, 168100, 173100, 178300, 183700, 189200, 194900, 200700, 206700, 212900, 219300, 225900, 232700, 239700, 246800, 254300, 261900, 269700, 277800, 286200, 294800, 303600, 312700, 322100, 331800, 341700, 352000, 362500, 373400, 384600, 396100, 408000, 420300, 432900, 445900, 459300, 473000, 487200, 501800, 516900, 532400, 548400, 564800, 581800, 599200, 617200, 635700, 654800],
            taux_base: Array(135).fill(5.25),
            exemption: Array(135).fill(3500),
            taux_sup_v1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.15, 0.30, 0.50, 0.75, 1.00, ...Array(77).fill(1.0)],
            taux_sup_v2: Array(135).fill(1.0),
            non_arrondi: [5000, 5000, 5100, 5200, 5300, 5400, 5500, 5900, 6600, 7400, 8300, 9300, 10400, 11700, 13100, 14700, 16500, 18500, 20800, 23400, 25800, 25900, 26500, 27700, 28900, 30500, 32200, 33400, 34400, 34900, 35400, 35800, 36900, 37400, 37600, 38300, 39100, 39900, 40500, 41100, 42100, 43700, 44900, 46300, 47200, 48300, 50100, 51100, 52500, 53600, 54900, 55300, 55900, 57400, 58700, 61600, 64900, 66600, 68500],
            intro_v1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 30, 50, 75, 100, ...Array(77).fill(100)]
        };
    }

    processData(data, salaryIncrease) {
        const years = data.years;
        let mga = [...data.mga];
        let mgam5 = [];
        let mgam5_12 = [];
        let msga = [];
        let taux_base = [...data.taux_base];
        let exemption = [...data.exemption];
        let taux_sup_v1 = [...data.taux_sup_v1];
        let taux_sup_v2 = [...data.taux_sup_v2];
        let non_arrondi = [...data.non_arrondi];
        let intro_v1 = [...data.intro_v1];

        // Fill missing non_arrondi values
        for (let i = 1; i < non_arrondi.length; i++) {
            if (isNaN(non_arrondi[i]) || non_arrondi[i] === 0) {
                non_arrondi[i] = non_arrondi[i-1] * (1 + salaryIncrease / 100);
            }
        }

        // Fill missing MGA values
        for (let i = 0; i < mga.length; i++) {
            if (isNaN(mga[i]) || mga[i] === 0) {
                mga[i] = Math.floor(non_arrondi[i] / 100) * 100;
            }
        }

        // Calculate MGAM5
        for (let i = 0; i < mga.length; i++) {
            if (i < 4) {
                mgam5[i] = NaN;
            } else {
                mgam5[i] = (mga[i-4] + mga[i-3] + mga[i-2] + mga[i-1] + mga[i]) / 5;
            }
        }

        // Calculate MGAM5_12
        for (let i = 0; i < mgam5.length; i++) {
            mgam5_12[i] = mgam5[i] / 12;
        }

        // Calculate MSGA
        for (let i = 0; i < mga.length; i++) {
            if (isNaN(data.msga) || !data.msga) {
                msga[i] = Math.floor(mga[i] * (1 + 0.14) / 100) * 100;
            }
        }

        // Convert to objects for easier access
        for (let i = 0; i < years.length; i++) {
            this.mga[years[i]] = mga[i];
            this.mgam5[years[i]] = mgam5[i];
            this.mgam5_12[years[i]] = mgam5_12[i];
            this.msga[years[i]] = msga[i];
            this.taux_base[years[i]] = taux_base[i] || 5.25;
            this.exemption[years[i]] = exemption[i] || 3500;
            this.taux_sup_v1[years[i]] = taux_sup_v1[i] || 0;
            this.taux_sup_v2[years[i]] = taux_sup_v2[i] || 1.0;
            this.non_arrondi[years[i]] = non_arrondi[i];
            this.intro_v1[years[i]] = intro_v1[i] || 0;
        }
    }
}

class Cotisation {
    constructor(userObj, mgaObj) {
        this.userObj = userObj;
        this.mgaObj = mgaObj;
        this.effectif = {};
        this.maximum = {};
        this.base = {};
        this.V1 = {};
        this.V2 = {};
        this.ages = [];
        this.years = [];
    }

    calculateCotisation() {
        const base = new Array(55).fill(0);
        const V1 = new Array(55).fill(0);
        const V2 = new Array(55).fill(0);
        const effectif = new Array(55).fill(0);
        const maximum = new Array(55).fill(0);

        if (this.userObj.birth_date[1] === 12) {
            this.ages = Array.from({length: 55}, (_, i) => i + 18);
            this.years = Array.from({length: 55}, (_, i) => this.userObj.birth_date[0] + 17 + 2 + i);
        } else {
            this.ages = Array.from({length: 55}, (_, i) => i + 17);
            this.years = Array.from({length: 55}, (_, i) => this.userObj.birth_date[0] + 17 + 1 + i);
        }

        for (let i = 0; i < this.years.length; i++) {
            const year = this.years[i];

            const x = Math.max(0, Math.min(this.mgaObj.mga[year], this.userObj.salary[i]) - this.mgaObj.exemption[year]);

            base[i] = x * this.mgaObj.taux_base[year] / 100;
            V1[i] = x * this.mgaObj.taux_sup_v1[year] / 100;
            V2[i] = Math.max(0, Math.min(this.userObj.salary[i], this.mgaObj.msga[year]) - this.mgaObj.mga[year]) * this.mgaObj.taux_sup_v2[year] / 100;

            const y = this.userObj.self_employed ? 2 : 1;
            effectif[i] = (base[i] + V1[i] + V2[i]) * y;

            maximum[i] = Math.max(0, this.mgaObj.mga[year] - this.mgaObj.exemption[year]) * 
                        (this.mgaObj.taux_base[year] / 100 + this.mgaObj.taux_sup_v1[year] / 100) + 
                        this.mgaObj.taux_sup_v2[year] / 100 * (this.mgaObj.msga[year] - this.mgaObj.mga[year]);
        }

        // Convert to objects for easier access
        for (let i = 0; i < this.years.length; i++) {
            this.effectif[this.years[i]] = effectif[i];
            this.maximum[this.years[i]] = maximum[i];
            this.base[this.years[i]] = base[i];
            this.V1[this.years[i]] = V1[i];
            this.V2[this.years[i]] = V2[i];
        }
    }

    save() {
        // For web implementation, this would save to local storage or send to server
        const data = [];
        data.push(["Year", "Effectif", "Maximum", "Base", "V1", "V2"]);
        
        for (const year of Object.keys(this.effectif)) {
            data.push([
                year,
                this.effectif[year].toFixed(2),
                this.maximum[year].toFixed(2),
                this.base[year].toFixed(2),
                this.V1[year].toFixed(2),
                this.V2[year].toFixed(2)
            ]);
        }
        
        return data;
    }
}

// Utility functions
function calculateIrrInitialGuess(cashflows) {
    const times = cashflows.map((_, i) => i);
    const posMask = cashflows.map(cf => cf > 0);
    const negMask = cashflows.map(cf => cf < 0);

    if (!posMask.includes(true) || !negMask.includes(true)) {
        throw new Error("Need at least one positive and one negative cash flow to form a guess.");
    }

    const P = cashflows.filter((cf, i) => posMask[i]).reduce((sum, cf) => sum + cf, 0);
    const N = -cashflows.filter((cf, i) => negMask[i]).reduce((sum, cf) => sum + cf, 0);

    const tP = cashflows.reduce((sum, cf, i) => posMask[i] ? sum + (times[i] * cf) : sum, 0) / P;
    const tN = cashflows.reduce((sum, cf, i) => negMask[i] ? sum + (times[i] * (-cf)) : sum, 0) / N;
    const delta = tP - tN;

    let guess;
    if (Math.abs(delta) < 1e-12) {
        const T = Math.max(...times) - Math.min(...times) || 1.0;
        guess = Math.pow(P / N, 1.0 / T) - 1.0;
    } else {
        guess = Math.pow(P / N, 1.0 / delta) - 1.0;
    }

    return guess;
}

function irr(cashflows, guess = null, tol = 1e-7, maxIter = 1000) {
    if (cashflows.length < 2) return -1;

    const positive = cashflows.filter(cf => cf > 0).length;
    const negative = cashflows.filter(cf => cf < 0).length;
    if (positive === 0 || negative === 0) return -1;

    let calculatedGuess;
    if (guess === null) {
        try {
            calculatedGuess = calculateIrrInitialGuess(cashflows);
        } catch (e) {
            calculatedGuess = 0.1;
        }
    } else {
        calculatedGuess = guess;
    }

    const guesses = [calculatedGuess, calculatedGuess * 1.1, calculatedGuess * 0.9, calculatedGuess * 1.2, calculatedGuess * 0.8];
    const uniqueGuesses = [...new Set(guesses)];

    for (const initialGuess of uniqueGuesses) {
        let r = initialGuess;
        let prevR = null;

        for (let iteration = 0; iteration < maxIter; iteration++) {
            if (r <= -1) r = -0.99;

            try {
                const npv = cashflows.reduce((sum, cf, i) => sum + cf / Math.pow(1 + r, i), 0);
                const dNpv = cashflows.reduce((sum, cf, i) => i > 0 ? sum - i * cf / Math.pow(1 + r, i + 1) : sum, 0);

                if (Math.abs(npv) < tol) {
                    if (-1 < r && r < 10) return r;
                    else break;
                }

                if (Math.abs(dNpv) < 1e-10) break;

                let rNew = r - npv / dNpv;

                if (Math.abs(rNew - r) > 0.5) {
                    rNew = r - 0.5 * Math.sign(rNew - r);
                }

                if (prevR !== null && Math.abs(rNew - prevR) < tol) {
                    r = (r + prevR) / 2;
                    if (Math.abs(npv) < tol && -1 < r && r < 10) return r;
                    break;
                }

                if (rNew < -0.99) rNew = -0.99;
                else if (rNew > 10) rNew = 10;

                prevR = r;
                r = rNew;
            } catch (e) {
                break;
            }
        }
    }

    return -1;
}

function calculatePensionBenefits(F1, D2, userObj, mgaObj, Protection = false, lastYearOnly = false) {
    // Initialize arrays (55 years from age 17 to 71)
    const annee = new Array(55).fill(0);
    const age = new Array(55).fill(0);
    const salaire_base = new Array(55).fill(0);
    const mga = new Array(55).fill(0);
    const mois = new Array(55).fill(0);
    const rajustes_1 = new Array(55).fill(0);
    const rajustes_2 = new Array(55).fill(0);
    const out = new Array(55).fill(0);
    const retranches = new Array(55).fill(0);
    const moy_5 = new Array(55).fill(NaN);
    const volet_1 = new Array(55).fill(0);
    const volet_2 = new Array(55).fill(0);
    const testing_rang = new Array(55).fill(0);
    const rang = new Array(55).fill(0);
    const col_p = new Array(55).fill(0);
    const col_q = new Array(55).fill(0);
    const col_r = new Array(55).fill(0);
    const col_s = new Array(55).fill(0);
    const v1 = new Array(55).fill(0);
    const col_u = new Array(55).fill(0);
    const sal = new Array(55).fill(0);
    const rg = new Array(55).fill(0);
    const salaire = new Array(55).fill(0);
    const col_y = new Array(55).fill(0);
    const col_z = new Array(55).fill(0);
    const col_aa = new Array(55).fill(0);

    // 65 years protection adjustment
    if (Protection) {
        if (userObj.birth_date[1] === 12) {
            F1 = [userObj.birth_date[0] + 65 + 1, 1, 1];
        } else {
            F1 = [userObj.birth_date[0] + 65, userObj.birth_date[1] + 1, 1];
        }
    }

    // PHASE 1: Initialize variables
    const G1 = F1[0];

    let F2;
    if (userObj.birth_date[2] === 1) {
        F2 = Math.round(Math.floor((F1[0] * 12 + F1[1] - userObj.birth_date[0] * 12 - userObj.birth_date[1]) / 12));
    } else {
        F2 = Math.floor((F1[0] * 12 + F1[1] - userObj.birth_date[0] * 12 - userObj.birth_date[1]) / 12);
    }

    // PHASE 2: First pass - basic arrays needed for moy_5
    for (let i = 0; i < 55; i++) {
        const x = userObj.birth_date[1] === 12 ? 1 : 0;
        annee[i] = userObj.birth_date[0] + 18 + x + i;
        age[i] = 17 + i;

        if (annee[i] > G1) {
            mga[i] = 0;
        } else {
            mga[i] = mgaObj.mga[annee[i]] || 0;
        }

        if (i < 4) {
            moy_5[i] = NaN;
        } else {
            moy_5[i] = (mga[i-4] + mga[i-3] + mga[i-2] + mga[i-1] + mga[i]) / 5;
        }
    }

    // PHASE 3: Calculate global variables from moy_5
    const K2 = Math.max(...moy_5.filter(x => !isNaN(x)));
    const H2 = K2 / 12;

    // PHASE 4: Second pass - basic arrays now that H2 is available
    for (let i = 0; i < 55; i++) {
        salaire[i] = userObj.salary[i];

        if (i === 0) {
            if (userObj.birth_date[1] < 12) {
                mois[i] = 12 - userObj.birth_date[1];
            } else {
                mois[i] = 12;
            }
        } else {
            if (annee[i] > G1) {
                mois[i] = 0;
            } else if (annee[i] === G1) {
                mois[i] = F1[1] - 1;
            } else {
                mois[i] = 12;
            }
        }

        col_y[i] = Math.max(0, Math.min(salaire[i] - mga[i], (mgaObj.msga[Math.floor(annee[i])] || 0) - mga[i]));
    }

    // PHASE 5: Calculate variables from basic arrays
    const F59 = mois.reduce((sum, m) => sum + m, 0);
    const O2 = 0.15 * F59 / 12;
    const I2 = O2 * 12;
    const Q3 = Math.ceil(I2);

    // PHASE 6: Third pass - arrays needing H2
    for (let i = 0; i < 55; i++) {
        if (i + 1 <= D2) {
            salaire_base[i] = Math.min(userObj.salary[i], mga[i]);
        } else {
            salaire_base[i] = 0;
        }

        let x;
        if (annee[i] <= G1) {
            if (mois[i] > 0) {
                x = mga[i] > 0 ? (salaire_base[i] * 12 / mois[i]) * H2 / mga[i] : 0;
            } else {
                x = 0;
            }
        } else {
            x = 0;
        }

        rajustes_2[i] = Math.min(H2, x);

        if (mois[i] > 0) {
            rajustes_1[i] = rajustes_2[i] * mois[i];
        } else {
            rajustes_1[i] = 0;
        }

        testing_rang[i] = rajustes_2[i] + (annee[i] / 100000) + (mois[i] / 100);

        if (annee[i] > G1) {
            testing_rang[i] = 0;
        }

        if (mois[i] === 0) {
            col_p[i] = 1000000 + testing_rang[i];
        } else {
            col_p[i] = testing_rang[i];
        }
    }

    // PHASE 7: Calculate rankings
    const sortedIndices = col_p.map((val, idx) => ({val, idx}))
                               .sort((a, b) => a.val - b.val)
                               .map(item => item.idx);
    
    for (let i = 0; i < 55; i++) {
        rang[sortedIndices[i]] = i + 1;
    }

    // PHASE 8: Calculate intermediate variables
    const temp_col_q = new Array(55).fill(0);
    for (let i = 0; i < 55; i++) {
        if (rang[i] <= Math.floor(O2)) {
            temp_col_q[i] = mois[i];
        } else {
            temp_col_q[i] = 0;
        }
    }
    const Q59 = temp_col_q.reduce((sum, q) => sum + q, 0);

    const R3 = Q3 - Q59;

    const temp_col_r = new Array(55).fill(0);
    for (let i = 0; i < 55; i++) {
        if (rang[i] === Math.floor(O2 + 1)) {
            temp_col_r[i] = Math.min(mois[i], R3);
        } else {
            temp_col_r[i] = 0;
        }
    }
    const R59 = temp_col_r.reduce((sum, r) => sum + r, 0);

    const S3 = R3 - R59;

    // PHASE 9: Fourth pass - arrays depending on rankings
    for (let i = 0; i < 55; i++) {
        if (rang[i] <= Math.floor(O2)) {
            col_q[i] = mois[i];
        } else {
            col_q[i] = 0;
        }

        if (rang[i] === Math.floor(O2 + 1)) {
            col_r[i] = Math.min(mois[i], R3);
        } else {
            col_r[i] = 0;
        }

        if (rang[i] === Math.floor(O2 + 2)) {
            col_s[i] = Math.min(mois[i], S3);
        } else {
            col_s[i] = 0;
        }

        out[i] = col_q[i] + col_r[i] + col_s[i];
        retranches[i] = out[i] * rajustes_2[i];
    }

    // PHASE 10: Fifth pass - remaining calculations
    for (let i = 0; i < 55; i++) {
        v1[i] = (mgaObj.intro_v1[annee[i]] || 0) / 100;
        col_u[i] = v1.slice(0, i + 1).reduce((sum, v) => sum + v, 0);

        if (annee[i] >= 2019) {
            sal[i] = testing_rang[i] * v1[i];
        } else {
            sal[i] = (annee[i] / 10000) * v1[i];
        }
    }

    // PHASE 11: Calculate sal rankings
    const salSortedIndices = sal.map((val, idx) => ({val, idx}))
                               .sort((a, b) => a.val - b.val)
                               .map(item => item.idx);
    
    for (let i = 0; i < 55; i++) {
        rg[salSortedIndices[i]] = i + 1;
    }

    // PHASE 12: Sixth pass - final calculations
    const maxRg = Math.max(...rg);
    for (let i = 0; i < 55; i++) {
        const x = rg[i] > maxRg - 40 ? 1 : 0;

        if (annee[i] < 2019) {
            volet_1[i] = NaN;
        } else {
            volet_1[i] = v1[i] * rajustes_1[i] * x;
        }

        let x2, y;
        if (salaire_base[i] >= mga[i]) {
            x2 = col_y[i] * mois[i] / 12;
        } else {
            x2 = 0;
        }

        if (mga[i] > 0) {
            y = K2 / mga[i];
        } else {
            y = 1;
        }

        if (annee[i] >= 2024) {
            col_z[i] = (x2 * y) + annee[i] / 100000;
        } else {
            col_z[i] = 0;
        }
    }

    // PHASE 13: Calculate col_z rankings (decreasing order)
    const colZSortedIndices = col_z.map((val, idx) => ({val, idx}))
                                   .sort((a, b) => b.val - a.val)
                                   .map(item => item.idx);
    
    for (let i = 0; i < 55; i++) {
        col_aa[colZSortedIndices[i]] = i + 1;
    }

    // PHASE 14: Final pass
    for (let i = 0; i < 55; i++) {
        if (col_aa[i] <= 40) {
            volet_2[i] = col_z[i];
        } else {
            volet_2[i] = 0;
        }
    }

    // Final output calculations
    const G59 = rajustes_1.reduce((sum, r) => sum + r, 0);
    const I59 = out.reduce((sum, o) => sum + o, 0);
    const J59 = retranches.reduce((sum, r) => sum + r, 0);
    const L59 = volet_1.filter(v => !isNaN(v)).reduce((sum, v) => sum + v, 0);
    const M59 = volet_2.reduce((sum, v) => sum + v, 0);

    const G61 = G59 - J59;
    const F61 = F59 - I59;
    const G62 = G61 / F61;

    const O64 = mgaObj.mgam5_12[Math.floor(G1)] || 0;
    const O65 = mgaObj.mgam5_12[userObj.current_year] || 0;

    if (Protection) {
        return [G62, O64];
    }

    const [G62_protected, O64_protected] = calculatePensionBenefits(F1, D2, userObj, mgaObj, true);

    const L61 = L59 * 0.0833;
    const M61 = M59 * 0.3333;
    const L62 = L61 / 480;
    const M62 = M61 / 480;

    const G64 = G62_protected * O64 / O64_protected;

    const x = F2 >= 65 ? G64 : 0;
    const J61 = 0.25 * Math.max(G62, x);

    let K62;
    if (F2 === 65) {
        K62 = 0;
    } else if (F2 > 65) {
        K62 = 0.007;
    } else {
        K62 = 0.005 + 0.001 * J61 / (0.25 * H2);
    }

    const J62 = Math.min(1 + (F2 - 65) * K62 * 12, 158.8 / 100);

    const L63 = L62 * J62;
    const M63 = M62 * J62;
    const J63 = J61 * J62;
    const M64 = Math.round((J63 + L63 + M63) * 100) / 100;
    const M65 = M64 * O65 / O64;

    if (lastYearOnly) {
        return [M63, M64, M65, J63, L63, O65, O64, G1];
    }

    return M64;
}

function tabulatePensionOverYears(userObj, mgaObj) {
    const startYear = userObj.birth_date[0] + 60;
    const table = Array(13).fill().map(() => Array(55).fill(0));

    for (let i = 0; i < 13; i++) {
        for (let j = 0; j < 55; j++) {
            let retirementYear, retirementMonth;
            
            if (userObj.birth_date[1] === 12) {
                retirementYear = startYear + i + 1;
                retirementMonth = 1;
            } else {
                retirementYear = startYear + i;
                retirementMonth = userObj.birth_date[1] + 1;
            }

            const value = calculatePensionBenefits([retirementYear, retirementMonth, 1], j + 1, userObj, mgaObj, false);
            table[i][j] = value;
        }
    }

    return table;
}

function tabulateDifferenceInPension(userObj, mgaObj, table) {
    const diffTable = Array(13).fill().map(() => Array(55).fill(0));

    for (let i = 0; i < 55; i++) {
        if (i === 0) {
            for (let j = 0; j < 13; j++) {
                diffTable[j][i] = table[j][i];
            }
        } else {
            for (let j = 0; j < 13; j++) {
                diffTable[j][i] = table[j][i] - table[j][i-1];
            }
        }
    }

    return diffTable;
}

function tabulateTri(userObj, mgaObj, diffTable) {
    const ages = userObj.birth_date[1] === 12 ? 
        Array.from({length: 93}, (_, i) => i + 18) : 
        Array.from({length: 93}, (_, i) => i + 17);

    const cot = new Cotisation(userObj, mgaObj);
    cot.calculateCotisation();

    const triTable = Array(93).fill().map(() => Array(55).fill(0));
    const years = cot.years;

    for (let i = 0; i < 93; i++) {
        for (let j = 0; j < 55; j++) {
            // Calculate x
            let x = 0;
            if (ages[i] < userObj.benefit_age && (years[j] - ages[i]) === (userObj.birth_date[0] + 1)) {
                x = cot.effectif[years[j]] || 0;
            }

            // Calculate y
            const indexDict = {60:0, 61:1, 62:2, 63:3, 64:4, 65:5, 66:6, 67:7, 68:8, 69:9, 70:10, 71:11, 72:12};
            let y = 0;

            if (i === 1) {
                if (ages[i] >= 60) {
                    y = diffTable[indexDict[ages[i]]][j];
                }
            } else {
                if (ages[i] === userObj.benefit_age) {
                    y = diffTable[indexDict[ages[i]]][j] * 12;
                }
            }

            // Calculate z
            let z = 0;
            if (i > 0) {
                if (triTable[i-1][j] < 0 && ages[i] < userObj.lifespan) {
                    z = triTable[i-1][j] * (1 + userObj.inflation / 100);
                }
            }

            triTable[i][j] = x - y + z;
        }
    }

    const tri = {};
    for (let j = 0; j < 55; j++) {
        const cashflows = triTable.map(row => row[j]);
        tri[years[j]] = irr(cashflows);
    }

    return [triTable, tri];
}

function results(userObj, mgaObj) {
    const cot = new Cotisation(userObj, mgaObj);
    cot.calculateCotisation();

    let F1;
    if (userObj.birth_date[1] === 12) {
        F1 = [userObj.birth_date[0] + userObj.benefit_age + 1, 1, 1];
    } else {
        F1 = [userObj.birth_date[0] + userObj.benefit_age, userObj.birth_date[1] + 1, 1];
    }

    const [M63, M64, M65, J63, L63, O65, O64, G1] = calculatePensionBenefits(F1, 55, userObj, mgaObj, false, true);

    const penTable = tabulatePensionOverYears(userObj, mgaObj);
    const diffTable = tabulateDifferenceInPension(userObj, mgaObj, penTable);
    const [triTable, tri] = tabulateTri(userObj, mgaObj, diffTable);

    // Calculate summary results
    const tab1_11 = M65 * 12;
    const tab1_12 = M64 * 12;
    const tab1_21 = J63 * 12 * O65 / O64;
    const tab1_22 = J63 * 12;
    const tab1_31 = L63 * 12 * O65 / O64;
    const tab1_32 = L63 * 12;
    const tab1_41 = M63 * 12 * O65 / O64;
    const tab1_42 = M63 * 12;

    // Calculate detailed table
    const startYear = Math.max(2025, cot.years[0]);
    const startAge = startYear - userObj.birth_date[0] - 1;
    const yearsToRetirement = Math.max(0, userObj.ret_age - startAge);

    const years = Array.from({length: yearsToRetirement + 1}, (_, i) => startYear + i);
    const ages = Array.from({length: yearsToRetirement + 1}, (_, i) => startAge + i);

    const tab2Data = [];
    
    for (let i = 0; i < years.length; i++) {
        const year = years[i];
        const age = ages[i];

        // Calculate columns
        const tab2_4 = -(cot.effectif[year] || 0) * mgaObj.mga[userObj.current_year] / (mgaObj.mga[year] || 1);
        const tab2_3 = tab2_4 === 0 ? 0 : tri[year] || 0;

        // Calculate additional columns
        let tab2_7 = 0;
        const x = userObj.birth_date[1] === 12 ? 15 + 3 : 14 + 3;
        try {
            const j = cot.years.indexOf(year);
            const k = userObj.benefit_age - x;
            if (j >= 0 && k >= 0 && k < triTable.length && j < triTable[0].length) {
                tab2_7 = -triTable[k][j];
            }
        } catch (e) {
            tab2_7 = 0;
        }

        let tab2_8 = 0;
        if (i === 0) {
            const indexDict1 = {};
            cot.years.forEach((yr, idx) => { indexDict1[yr] = idx; });
            const indexDict2 = {60:0, 61:1, 62:2, 63:3, 64:4, 65:5, 66:6, 67:7, 68:8, 69:9, 70:10, 71:11, 72:12};
            
            try {
                const k = indexDict2[userObj.benefit_age];
                const j = indexDict1[year - 1];
                if (k !== undefined && j !== undefined && k < penTable.length && j < penTable[0].length) {
                    tab2_8 = penTable[k][j] * 12;
                }
            } catch (e) {
                tab2_8 = 0;
            }
        } else {
            tab2_8 = tab2Data[i-1].tab2_8 + tab2Data[i-1].tab2_7;
        }

        const tab2_5 = tab2_8 * O65 / O64;
        const tab2_6 = tab2_7 * O65 / O64;

        tab2Data.push({
            age: age,
            year: year,
            tri: tab2_3 * 100, // Convert to percentage
            cotisation_annuelle: tab2_4,
            accumulee: tab2_5,
            additionnelle: tab2_6,
            tab2_8: tab2_8,
            tab2_7: tab2_7
        });
    }

    // Return results object
    return {
        summaryResults: {
            tab1_11: tab1_11.toFixed(2),
            tab1_12: tab1_12.toFixed(2),
            tab1_21: tab1_21.toFixed(2),
            tab1_22: tab1_22.toFixed(2),
            tab1_31: tab1_31.toFixed(2),
            tab1_32: tab1_32.toFixed(2),
            tab1_41: tab1_41.toFixed(2),
            tab1_42: tab1_42.toFixed(2)
        },
        detailTable: tab2Data,
        cotisationData: cot.save(),
        pensionTable: penTable,
        triTable: triTable,
        tri: tri
    };
}

// Export for use in web applications
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UserInput,
        MGAData,
        Cotisation,
        calculatePensionBenefits,
        tabulatePensionOverYears,
        tabulateDifferenceInPension,
        tabulateTri,
        results,
        irr
    };
} else if (typeof window !== 'undefined') {
    // Browser environment
    window.PensionCalculator = {
        UserInput,
        MGAData,
        Cotisation,
        calculatePensionBenefits,
        tabulatePensionOverYears,
        tabulateDifferenceInPension,
        tabulateTri,
        results,
        irr
    };
}

// Example usage for web implementation:
/*
// Initialize the calculator
const user = new UserInput();
const mga = new MGAData(user.salary_increase);

// Wait for MGA data to load (if async)
mga.loadData(user.salary_increase).then(() => {
    // Calculate salary based on MGA data
    user.calculateSalary(mga);
    
    // Run the complete calculation
    const calculationResults = results(user, mga);
    
    // Display results on webpage
    console.log("Summary Results:", calculationResults.summaryResults);
    console.log("Detail Table:", calculationResults.detailTable);
    
    // You can now use these results to populate HTML elements
    // Example:
    // document.getElementById('summary-results').innerHTML = 
    //     JSON.stringify(calculationResults.summaryResults, null, 2);
});
*/