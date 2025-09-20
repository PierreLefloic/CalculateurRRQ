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
        this.isLoaded = false;

        this.loadData(salaryIncrease);
    }

    async loadData(salaryIncrease = 3.1) {
        try {
            // Load CSV data from MGA.csv file
            const csvData = await this.loadCSVData();
            
            // Process the data similar to Python version
            this.processData(csvData, salaryIncrease);
            this.isLoaded = true;
        } catch (error) {
            console.error("Error loading MGA data:", error);
        }
    }

    async loadCSVData() {
        // For Node.js environment
        if (typeof require !== 'undefined') {
            const fs = require('fs');
            const path = require('path');
            const csvContent = fs.readFileSync(path.join(__dirname, '..', 'MGA.csv'), 'utf-8');
            return this.parseCSV(csvContent);
        }
        
        // For browser environment
        if (typeof fetch !== 'undefined') {
            const response = await fetch('./MGA.csv');
            if (!response.ok) {
                throw new Error(`Failed to load MGA.csv: ${response.status} ${response.statusText}`);
            }
            const csvContent = await response.text();
            return this.parseCSV(csvContent);
        }
        
        throw new Error("Unable to load CSV data - neither Node.js fs nor fetch API available");
    }

    parseCSV(csvContent) {
        const lines = csvContent.split('\n');
        const header = lines[0].split(';').map(col => col.trim());
        
        const data = {
            years: [],
            mga: [],
            mgam5: [],
            mgam5_12: [],
            msga: [],
            taux_base: [],
            exemption: [],
            taux_sup_v1: [],
            taux_sup_v2: [],
            non_arrondi: [],
            intro_v1: []
        };

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const columns = line.split(';');
            
            // Parse each column with proper data cleaning
            const year = this.parseNumeric(columns[0]);
            if (isNaN(year)) continue;

            data.years.push(year);
            data.mga.push(this.parseNumeric(columns[1]));
            data.mgam5.push(this.parseNumeric(columns[2]));
            data.mgam5_12.push(this.parseNumeric(columns[3]));
            data.msga.push(this.parseNumeric(columns[4]));
            data.taux_base.push(this.parsePercentage(columns[5]));
            data.exemption.push(this.parseNumeric(columns[6]));
            data.taux_sup_v1.push(this.parsePercentage(columns[7]));
            data.taux_sup_v2.push(this.parsePercentage(columns[8]));
            data.non_arrondi.push(this.parseNumeric(columns[9]));
            data.intro_v1.push(this.parsePercentage(columns[10]));
        }

        return data;
    }

    parseNumeric(value) {
        if (!value || value.trim() === '' || value.toLowerCase() === 'nan') {
            return NaN;
        }
        
        // Remove spaces, dollar signs, and other formatting
        const cleaned = value.replace(/[\s$,]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? NaN : num;
    }

    parsePercentage(value) {
        if (!value || value.trim() === '' || value.toLowerCase() === 'nan') {
            return NaN;
        }
        
        // Remove spaces and percentage signs
        const cleaned = value.replace(/[\s%]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? NaN : num;
    }

    // Alternative method for pre-loaded CSV data (synchronous)
    loadFromCSVString(csvContent, salaryIncrease = 3.1) {
        try {
            const csvData = this.parseCSV(csvContent);
            this.processData(csvData, salaryIncrease);
            this.isLoaded = true;
            return true;
        } catch (error) {
            console.error("Error parsing CSV data:", error);
            return false;
        }
    }

    // Check if data is properly loaded
    isDataValid() {
        return this.isLoaded && 
               Object.keys(this.mga).length > 0 && 
               Object.keys(this.taux_base).length > 0;
    }


    processData(data, salaryIncrease) {
        const years = data.years;
        let mga = [...data.mga];
        let mgam5 = [...data.mgam5];
        let mgam5_12 = [...data.mgam5_12];
        let msga = [...data.msga];
        let taux_base = [...data.taux_base];
        let exemption = [...data.exemption];
        let taux_sup_v1 = [...data.taux_sup_v1];
        let taux_sup_v2 = [...data.taux_sup_v2];
        let non_arrondi = [...data.non_arrondi];
        let intro_v1 = [...data.intro_v1];

        // Helper functions to check for NaN or missing values
        const isNanForCalc = (value) => {
            return isNaN(value) || value === null || value === undefined;
        };

        // Fill missing non_arrondi values
        for (let i = 1; i < non_arrondi.length; i++) {
            if (isNanForCalc(non_arrondi[i])) {
                non_arrondi[i] = non_arrondi[i-1] * (1 + salaryIncrease / 100);
            }
        }

        // Fill missing MGA values
        for (let i = 0; i < mga.length; i++) {
            if (isNanForCalc(mga[i])) {
                mga[i] = Math.floor(non_arrondi[i] / 100) * 100;
            }
        }

        // Calculate MGAM5 for missing values
        for (let i = 0; i < mga.length; i++) {
            if (i < 4) {
                if (isNanForCalc(mgam5[i])) {
                    mgam5[i] = NaN;
                }
            } else {
                if (isNanForCalc(mgam5[i])) {
                    mgam5[i] = (mga[i-4] + mga[i-3] + mga[i-2] + mga[i-1] + mga[i]) / 5;
                }
            }
        }

        // Calculate MGAM5_12 for all values (always recalculate)
        for (let i = 0; i < mgam5.length; i++) {
            mgam5_12[i] = mgam5[i] / 12;
        }

        // Calculate MSGA for missing values
        for (let i = 0; i < mga.length; i++) {
            if (isNanForCalc(msga[i])) {
                msga[i] = Math.floor(mga[i] * (1 + 0.14) / 100) * 100;
            }
        }

        // Fill missing percentage values with defaults
        for (let i = 0; i < years.length; i++) {
            if (isNanForCalc(taux_base[i])) {
                taux_base[i] = 5.25; // Default base rate
            }
            if (isNanForCalc(exemption[i])) {
                exemption[i] = 3500; // Default exemption
            }
            if (isNanForCalc(taux_sup_v1[i])) {
                taux_sup_v1[i] = 0; // Default supplementary rate V1
            }
            if (isNanForCalc(taux_sup_v2[i])) {
                taux_sup_v2[i] = 1.0; // Default supplementary rate V2
            }
            if (isNanForCalc(intro_v1[i])) {
                intro_v1[i] = 0; // Default introduction V1
            }
        }

        // Convert to objects for easier access
        for (let i = 0; i < years.length; i++) {
            this.mga[years[i]] = mga[i];
            this.mgam5[years[i]] = mgam5[i];
            this.mgam5_12[years[i]] = mgam5_12[i];
            this.msga[years[i]] = msga[i];
            this.taux_base[years[i]] = taux_base[i];
            this.exemption[years[i]] = exemption[i];
            this.taux_sup_v1[years[i]] = taux_sup_v1[i];
            this.taux_sup_v2[years[i]] = taux_sup_v2[i];
            this.non_arrondi[years[i]] = non_arrondi[i];
            this.intro_v1[years[i]] = intro_v1[i];
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
        } else if (this.userObj.birth_date[1] === 1 && this.userObj.birth_date[2] === 1) {
            // January 1st births: ages start from 18 but years follow the normal pattern
            this.ages = Array.from({length: 55}, (_, i) => i + 18);
            this.years = Array.from({length: 55}, (_, i) => this.userObj.birth_date[0] + 17 + 1 + i);
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
            this.ages[this.years[i]] = this.ages[i];
            this.effectif[this.years[i]] = effectif[i];
            this.maximum[this.years[i]] = maximum[i];
            this.base[this.years[i]] = base[i];
            this.V1[this.years[i]] = V1[i];
            this.V2[this.years[i]] = V2[i];
        }
    }

    save() {
        // Print cotisation data to console in table format
        console.log('\n=== COTISATION DATA ===');
        
        // Create formatted table
        const headers = ['Year', 'Effectif', 'Maximum', 'Base', 'V1', 'V2'];
        const colWidths = [6, 10, 10, 10, 8, 8];
        
        // Print header
        let headerRow = '';
        headers.forEach((header, index) => {
            headerRow += header.padEnd(colWidths[index]) + ' | ';
        });
        console.log(headerRow);
        
        // Print separator line
        let separator = '';
        colWidths.forEach(width => {
            separator += '-'.repeat(width) + '-+-';
        });
        console.log(separator.slice(0, -1)); // Remove last '+'
        
        // Sort years for consistent output
        const sortedYears = Object.keys(this.effectif).sort((a, b) => parseInt(a) - parseInt(b));
        
        // Print data rows
        sortedYears.forEach(year => {
            const row = [
                year,
                this.effectif[year].toFixed(2),
                this.maximum[year].toFixed(2),
                this.base[year].toFixed(2),
                this.V1[year].toFixed(2),
                this.V2[year].toFixed(2)
            ];
            
            let dataRow = '';
            row.forEach((value, index) => {
                dataRow += value.toString().padEnd(colWidths[index]) + ' | ';
            });
            console.log(dataRow);
        });
        
        console.log('=== END COTISATION DATA ===\n');
        
        // Also return data array for compatibility
        const data = [];
        data.push(["Year", "Effectif", "Maximum", "Base", "V1", "V2"]);
        
        for (const year of sortedYears) {
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
    let ages;
    if (userObj.birth_date[1] === 12 || (userObj.birth_date[1] === 1 && userObj.birth_date[2] === 1)) {
        // December births or January 1st births: start at age 18
        ages = Array.from({length: 93}, (_, i) => i + 18);
    } else {
        // All other births: start at age 17
        ages = Array.from({length: 93}, (_, i) => i + 17);
    }

    const cot = new Cotisation(userObj, mgaObj);
    cot.calculateCotisation();
    // cot.save();

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

    // Optional: Print triTable to console or save to file
    // if (typeof console !== 'undefined') {
    //     printTriTable(triTable, ages, years);
    // }

    return [triTable, tri];
}

// Function to print triTable in a readable format
function printTriTable(triTable, ages, years, saveToFile = false) {
    const output = [];
    
    // Header row
    const header = ['Age/Year', ...years.slice(0, 20)]; // Show first 20 years for readability
    output.push(header.join('\t'));
    
    // Data rows
    for (let i = 0; i < Math.min(20, triTable.length); i++) { // Show first 20 ages for readability
        const row = [ages[i], ...triTable[i].slice(0, 20).map(val => val.toFixed(2))];
        output.push(row.join('\t'));
    }
    
    const tableString = output.join('\n');
    
    if (saveToFile && typeof require !== 'undefined') {
        // Node.js environment - save to file
        const fs = require('fs');
        const path = require('path');
        const filename = path.join(__dirname, '..', 'triTable_output.txt');
        fs.writeFileSync(filename, tableString);
        console.log(`TRI Table saved to: ${filename}`);
    } else {
        // Browser environment or console output
        console.log('\n=== TRI TABLE (First 20x20) ===');
        console.log(tableString);
        console.log('=== END TRI TABLE ===\n');
    }
    
    return tableString;
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
    const startAge = cot.ages[startYear]; //startYear - userObj.birth_date[0] - 1;
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
        // cotisationData: cot.save(),
        pensionTable: penTable,
        triTable: triTable,
        tri: tri,
        benefitStartYear: G1  // Year when benefits start (used for headers)
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
        printTriTable,
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
        printTriTable,
        results,
        irr
    };
}
