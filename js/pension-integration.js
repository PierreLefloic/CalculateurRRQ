/**
 * Integration layer between HTML form and pension calculator
 * Handles user input collection, calculation execution, and results display
 */

class PensionSimulation {
    constructor() {
        this.mgaData = null;
        this.userInput = null;
        this.results = null;
        this.isCalculating = false;
        
        this.initializeEventListeners();
        this.loadMGAData();
    }

    /**
     * Step 1: Initialize event listeners and load MGA data
     */
    initializeEventListeners() {
        // Launch simulation buttons only
        document.getElementById('launchSimulation').addEventListener('click', () => this.launchSimulation());
        document.getElementById('launchSimulation-mobile').addEventListener('click', () => this.launchSimulation());
        
        // Add birthday validation
        this.initializeBirthdayValidation();
    }

    /**
     * Initialize birthday validation to enable/disable simulation buttons
     */
    initializeBirthdayValidation() {
        const birthdayInput = document.getElementById('inputBirth');
        const launchButton = document.getElementById('launchSimulation');
        const launchButtonMobile = document.getElementById('launchSimulation-mobile');
        
        // Function to validate birthday and enable/disable buttons
        const validateBirthday = () => {
            const birthdayValue = birthdayInput.value;
            const isValid = this.isValidBirthday(birthdayValue);
            
            // Enable/disable both buttons
            launchButton.disabled = !isValid;
            launchButtonMobile.disabled = !isValid;
            
            // Add visual feedback classes to buttons
            if (isValid) {
                launchButton.classList.remove('disabled-button');
                launchButtonMobile.classList.remove('disabled-button');
            } else {
                launchButton.classList.add('disabled-button');
                launchButtonMobile.classList.add('disabled-button');
            }
            
            // Add visual feedback classes to birthday input
            birthdayInput.classList.remove('valid', 'invalid');
            if (birthdayValue.trim() !== '') {
                if (isValid) {
                    birthdayInput.classList.add('valid');
                } else {
                    birthdayInput.classList.add('invalid');
                }
            }
        };
        
        // Add event listeners for birthday input changes
        birthdayInput.addEventListener('input', validateBirthday);
        birthdayInput.addEventListener('change', validateBirthday);
        
        // Initial validation on page load
        validateBirthday();
    }

    /**
     * Validate if the birthday is valid for pension calculation
     */
    isValidBirthday(birthdayValue) {
        if (!birthdayValue || birthdayValue.trim() === '') {
            return false;
        }
        
        const birthDate = new Date(birthdayValue);
        const currentYear = parseInt(document.getElementById('inputCurrentYear').value) || new Date().getFullYear();
        const currentDate = new Date(currentYear, 11, 31); // End of current year
        
        // Check if the date is valid
        if (isNaN(birthDate.getTime())) {
            return false;
        }
        
        // // Check if birth date is in the future
        // if (birthDate > currentDate) {
        //     return false;
        // }
        
        // Use the same validation logic as validateInputs()
        const birthYear = birthDate.getFullYear();
        
        // Must be at least 17 years old
        if (birthYear > 2025) {
            return false;
        }
        
        // Must not be more than 100 years old (same as validateInputs)
        if (currentYear - birthYear > 100) {
            return false;
        }
        
        return true;
    }

    /**
     * Load MGA data asynchronously
     */
    async loadMGAData() {
        try {
            console.log('Loading MGA data...');
            const salaryIncrease = parseFloat(document.getElementById('SalaryIncrease').value) || 3.1;
            this.mgaData = new MGAData(salaryIncrease);
            
            // Wait for data to load
            let attempts = 0;
            while (!this.mgaData.isLoaded && attempts < 100) { // Max 10 seconds
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (!this.mgaData.isLoaded) {
                throw new Error('Timeout loading MGA data');
            }
            
            console.log('MGA data loaded successfully');
        } catch (error) {
            console.error('Error loading MGA data:', error);
            alert('Erreur lors du chargement des données MGA. Veuillez recharger la page.');
        }
    }

    /**
     * Step 1: Collect user inputs from HTML form
     */
    collectUserInputs() {
        const userInput = new UserInput();
        
        // Basic personal information
        const birthDate = document.getElementById('inputBirth').value;
        if (birthDate) {
            const date = new Date(birthDate);
            userInput.birth_date = [
                date.getFullYear(),
                date.getMonth() + 1, // JavaScript months are 0-based
                date.getDate()
            ];
        }
        
        userInput.current_year = parseInt(document.getElementById('inputCurrentYear').value) || 2025;
        userInput.ret_age = parseInt(document.getElementById('RetAge').value) || 65;
        userInput.benefit_age = parseInt(document.getElementById('BenAge').value) || 65;
        userInput.lifespan = parseInt(document.getElementById('AgeExp').value) || 95;
        userInput.self_employed = document.getElementById('SelfEmployed').checked;
        
        // Economic parameters
        userInput.inflation = parseFloat(document.getElementById('InflationRate').value) || 2.1;
        userInput.salary_increase = parseFloat(document.getElementById('SalaryIncrease').value) || 3.1;
        
        // Check if we're in percentage mode
        const inPercentMode = document.getElementById('InPercent').checked;
        console.log('Collecting salary data - Percentage mode:', inPercentMode);
        
        // Salary data - always collect from computed values for consistency
        userInput.salary = [];
        
        // Check if birth month is December to determine starting age
        const birthDateInput = document.getElementById('inputBirth').value;
        let startAge = 17;
        if (birthDateInput) {
            const birth = new Date(birthDateInput);
            const birthMonth = birth.getMonth() + 1; // JavaScript months are 0-based
            if (birthMonth === 12) {
                startAge = 18; // Skip age 17 if born in December (grayed out row)
            }
        }
        
        for (let age = startAge; age <= 72; age++) {
            let salaryValue = 0;
            
            // Always use computed salary values from the UI
            const computedElement = document.getElementById(`computed_salary_${age}`);
            if (computedElement && computedElement.textContent) {
                // Remove currency formatting and convert to number
                const computedText = computedElement.textContent.replace(/[^0-9.-]/g, '');
                salaryValue = parseFloat(computedText) || 0;
            }
            
            userInput.salary.push(salaryValue);
        }
        
        console.log('Sample collected salaries (first 10):', userInput.salary.slice(0, 10));
        
        // Apply before/after current year adjustments if in percentage mode
        // const beforeCurrentYear = parseFloat(document.getElementById('BeforeCurrentYear').value) || 100;
        // const afterCurrentYear = parseFloat(document.getElementById('AfterCurrentYear').value) || 100;
        
        // if (inPercentMode && (beforeCurrentYear !== 100 || afterCurrentYear !== 100)) {
        //     // Apply before/after current year adjustments to the computed salaries
        //     this.applyCurrentYearAdjustments(userInput, beforeCurrentYear, afterCurrentYear);
        //     console.log('Applied current year adjustments - Before:', beforeCurrentYear, '% After:', afterCurrentYear, '%');
        // }
        
        return userInput;
    }

    /**
     * Apply before/after current year adjustments to computed salaries
     */
    applyCurrentYearAdjustments(userInput, beforeCurrentYear, afterCurrentYear) {
        if (!this.mgaData) return;
        
        const currentYear = userInput.current_year;
        const birthYear = userInput.birth_date[0];
        const birthMonth = userInput.birth_date[1];
        
        for (let i = 0; i < userInput.salary.length; i++) {
            const age = 17 + i;
            const x = birthMonth === 12 ? 1 : 0;
            const year = birthYear + 18 + x + i;
            
            // Apply before/after current year adjustments
            if (year < currentYear) {
                userInput.salary[i] = (userInput.salary[i] * beforeCurrentYear) / 100;
            } else if (year > currentYear) {
                userInput.salary[i] = (userInput.salary[i] * afterCurrentYear) / 100;
            }
            // Current year stays the same (no adjustment)
        }
    }

    /**
     * Convert percentage inputs to actual salary amounts (legacy method)
     */
    convertPercentageToSalary(userInput, beforeCurrentYear, afterCurrentYear) {
        if (!this.mgaData) return;
        
        const currentYear = userInput.current_year;
        const birthYear = userInput.birth_date[0];
        const birthMonth = userInput.birth_date[1];
        
        for (let i = 0; i < userInput.salary.length; i++) {
            const age = 17 + i;
            const x = birthMonth === 12 ? 1 : 0;
            const year = birthYear + 18 + x + i;
            
            const mgaValue = this.mgaData.mga[year] || 0;
            const percentage = userInput.salary[i] || 0;
            
            // Apply before/after current year adjustments
            let adjustedPercentage = percentage;
            if (year < currentYear) {
                adjustedPercentage = (percentage * beforeCurrentYear) / 100;
            } else if (year > currentYear) {
                adjustedPercentage = (percentage * afterCurrentYear) / 100;
            }
            
            userInput.salary[i] = (mgaValue * adjustedPercentage) / 100;
        }
    }

    /**
     * Step 3: Launch the simulation calculation
     */
    async launchSimulation() {
        if (this.isCalculating) return;
        
        try {
            this.isCalculating = true;
            this.showLoadingOverlay();
            
            // Validate inputs
            if (!this.validateInputs()) {
                this.hideLoadingOverlay();
                this.isCalculating = false;
                return;
            }
            
            // Collect user inputs
            this.userInput = this.collectUserInputs();
            
            // Wait for MGA data if not loaded
            if (!this.mgaData || !this.mgaData.isLoaded) {
                await this.loadMGAData();
            }
            
            // Update MGA data with new salary increase if changed
            const newSalaryIncrease = this.userInput.salary_increase;
            if (Math.abs(newSalaryIncrease - 3.1) > 0.01) {
                this.mgaData = new MGAData(newSalaryIncrease);
                while (!this.mgaData.isLoaded) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                // Note: Form management handles recalculating computed salary values
            }
            
            // Run the calculation
            console.log('Starting pension calculation...');
            console.log('User input:', this.userInput);
            console.log('MGA data loaded:', this.mgaData.isLoaded);
            this.results = results(this.userInput, this.mgaData);
            console.log('Calculation completed:', this.results);
            
            // Step 2: Update summary table
            this.updateSummaryTable();
            
            // Step 4: Update detailed results
            this.updateDetailedResults();
            
            // Scroll to results
            this.scrollToResults();
            
        } catch (error) {
            console.error('Error during simulation:', error);
            alert('Erreur lors de la simulation. Veuillez vérifier vos données et réessayer.');
        } finally {
            this.hideLoadingOverlay();
            this.isCalculating = false;
        }
    }

    /**
     * Step 2: Update the summary table with tab1 results
     */
    updateSummaryTable() {
        if (!this.results || !this.results.summaryResults) return;
        
        const summaryData = this.results.summaryResults;
        
        // Update the first header with the user's current year
        const currentYear = this.userInput ? this.userInput.current_year : 2025;
        const firstHeaderElement = document.querySelector('.summary-table .summary-header[data-i18n="dollarsOf2025"]');
        if (firstHeaderElement) {
            firstHeaderElement.innerHTML = `En dollars de<br>${currentYear}`;
            // Update custom tooltip
            firstHeaderElement.setAttribute('data-tooltip', `Montants en dollars constants de ${currentYear}`);
        }
        
        // Update the second header with the actual benefit start year (G1)
        if (this.results.benefitStartYear) {
            const secondHeaderElement = document.querySelector('.summary-table .summary-header[data-i18n="dollarsOf2030"]');
            if (secondHeaderElement) {
                secondHeaderElement.innerHTML = `En dollars de<br>${this.results.benefitStartYear}`;
                // Update custom tooltip
                secondHeaderElement.setAttribute('data-tooltip', `Montants en dollars constants de ${this.results.benefitStartYear}`);
            }
        }
        
        // Get table cells - they are in a specific order in the HTML
        const cells = document.querySelectorAll('.summary-table .results-cell');
        
        if (cells.length >= 8) {
            // Annual RRQ Benefit (row 1)
            cells[0].textContent = this.formatCurrency(summaryData.tab1_11); // benefit start year dollars
            cells[1].textContent = this.formatCurrency(summaryData.tab1_12); // current year dollars
            
            // Basic Regime (row 2)  
            cells[2].textContent = this.formatCurrency(summaryData.tab1_21); // benefit start year dollars
            cells[3].textContent = this.formatCurrency(summaryData.tab1_22); // current year dollars
            
            // Supplementary Regime - Part 1 (row 3)
            cells[4].textContent = this.formatCurrency(summaryData.tab1_31); // benefit start year dollars
            cells[5].textContent = this.formatCurrency(summaryData.tab1_32); // current year dollars
            
            // Supplementary Regime - Part 2 (row 4)
            cells[6].textContent = this.formatCurrency(summaryData.tab1_41); // benefit start year dollars
            cells[7].textContent = this.formatCurrency(summaryData.tab1_42); // current year dollars
        }
    }

    /**
     * Step 4: Update detailed results table with tab2 data
     */
    updateDetailedResults() {
        if (!this.results || !this.results.detailTable) return;
        
        // Update detailed results headers with dynamic years
        this.updateDetailedResultsHeaders();
        
        const detailData = this.results.detailTable;
        const resultsTable = document.querySelector('#simulation-results .results-table');
        
        // Clear existing data rows (keep headers)
        const existingRows = resultsTable.querySelectorAll('.results-cell');
        existingRows.forEach(cell => cell.remove());
        
        // Add new data rows
        detailData.forEach(row => {
            // Create cells for each column
            const ageCell = document.createElement('div');
            ageCell.className = 'results-cell';
            ageCell.textContent = row.age;
            
            const yearCell = document.createElement('div');
            yearCell.className = 'results-cell';
            yearCell.textContent = row.year;
            
            const triCell = document.createElement('div');
            triCell.className = 'results-cell';
            triCell.textContent = row.tri === 0 ? '-' : `${row.tri.toFixed(2)}%`;
            
            const contributionCell = document.createElement('div');
            contributionCell.className = 'results-cell';
            contributionCell.textContent = this.formatCurrency(row.cotisation_annuelle, false);
            
            const accumulatedCell = document.createElement('div');
            accumulatedCell.className = 'results-cell';
            accumulatedCell.textContent = this.formatCurrency(row.accumulee, false);
            
            const additionalCell = document.createElement('div');
            additionalCell.className = 'results-cell';
            additionalCell.textContent = this.formatCurrency(row.additionnelle, false);
            
            // Append to table
            resultsTable.appendChild(ageCell);
            resultsTable.appendChild(yearCell);
            resultsTable.appendChild(triCell);
            resultsTable.appendChild(contributionCell);
            resultsTable.appendChild(accumulatedCell);
            resultsTable.appendChild(additionalCell);
        });
    }

    /**
     * Update detailed results headers with dynamic years
     */
    updateDetailedResultsHeaders() {
        const currentYear = this.userInput ? this.userInput.current_year : 2025;
        const benefitStartYear = this.results.benefitStartYear;
        
        // Update "Accumulée" header (accumulated benefits) 
        const accumulatedHeader = document.querySelector('.results-header[data-i18n="accumulatedBenefit"]');
        if (accumulatedHeader) {
            accumulatedHeader.innerHTML = `Accumulée<br><small>En dollars de ${currentYear}</small>`;
            accumulatedHeader.setAttribute('data-tooltip', `Montant accumulé des prestations RRQ en dollars constants de ${currentYear}`);
        }
        
        // Update "Additionnelle" header (additional benefits)
        const additionalHeader = document.querySelector('.results-header[data-i18n="additionalBenefit"]');
        if (additionalHeader) {
            additionalHeader.innerHTML = `Additionnelle<br><small>En dollars de ${currentYear}</small>`;
            additionalHeader.setAttribute('data-tooltip', `Montant additionnel des prestations RRQ pour cette année en dollars constants de ${currentYear}`);
        }
    }

    /**
     * Validation of user inputs
     */
    validateInputs() {
        const birthDate = document.getElementById('inputBirth').value;
        const currentYear = parseInt(document.getElementById('inputCurrentYear').value);
        
        if (!birthDate) {
            // alert('Veuillez entrer votre date de naissance.');
            return false;
        }
        
        const birth = new Date(birthDate);
        const birthYear = birth.getFullYear();
        
        // if (birthYear > 2026) {
        //     // alert('Vous devez avoir au moins 17 ans pour utiliser ce simulateur.');
        //     return false;
        // }
        
        if (currentYear - birthYear > 100) {
            // alert('Veuillez vérifier votre date de naissance.');
            return false;
        }
        
        return true;
    }

    /**
     * Utility functions
     */
    formatCurrency(amount, includeDollarSign = true) {
        const formatted = Math.abs(amount).toLocaleString('fr-CA', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        const sign = amount < 0 ? '-' : '';
        const dollarSign = includeDollarSign ? ' $' : '';
        
        return `${sign}${formatted}${dollarSign}`;
    }

    showLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    scrollToResults() {
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Initialize the pension simulation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pensionSimulation = new PensionSimulation();
});