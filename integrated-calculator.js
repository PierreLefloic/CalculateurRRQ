/**
 * Integrated Quebec Pension Plan Calculator
 * Combines form management, validation, and real-time calculations
 */

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

// Function to clean numeric values
function cleanNumeric(value) {
    if (typeof value === 'string') {
        const cleaned = value.replace(/\s/g, '').replace(/\$/g, '').replace(/%/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    }
    return value;
}

// Main Integrated Calculator Class
class IntegratedCalculator {
    constructor() {
        this.isInitialized = false;
        this.eventsBound = false;
        this.mgaData = null;
        this.mga_lookup_table = {};
        
        // DOM element references
        this.elements = {};
    }

    async initialize() {
        try {
            // Cache DOM elements
            this.cacheElements();
            
            // Load MGA data
            await this.loadMGAData();
            
            // Set up event listeners (only once)
            this.bindEventListeners();
            
            // Initialize page state
            this.initializePageState();
            
            this.isInitialized = true;
            console.log('Integrated calculator initialized');
        } catch (error) {
            console.error('Failed to initialize calculator:', error);
        }
    }

    cacheElements() {
        // Cache all frequently used DOM elements
        this.elements = {
            birthInput: document.getElementById('inputBirth'),
            yearInput: document.getElementById('inputCurrentYear'),
            beforeCurrentYearInput: document.getElementById('BeforeCurrentYear'),
            afterCurrentYearInput: document.getElementById('AfterCurrentYear'),
            ageExpInput: document.getElementById('AgeExp'),
            inPercentCheckbox: document.getElementById('InPercent'),
            selfEmployedCheckbox: document.getElementById('SelfEmployed'),
            saisieHeader: document.getElementById('saisie-header'),
            salaryIncreaseInput: document.getElementById('SalaryIncrease'),
            retAgeSelect: document.getElementById('RetAge'),
            benAgeSelect: document.getElementById('BenAge'),
            inflationRateInput: document.getElementById('InflationRate')
        };
    }

    async loadMGAData() {
        try {
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
            
            // Fill missing values
            this.fillMissingValues();
            
            return true;
        } catch (error) {
            console.error('Error loading MGA data:', error);
            return false;
        }
    }

    fillMissingValues() {
        const salaryIncrease = this.getConfigValue('SalaryIncrease', 3.0);
        
        // Fill non_arrondi values
        for (let i = 0; i < non_arrondi.length; i++) {
            if (non_arrondi[i] === null && i > 0) {
                non_arrondi[i] = non_arrondi[i-1] * (1 + salaryIncrease/100);
            }
        }
        
        // Fill MGA values
        for (let i = 0; i < MGA.length; i++) {
            if (MGA[i] === null) {
                MGA[i] = Math.floor(non_arrondi[i] / 100) * 100;
            }
        }
        
        // Fill MGAM5 values
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
        
        // Update lookup table
        for (let i = 0; i < MGA_years.length; i++) {
            mga_lookup_table[MGA_years[i]] = MGA[i];
        }
    }

    bindEventListeners() {
        if (this.eventsBound) {
            return;
        }
        this.eventsBound = true;

        // Birth date changes - handles both form updates and calculations
        if (this.elements.birthInput) {
            this.elements.birthInput.addEventListener('change', () => {
                this.handleBirthDateChange();
                this.calculateAll();
            });
            this.elements.birthInput.addEventListener('input', () => {
                this.handleBirthDateChange();
            });
        }

        // Current year changes
        if (this.elements.yearInput) {
            this.elements.yearInput.addEventListener('input', () => {
                this.validateYearInput();
                this.updatePercentageValues();
            });
            this.elements.yearInput.addEventListener('change', () => {
                this.updatePercentageValues();
                this.calculateAll();
            });
            this.elements.yearInput.addEventListener('blur', () => {
                this.validateYearBlur();
            });
        }

        // Percentage inputs
        if (this.elements.beforeCurrentYearInput) {
            this.elements.beforeCurrentYearInput.addEventListener('input', () => {
                this.updatePercentageValues();
            });
            this.elements.beforeCurrentYearInput.addEventListener('change', () => {
                this.updatePercentageValues();
                this.calculateAll();
            });
        }

        if (this.elements.afterCurrentYearInput) {
            this.elements.afterCurrentYearInput.addEventListener('input', () => {
                this.updatePercentageValues();
            });
            this.elements.afterCurrentYearInput.addEventListener('change', () => {
                this.updatePercentageValues();
                this.calculateAll();
            });
        }

        // Age expectancy validation
        if (this.elements.ageExpInput) {
            this.elements.ageExpInput.addEventListener('blur', () => {
                this.validateAgeExpectancy();
            });
            this.elements.ageExpInput.addEventListener('change', () => {
                this.calculateAll();
            });
        }

        // Checkboxes
        if (this.elements.inPercentCheckbox) {
            this.elements.inPercentCheckbox.addEventListener('change', () => {
                this.handlePercentCheckboxChange();
                this.calculateAll();
            });
        }

        if (this.elements.selfEmployedCheckbox) {
            this.elements.selfEmployedCheckbox.addEventListener('change', () => {
                this.calculateAll();
            });
        }

        // Configuration selects and inputs
        ['retAgeSelect', 'benAgeSelect', 'inflationRateInput'].forEach(elementKey => {
            if (this.elements[elementKey]) {
                this.elements[elementKey].addEventListener('change', () => {
                    this.calculateAll();
                });
            }
        });

        // Special handling for SalaryIncrease - needs to reload MGA data
        if (this.elements.salaryIncreaseInput) {
            this.elements.salaryIncreaseInput.addEventListener('change', async () => {
                await this.loadMGAData();
                this.calculateAll();
            });
        }

        // Salary input fields (17 to 72)
        for (let age = 17; age <= 72; age++) {
            const input = document.getElementById(`salary_${age}`);
            if (input) {
                input.addEventListener('change', () => this.calculateAll());
                
                // Make Enter key behave like Tab for salary inputs
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.moveToNextSalaryInput(age);
                    }
                });

                // Add paste functionality for the first salary input (age 17)
                if (age === 17) {
                    input.addEventListener('paste', (e) => {
                        this.handleSalaryPaste(e);
                    });
                }
            }
        }

        // Auto-select input content functionality
        this.setupAutoSelectInputs();
    }

    initializePageState() {
        // Set current year as default
        const currentYear = new Date().getFullYear();
        if (this.elements.yearInput) {
            this.elements.yearInput.value = currentYear;
        }

        // Initialize salary grid years and percentage values
        this.updateSalaryGridYears();
        setTimeout(() => {
            this.updatePercentageValues();
        }, 100);
    }

    handleBirthDateChange() {
        this.updateSalaryGridYears();
        setTimeout(() => {
            this.updatePercentageValues();
        }, 100);
    }

    updateSalaryGridYears() {
        if (!this.elements.birthInput) return;
        
        const birthDateValue = this.elements.birthInput.value;
        if (birthDateValue) {
            // Parse date manually to avoid timezone issues
            const dateParts = birthDateValue.split('-');
            if (dateParts.length === 3) {
                const birthYear = parseInt(dateParts[0]);
                const birthMonth = parseInt(dateParts[1]);
                const birthDay = parseInt(dateParts[2]);
                
                // Update years for ages 17 to 72
                for (let age = 17; age <= 72; age++) {
                    const yearElement = document.getElementById(`year_${age}`);
                    if (yearElement) {
                        yearElement.textContent = birthYear + age + 1;
                    }
                }
                
                // Handle graying out for age 17 if birth month is December (12)
                const age17Elements = [
                    document.getElementById('age_17'),
                    document.getElementById('year_17'),
                    document.getElementById('salary_17'),
                    document.getElementById('percentage_17'),
                    document.getElementById('computed_salary_17')
                ];
                
                if (birthMonth === 12) {
                    // Gray out age 17 row and disable input
                    age17Elements.forEach(element => {
                        if (element) {
                            element.classList.add('grayed-out');
                        }
                    });
                    const salary17Input = document.getElementById('salary_17');
                    if (salary17Input) {
                        salary17Input.disabled = true;
                    }
                } else {
                    // Remove gray out and enable input
                    age17Elements.forEach(element => {
                        if (element) {
                            element.classList.remove('grayed-out');
                        }
                    });
                    const salary17Input = document.getElementById('salary_17');
                    if (salary17Input) {
                        salary17Input.disabled = false;
                    }
                }
            }
        }
    }

    updatePercentageValues() {
        if (!this.elements.yearInput || !this.elements.beforeCurrentYearInput || !this.elements.afterCurrentYearInput) {
            return;
        }

        const currentYear = parseInt(this.elements.yearInput.value);
        const beforeCurrentYearValue = this.elements.beforeCurrentYearInput.value;
        const afterCurrentYearValue = this.elements.afterCurrentYearInput.value;
        
        if (!isNaN(currentYear) && beforeCurrentYearValue && afterCurrentYearValue) {
            // Update percentage values for ages 17 to 72
            for (let age = 17; age <= 72; age++) {
                const yearElement = document.getElementById(`year_${age}`);
                const percentageElement = document.getElementById(`percentage_${age}`);
                
                if (yearElement && percentageElement) {
                    const rowYear = parseInt(yearElement.textContent);
                    
                    if (!isNaN(rowYear)) {
                        if (rowYear < currentYear) {
                            percentageElement.textContent = beforeCurrentYearValue + '%';
                        } else {
                            percentageElement.textContent = afterCurrentYearValue + '%';
                        }
                    }
                }
            }
        }
    }

    validateYearInput() {
        if (!this.elements.yearInput) return;
        
        // Remove invalid characters (keep only numbers)
        this.elements.yearInput.value = this.elements.yearInput.value.replace(/[^0-9]/g, '');
        
        // Limit to 4 digits
        if (this.elements.yearInput.value.length > 4) {
            this.elements.yearInput.value = this.elements.yearInput.value.slice(0, 4);
        }
    }

    validateYearBlur() {
        if (!this.elements.yearInput) return;
        
        const value = parseInt(this.elements.yearInput.value);
        const currentYear = new Date().getFullYear();
        
        if (isNaN(value) || value < 1900 || value > 2100) {
            this.elements.yearInput.setCustomValidity(translations[currentLanguage].yearValidation);
            this.elements.yearInput.reportValidity();
            this.elements.yearInput.value = currentYear;
        } else {
            this.elements.yearInput.setCustomValidity('');
        }
    }

    validateAgeExpectancy() {
        if (!this.elements.ageExpInput) return;
        
        const value = parseInt(this.elements.ageExpInput.value);
        const defaultValue = 85;
        
        if (!Number.isInteger(Number(this.elements.ageExpInput.value)) || value < 60 || value > 120) {
            this.elements.ageExpInput.setCustomValidity(translations[currentLanguage].ageValidation);
            this.elements.ageExpInput.reportValidity();
            this.elements.ageExpInput.value = defaultValue;
        } else {
            this.elements.ageExpInput.setCustomValidity('');
        }
    }

    handlePercentCheckboxChange() {
        if (!this.elements.inPercentCheckbox || !this.elements.saisieHeader) return;
        
        if (this.elements.inPercentCheckbox.checked) {
            this.elements.saisieHeader.innerHTML = '<strong>' + translations[currentLanguage].inputPercent + '</strong>';
        } else {
            this.elements.saisieHeader.innerHTML = '<strong>' + translations[currentLanguage].inputDollar + '</strong>';
        }
    }

    setupAutoSelectInputs() {
        const allInputs = document.querySelectorAll('input[type="number"], input[type="date"], .salary-grid input');
        
        allInputs.forEach(input => {
            input.addEventListener('click', function() {
                if (!this.disabled) {
                    this.select();
                }
            });
            
            input.addEventListener('focus', function(e) {
                if (!this.disabled) {
                    setTimeout(() => {
                        this.select();
                    }, 10);
                }
            });
        });
    }

    moveToNextSalaryInput(currentAge) {
        // Find the next enabled salary input field
        for (let nextAge = currentAge + 1; nextAge <= 72; nextAge++) {
            const nextInput = document.getElementById(`salary_${nextAge}`);
            if (nextInput && !nextInput.disabled) {
                nextInput.focus();
                nextInput.select();
                return;
            }
        }
        
        // If we reach the end (age 72), we could focus on another element
        // or just blur the current input to trigger calculation
        const currentInput = document.getElementById(`salary_${currentAge}`);
        if (currentInput) {
            currentInput.blur();
        }
    }

    handleSalaryPaste(e) {
        e.preventDefault();
        
        // Get the pasted data
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        
        // Split by newlines and/or tabs to handle Excel column data
        const values = paste.split(/[\n\t\r]+/).filter(val => val.trim() !== '');
        
        if (values.length === 0) return;
        
        // Clean and validate the values
        const cleanedValues = values.map(val => {
            // Remove common formatting (spaces, commas, dollar signs)
            const cleaned = val.trim().replace(/[$,\s]/g, '');
            const number = parseFloat(cleaned);
            return isNaN(number) ? null : Math.max(0, number); // Ensure non-negative
        }).filter(val => val !== null);
        
        if (cleanedValues.length === 0) return;
        
        // Fill the salary inputs starting from age 17
        let filledCount = 0;
        for (let i = 0; i < cleanedValues.length && i < 56; i++) { // Max 56 fields (17 to 72)
            const age = 17 + i;
            const input = document.getElementById(`salary_${age}`);
            
            if (input && !input.disabled) {
                input.value = cleanedValues[i];
                filledCount++;
            }
        }
        
        // Show feedback to user
        console.log(`Pasted ${filledCount} salary values from Excel data`);
        
        // Trigger calculation after pasting
        this.calculateAll();
        
        // Optionally show a brief visual feedback
        const firstInput = document.getElementById('salary_17');
        if (firstInput) {
            firstInput.style.backgroundColor = '#e8f5e8';
            setTimeout(() => {
                firstInput.style.backgroundColor = '';
            }, 1000);
        }
    }

    // Quebec Pension Plan Calculation Functions
    getConfigValue(id, defaultValue) {
        const element = document.getElementById(id);
        if (element && element.value) {
            const value = parseFloat(element.value);
            return isNaN(value) ? defaultValue : value;
        }
        return defaultValue;
    }

    isValidBirthdate() {
        if (!this.elements.birthInput || !this.elements.birthInput.value) {
            return false;
        }
        
        // Parse date string manually to avoid timezone issues
        const dateString = this.elements.birthInput.value;
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
        
        // Check if date is reasonable
        const currentYear = new Date().getFullYear();
        
        return year >= (currentYear - 120) && year <= currentYear &&
               month >= 1 && month <= 12 &&
               day >= 1 && day <= 31;
    }

    getConfigFromHTML() {
        // Parse birthdate manually to avoid timezone issues
        let birthdate = [1980, 11, 15]; // Default fallback
        
        if (this.elements.birthInput && this.elements.birthInput.value) {
            const dateString = this.elements.birthInput.value;
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
            in_percent: this.elements.inPercentCheckbox ? this.elements.inPercentCheckbox.checked : false,
            retirement_age: this.getConfigValue('RetAge', 71),
            benefit_age: this.getConfigValue('BenAge', 60),
            expected_lifespan: this.getConfigValue('AgeExp', 95),
            self_employed: this.elements.selfEmployedCheckbox ? this.elements.selfEmployedCheckbox.checked : false,
            inflation_rate: this.getConfigValue('InflationRate', 2.1),
            salary_increase: this.getConfigValue('SalaryIncrease', 3.0)
        };
    }

    collectSalaryInputs() {
        const userConfig = this.getConfigFromHTML();
        const age_start = userConfig.birthdate[1] !== 12 ? 17 : 18;
        
        const inputs = [];
        for (let age = age_start; age <= 72; age++) {
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
        for (let age = 17; age <= 72; age++) {
            const computedElement = document.getElementById(`computed_salary_${age}`);
            if (computedElement) {
                computedElement.textContent = '';
            }
        }
    }

    // Excel formula converted to JavaScript
    calculateBenefit(ages, inputs, percentages, years, benefit_age, retirement_age, in_percent, birthdate, mga_lookup_table, i) {
        // Level 1: Check if previous age >= benefit age
        if (i === 0 && ages[i] >= benefit_age) {
            return 0;
        }
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
                const vlookupResult = mga_lookup_table[years[i]] || 0;
                const monthFromDate = birthdate[1]; // Month number
                
                // Pro-rated calculation with month factor
                const result = (percentages[i] * vlookupResult / 100 * 100 * monthFromDate / 12);
                return result;
            }
            // Level 4a2: Special case when input is empty AND age equals 17 (pro-rating for first year)
            else if (ages[i] === 17) {
                const vlookupResult = mga_lookup_table[years[i]] || 0;
                const monthFromDate = birthdate[1]; // Month number
                
                // Pro-rated calculation: months from month AFTER birth month to end of year (December)
                // Contributions start the month after birthday
                // If born in January (1), start contributing in February, work 11 months
                // If born in November (11), start contributing in December, work 1 month
                // If born in December (12), start contributing in January of next year, work 0 months (handled by age 18)
                const monthsToWork = Math.max(0, 12 - monthFromDate); // Start contributing month after birthday
                const result = (percentages[i] * vlookupResult / 100 * 100 * monthsToWork / 12);
                return result;
            }
            // Level 4b: Input is empty but age is NOT retirement_age-1 or 17
            else {
                const vlookupResult = mga_lookup_table[years[i]] || 0;
                const result = percentages[i] * vlookupResult / 100 * 100;
                return result;
            }
        }
        // Level 5: Input has a value, check if in_percent is TRUE
        else {
            if (in_percent === true) {
                const vlookupResult = mga_lookup_table[years[i]] || 0;
                const result = inputValue / 100 * vlookupResult;
                return result;
            } else {
                return inputValue;
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
        
        // Calculate percentages based on year comparison
        const percentages = years.map(year => 
            year < userConfig.current_year ? userConfig.percentage_before : userConfig.percentage_after
        );
        
        // Calculate benefits for each age
        const results = [];
        for (let i = 0; i < salaryInputs.length; i++) {
            const benefit = this.calculateBenefit(
                ages,
                salaryInputs,
                percentages,
                years,
                userConfig.benefit_age,
                userConfig.retirement_age,
                userConfig.in_percent,
                userConfig.birthdate,
                mga_lookup_table,
                i
            );
            results.push(benefit);
        }
        
        // Update HTML output
        this.updateResults(results);
    }

    updateResults(results) {
        const userConfig = this.getConfigFromHTML();
        const age_start = userConfig.birthdate[1] !== 12 ? 17 : 18;
        
        // Clear all results first
        for (let age = 17; age <= 72; age++) {
            const outputElement = document.getElementById(`computed_salary_${age}`);
            if (outputElement) {
                outputElement.textContent = '0';
            }
        }
        
        // Update results starting from the correct age
        for (let i = 0; i < results.length; i++) {
            const age = age_start + i;
            const outputElement = document.getElementById(`computed_salary_${age}`);
            if (outputElement) {
                const value = results[i];
                if (value === 0 || value === null) {
                    outputElement.textContent = '0';
                } else {
                    outputElement.textContent = Math.round(value).toLocaleString();
                }
            }
        }
    }
}

// Global calculator instance
let integratedCalculator = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Prevent duplicate initialization
    if (integratedCalculator) {
        return;
    }
    
    integratedCalculator = new IntegratedCalculator();
    await integratedCalculator.initialize();
});

// Make calculator available globally
window.IntegratedCalculator = IntegratedCalculator;
window.integratedCalculator = integratedCalculator;
