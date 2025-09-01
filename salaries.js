// JavaScript conversion of simulation.py for Quebec Pension Plan calculations

// User input configuration
const config = {
    birthdate: [1980, 11, 15],
    current_year: 2025,
    percentage_before: 1.14,
    percentage_after: 1.14,
    in_percent: false,
    retirement_age: 71,
    benefit_age: 60,
    expected_lifespan: 95,
    self_employed: false,
    inflation_rate: 2.1,
    salary_increase: 3.0
};

// Sample inputs array (equivalent to Python inputs)
const inputs = [10000, 10000, 10000, 10000, 10000, null, null, null, null, null, null, null, null, null, null, null];

// Global variables for MGA data
let MGA_years = [];
let MGA = [];
let MGAM5 = [];
let MGAM5_12 = [];
let MSGA = [];
let taux_base = [];
let Exemption = [];
let Taux_supp_V1 = [];
let Taux_supp_V2 = [];
let non_arrondi = [];
let Introduction_V1 = [];
let mga_lookup_table = {};

// Function to clean numeric values (equivalent to Python clean_numeric)
function cleanNumeric(value) {
    if (typeof value === 'string') {
        const cleaned = value.replace(/\s/g, '').replace(/\$/g, '').replace(/%/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    }
    return value;
}

// Function to load and parse CSV data
async function loadMGAData() {
    try {
        const response = await fetch('MGA.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        // Skip header row and parse data
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const values = line.split(';');
                data.push(values);
            }
        }
        
        // Extract columns (equivalent to pandas iloc)
        MGA_years = data.map(row => cleanNumeric(row[0])).filter(x => x !== null);
        MGA = data.map(row => cleanNumeric(row[1]));
        MGAM5 = data.map(row => cleanNumeric(row[2]));
        MGAM5_12 = data.map(row => cleanNumeric(row[3]));
        MSGA = data.map(row => cleanNumeric(row[4]));
        taux_base = data.map(row => cleanNumeric(row[5]));
        Exemption = data.map(row => cleanNumeric(row[6]));
        Taux_supp_V1 = data.map(row => cleanNumeric(row[7]));
        Taux_supp_V2 = data.map(row => cleanNumeric(row[8]));
        non_arrondi = data.map(row => cleanNumeric(row[9]));
        Introduction_V1 = data.map(row => cleanNumeric(row[10]));
        
        // Create lookup table
        mga_lookup_table = {};
        for (let i = 0; i < MGA_years.length; i++) {
            mga_lookup_table[MGA_years[i]] = MGA[i];
        }
        
        // Fill NaN values
        fillMissingValues();
        
        return true;
    } catch (error) {
        console.error('Error loading MGA data:', error);
        return false;
    }
}

// Function to fill missing values (equivalent to Python NaN filling logic)
function fillMissingValues() {
    // Fill non_arrondi values
    for (let i = 0; i < non_arrondi.length; i++) {
        if (non_arrondi[i] === null && i > 0) {
            non_arrondi[i] = non_arrondi[i-1] * (1 + config.salary_increase/100);
        }
    }
    
    // Fill MGA values
    for (let i = 0; i < MGA.length; i++) {
        if (MGA[i] === null) {
            MGA[i] = Math.floor(non_arrondi[i] / 100) * 100;
        }
    }
    
    // Fill MGAM5 values (5-year average)
    for (let i = 0; i < MGAM5.length; i++) {
        if (MGAM5[i] === null && i >= 4) {
            MGAM5[i] = (MGA[i-4] + MGA[i-3] + MGA[i-2] + MGA[i-1] + MGA[i]) / 5;
        }
    }
    
    // Fill MGAM5_12 values
    for (let i = 0; i < MGAM5_12.length; i++) {
        if (MGAM5_12[i] === null) {
            MGAM5_12[i] = MGAM5[i] / 12;
        }
    }
    
    // Fill MSGA values
    for (let i = 0; i < MSGA.length; i++) {
        if (MSGA[i] === null) {
            MSGA[i] = Math.floor(MGA[i] * (1 + 0.14) / 100) * 100;
        }
    }
}

// Calculate age and year ranges
const age_start = config.birthdate[1] !== 12 ? 17 : 18;
const ages = [];
const years = [];

for (let age = age_start; age < 73; age++) {
    ages.push(age);
    years.push(config.birthdate[0] + age + 1);
}

// Calculate percentages array
const percentages = ages.map(age => 
    age < config.benefit_age ? config.percentage_before : config.percentage_after
);

// Excel formula converted to JavaScript
function calculateBenefit(ages, inputs, percentages, years, benefit_age, retirement_age, in_percent, birthdate, mga_lookup_table, i) {
    // Level 1: Check if previous age >= benefit age (some threshold check)
    // Special check for the first year
    if (i === 0 && ages[i] >= benefit_age) {
        return 0;
    }
    // Skip this check for the first element since ages[i-1] would be undefined
    if (i > 0 && ages[i-1] >= benefit_age) {
        return 0;
    }
    
    // Level 2: Check if current age >= retirement age
    if (ages[i] >= retirement_age) {
        return 0;
    }
    
    // Level 3: Check if input is empty/blank
    const inputValue = inputs[i];
    const isEmpty = inputValue === "" || inputValue === null || inputValue === undefined || 
                   (typeof inputValue === 'number' && isNaN(inputValue));
    
    if (isEmpty) {
        // Level 4a: Special case when input is empty AND age equals retirement_age-1
        if (ages[i] === (retirement_age - 1)) {
            // VLOOKUP equivalent: find year in MGA table
            const vlookupResult = mga_lookup_table[years[i]] || 0;
            const monthFromDate = birthdate[1]; // Month number
            
            // Debug: Log the pro-rating calculation
            console.log(`Pro-rating calculation for age ${ages[i]} (retirement_age-1):`, {
                birthdate,
                monthFromDate,
                vlookupResult,
                percentage: percentages[i],
                calculation: `${percentages[i]} * ${vlookupResult} / 100 * 100 * ${monthFromDate} / 12`
            });
            
            // Pro-rated calculation with month factor
            const result = (percentages[i] * vlookupResult / 100 * 100 * monthFromDate / 12);
            return result;
        }
        // Level 4b: Input is empty but age is NOT retirement_age-1
        else {
            const vlookupResult = mga_lookup_table[years[i]] || 0;
            const result = percentages[i] * vlookupResult / 100 * 100;
            return result;
        }
    }
    // Level 5: Input has a value, check if in_percent is TRUE
    else {
        if (in_percent === true) {
            // Use input as percentage with VLOOKUP
            const vlookupResult = mga_lookup_table[years[i]] || 0;
            const result = inputValue / 100 * vlookupResult;
            return result;
        } else {
            // Just return input as-is
            return inputValue;
        }
    }
}

// Main calculation function
async function runSimulation() {
    // Load MGA data first
    const loaded = await loadMGAData();
    if (!loaded) {
        console.error('Failed to load MGA data');
        return null;
    }
    
    // Calculate salaries
    const salaries = [];
    for (let i = 0; i < inputs.length; i++) {
        const salary = calculateBenefit(
            ages, 
            inputs, 
            percentages, 
            years, 
            config.benefit_age, 
            config.retirement_age, 
            config.in_percent, 
            config.birthdate, 
            mga_lookup_table, 
            i
        );
        salaries.push(salary);
    }
    
    return {
        ages,
        years,
        percentages,
        inputs,
        salaries,
        mga_lookup_table,
        config
    };
}

// Test the simulation
runSimulation().then(result => {
    if (result) {
        console.log('Salaries:', result.salaries);
        console.log('Ages:', result.ages);
        console.log('Years:', result.years);
    }
});

// HTML Integration - Real-time calculator
class SalaryCalculator {
    constructor() {
        this.isInitialized = false;
        this.mgaData = null;
        this.mga_lookup_table = {};
    }

    async initialize() {
        try {
            // Load MGA data
            await this.loadMGAData();
            this.isInitialized = true;
            this.bindEventListeners();
            console.log('Salary calculator initialized');
        } catch (error) {
            console.error('Failed to initialize calculator:', error);
        }
    }

    async loadMGAData() {
        const response = await fetch('MGA.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        // Parse CSV data
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                const values = line.split(';');
                data.push(values);
            }
        }
        
        // Extract and clean columns
        this.MGA_years = data.map(row => cleanNumeric(row[0])).filter(x => x !== null);
        this.MGA = data.map(row => cleanNumeric(row[1]));
        this.MGAM5 = data.map(row => cleanNumeric(row[2]));
        this.MGAM5_12 = data.map(row => cleanNumeric(row[3]));
        this.MSGA = data.map(row => cleanNumeric(row[4]));
        this.taux_base = data.map(row => cleanNumeric(row[5]));
        this.Exemption = data.map(row => cleanNumeric(row[6]));
        this.Taux_supp_V1 = data.map(row => cleanNumeric(row[7]));
        this.Taux_supp_V2 = data.map(row => cleanNumeric(row[8]));
        this.non_arrondi = data.map(row => cleanNumeric(row[9]));
        this.Introduction_V1 = data.map(row => cleanNumeric(row[10]));
        
        // Create lookup table
        this.mga_lookup_table = {};
        for (let i = 0; i < this.MGA_years.length; i++) {
            this.mga_lookup_table[this.MGA_years[i]] = this.MGA[i];
        }
        
        // Fill missing values
        this.fillMissingValues();
    }

    fillMissingValues() {
        const salaryIncrease = this.getConfigValue('SalaryIncrease', 3.0);
        
        // Fill non_arrondi values
        for (let i = 0; i < this.non_arrondi.length; i++) {
            if (this.non_arrondi[i] === null && i > 0) {
                this.non_arrondi[i] = this.non_arrondi[i-1] * (1 + salaryIncrease/100);
            }
        }
        
        // Fill MGA values
        for (let i = 0; i < this.MGA.length; i++) {
            if (this.MGA[i] === null) {
                this.MGA[i] = Math.floor(this.non_arrondi[i] / 100) * 100;
            }
        }
        
        // Fill MGAM5 values
        for (let i = 0; i < this.MGAM5.length; i++) {
            if (this.MGAM5[i] === null && i >= 4) {
                this.MGAM5[i] = (this.MGA[i-4] + this.MGA[i-3] + this.MGA[i-2] + this.MGA[i-1] + this.MGA[i]) / 5;
            }
        }
        
        // Fill MGAM5_12 values
        for (let i = 0; i < this.MGAM5_12.length; i++) {
            if (this.MGAM5_12[i] === null) {
                this.MGAM5_12[i] = this.MGAM5[i] / 12;
            }
        }
        
        // Fill MSGA values
        for (let i = 0; i < this.MSGA.length; i++) {
            if (this.MSGA[i] === null) {
                this.MSGA[i] = Math.floor(this.MGA[i] * (1 + 0.14) / 100) * 100;
            }
        }
        
        // Update lookup table
        for (let i = 0; i < this.MGA_years.length; i++) {
            this.mga_lookup_table[this.MGA_years[i]] = this.MGA[i];
        }
    }

    bindEventListeners() {
        // Listen to birthdate input - this is the primary trigger for calculations
        const birthdateInput = document.getElementById('inputBirth');
        if (birthdateInput) {
            birthdateInput.addEventListener('change', () => this.calculateAll());
        }
        
        // Listen to all salary input fields (17 to 72)
        for (let age = 17; age <= 72; age++) {
            const input = document.getElementById(`salary_${age}`);
            if (input) {
                input.addEventListener('change', () => this.calculateAll());
            }
        }
        
        // Listen to other configuration inputs that affect calculations
        const configInputs = ['inputCurrentYear', 'BeforeCurrentYear', 'AfterCurrentYear', 
                             'RetAge', 'BenAge', 'AgeExp', 'InflationRate'];
        configInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', () => this.calculateAll());
            }
        });
        
        // Special handling for SalaryIncrease - needs to reload MGA data
        const salaryIncreaseInput = document.getElementById('SalaryIncrease');
        if (salaryIncreaseInput) {
            salaryIncreaseInput.addEventListener('change', async () => {
                // Reload MGA data with new salary increase value
                await this.loadMGAData();
                // Then recalculate
                this.calculateAll();
            });
        }
        
        // Listen to checkboxes
        const inPercentCheckbox = document.getElementById('InPercent');
        if (inPercentCheckbox) {
            inPercentCheckbox.addEventListener('change', () => this.calculateAll());
        }
        
        const selfEmployedCheckbox = document.getElementById('SelfEmployed');
        if (selfEmployedCheckbox) {
            selfEmployedCheckbox.addEventListener('change', () => this.calculateAll());
        }
    }

    getConfigValue(id, defaultValue) {
        const element = document.getElementById(id);
        if (element && element.value) {
            const value = parseFloat(element.value);
            return isNaN(value) ? defaultValue : value;
        }
        return defaultValue;
    }

    isValidBirthdate() {
        const birthdateInput = document.getElementById('inputBirth');
        if (!birthdateInput || !birthdateInput.value) {
            return false;
        }
        
        // Parse date string manually to avoid timezone issues
        const dateString = birthdateInput.value;
        const dateParts = dateString.split('-');
        
        if (dateParts.length !== 3) {
            return false;
        }
        
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10);
        const day = parseInt(dateParts[2], 10);
        
        // Validate the parsed values
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            return false;
        }
        
        // Check if date is reasonable (not in the future, not too old)
        const currentYear = new Date().getFullYear();
        
        return year >= (currentYear - 120) && year <= currentYear &&
               month >= 1 && month <= 12 &&
               day >= 1 && day <= 31;
    }

    getConfigFromHTML() {
        // Get configuration from HTML inputs, with fallbacks to defaults
        const inPercentCheckbox = document.getElementById('InPercent');
        const selfEmployedCheckbox = document.getElementById('SelfEmployed');
        
        // Parse birthdate from input field
        const birthdateInput = document.getElementById('inputBirth');
        let birthdate = [1980, 11, 15]; // Default fallback
        
        if (birthdateInput && birthdateInput.value) {
            // Parse date string manually to avoid timezone issues
            const dateString = birthdateInput.value;
            const dateParts = dateString.split('-');
            
            if (dateParts.length === 3) {
                const year = parseInt(dateParts[0], 10);
                const month = parseInt(dateParts[1], 10);
                const day = parseInt(dateParts[2], 10);
                
                // Validate the parsed values
                if (!isNaN(year) && !isNaN(month) && !isNaN(day) && 
                    year > 1900 && year < 2100 && 
                    month >= 1 && month <= 12 && 
                    day >= 1 && day <= 31) {
                    birthdate = [year, month, day];
                }
            }
        }
        
        return {
            birthdate: birthdate,
            current_year: this.getConfigValue('inputCurrentYear', 2025),
            percentage_before: this.getConfigValue('BeforeCurrentYear', 114) / 100,
            percentage_after: this.getConfigValue('AfterCurrentYear', 114) / 100,
            in_percent: inPercentCheckbox ? inPercentCheckbox.checked : false,
            retirement_age: this.getConfigValue('RetAge', 71),
            benefit_age: this.getConfigValue('BenAge', 60),
            expected_lifespan: this.getConfigValue('AgeExp', 95),
            self_employed: selfEmployedCheckbox ? selfEmployedCheckbox.checked : false,
            inflation_rate: this.getConfigValue('InflationRate', 2.1),
            salary_increase: this.getConfigValue('SalaryIncrease', 3.0)
        };
    }

    collectSalaryInputs() {
        const inputs = [];
        for (let age = 17; age <= 72; age++) {
            const input = document.getElementById(`salary_${age}`);
            if (input && input.value && parseFloat(input.value) > 0) {
                inputs.push(parseFloat(input.value));
            } else {
                inputs.push(null);
            }
        }
        return inputs;
    }

    clearResults() {
        // Clear all computed salary fields
        for (let age = 17; age <= 72; age++) {
            const computedElement = document.getElementById(`computed_salary_${age}`);
            if (computedElement) {
                computedElement.textContent = '';
            }
        }
    }

    calculateAll() {
        if (!this.isInitialized) return;
        
        // Only perform calculations if we have a valid birthdate
        if (!this.isValidBirthdate()) {
            this.clearResults();
            return;
        }

        const userConfig = this.getConfigFromHTML();
        const salaryInputs = this.collectSalaryInputs();
        
        // Calculate age and year ranges
        const age_start = userConfig.birthdate[1] !== 12 ? 17 : 18;
        const ages = [];
        const years = [];
        
        for (let age = age_start; age <= 72; age++) {
            ages.push(age);
            years.push(userConfig.birthdate[0] + age + 1);
        }
        
        // Calculate percentages
        const percentages = years.map(year => 
            year < userConfig.current_year ? userConfig.percentage_before : userConfig.percentage_after
        );
        
        // Debug: Log the percentages array to see what values are being used
        console.log('Percentages array:', percentages);
        console.log('User config - percentage_before:', userConfig.percentage_before, 'percentage_after:', userConfig.percentage_after);
        console.log('Benefit age:', userConfig.benefit_age);
        
        // Calculate benefits for each age
        const results = [];
        for (let i = 0; i < salaryInputs.length; i++) {
            const benefit = calculateBenefit(
                ages,
                salaryInputs,
                percentages,
                years,
                userConfig.benefit_age,
                userConfig.retirement_age,
                userConfig.in_percent,
                userConfig.birthdate,
                this.mga_lookup_table,
                i
            );
            results.push(benefit);
        }
        
        // Update HTML output
        this.updateResults(results);
    }

    updateResults(results) {
        for (let i = 0; i < results.length; i++) {
            const age = 17 + i;
            const outputElement = document.getElementById(`computed_salary_${age}`);
            if (outputElement) {
                const value = results[i];
                if (value === 0 || value === null) {
                    outputElement.textContent = '0';
                } else {
                    // Format with thousands separator
                    outputElement.textContent = Math.round(value).toLocaleString();
                }
            }
        }
    }
}

// Initialize when DOM is loaded
let calculator = null;
document.addEventListener('DOMContentLoaded', async () => {
    calculator = new SalaryCalculator();
    await calculator.initialize();
});

// Make calculator available globally
window.SalaryCalculator = SalaryCalculator;

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runSimulation,
        calculateBenefit,
        loadMGAData,
        config
    };
}

// Original Excel formula reference:
// =IF(I53>=G$18;0;IF(I54>=G$17;0;IF(K54="";IF(I54=$G$17-1;(L54*VLOOKUP(J54;MGA!$A:$C;3;0)/100*100*(MONTH($G$8))/12);L54*VLOOKUP(J54;MGA!$A:$C;3;0)/100*100);IF($G$14=TRUE;K54/100*VLOOKUP(J54;MGA!$A:$C;3;0);K54))))
