/**
 * TRI Calculator - Taux de Rendement Interne
 * Financial calculations for Quebec Pension Plan (RRQ)
 */

// Financial data - RRQ parameters and MGA values
const FinancialData = {
  // Maximum Pensionable Earnings (MGA) by year
  mga: {
    2024: 65400,
    2025: 66580,
    2026: 68960,
    2027: 71140,
    2028: 73440,
    2029: 75860,
    2030: 78220,
    2031: 80640,
    2032: 83140,
    2033: 85720,
    2034: 88380,
    2035: 91120,
    // Add more years as needed...
  },

  // Basic exemption amount (MSGA)
  basicExemption: {
    2024: 3500,
    2025: 3500,
    2026: 3600,
    2027: 3700,
    2028: 3800,
    2029: 3900,
    2030: 4000,
    // Add more years as needed...
  },

  // Contribution rates
  rates: {
    employee: 0.0595,  // 5.95%
    employer: 0.0595,  // 5.95%
    total: 0.119       // 11.9%
  },

  // Inflation and growth assumptions
  assumptions: {
    inflation: 0.02,           // 2%
    salaryGrowth: 0.025,      // 2.5%
    investmentReturn: 0.04     // 4%
  }
};

/**
 * TRI Calculator Class
 */
class TRICalculator {
  constructor() {
    this.data = FinancialData;
  }

  /**
   * Calculate age range based on birth date
   * @param {Object} birthdate - {year, month, day}
   * @returns {Array} Array of ages from start to 72
   */
  calculateAgeRange(birthdate) {
    const ageStart = birthdate.month === 12 ? 18 : 17;
    const ages = [];
    for (let age = ageStart; age <= 72; age++) {
      ages.push(age);
    }
    return ages;
  }

  /**
   * Calculate corresponding years based on birth date and ages
   * @param {Object} birthdate - {year, month, day}
   * @param {Array} ages - Array of ages
   * @returns {Array} Array of corresponding years
   */
  calculateYears(birthdate, ages) {
    return ages.map(age => birthdate.year + age + 1);
  }

  /**
   * Get MGA value for a specific year
   * @param {number} year 
   * @returns {number} MGA value
   */
  getMGA(year) {
    return this.data.mga[year] || this.estimateMGA(year);
  }

  /**
   * Get basic exemption for a specific year
   * @param {number} year 
   * @returns {number} Basic exemption amount
   */
  getBasicExemption(year) {
    return this.data.basicExemption[year] || this.estimateBasicExemption(year);
  }

  /**
   * Estimate MGA for years not in data (using inflation)
   * @param {number} year 
   * @returns {number} Estimated MGA
   */
  estimateMGA(year) {
    const lastKnownYear = Math.max(...Object.keys(this.data.mga).map(Number));
    const lastKnownMGA = this.data.mga[lastKnownYear];
    const yearsDiff = year - lastKnownYear;
    return Math.round(lastKnownMGA * Math.pow(1 + this.data.assumptions.inflation, yearsDiff));
  }

  /**
   * Estimate basic exemption for years not in data
   * @param {number} year 
   * @returns {number} Estimated basic exemption
   */
  estimateBasicExemption(year) {
    const lastKnownYear = Math.max(...Object.keys(this.data.basicExemption).map(Number));
    const lastKnownExemption = this.data.basicExemption[lastKnownYear];
    const yearsDiff = year - lastKnownYear;
    return Math.round(lastKnownExemption * Math.pow(1 + this.data.assumptions.inflation, yearsDiff));
  }

  /**
   * Calculate annual contribution
   * @param {number} salary - Annual salary
   * @param {number} mga - Maximum pensionable earnings
   * @param {number} exemption - Basic exemption amount
   * @returns {number} Annual contribution amount
   */
  calculateContribution(salary, mga, exemption) {
    const pensionableSalary = Math.min(salary, mga);
    const contributableSalary = Math.max(0, pensionableSalary - exemption);
    return contributableSalary * this.data.rates.total;
  }

  /**
   * Main TRI calculation function
   * @param {Object} userInputs - All user inputs from the form
   * @returns {Array} Array of calculation results by year
   */
  calculateTRI(userInputs) {
    const {
      birthdate,
      currentYear,
      retirementAge,
      benefitAge,
      lifeExpectancy,
      salaryData,
      salaryGrowthBefore,
      salaryGrowthAfter
    } = userInputs;

    const ages = this.calculateAgeRange(birthdate);
    const years = this.calculateYears(birthdate, ages);
    const results = [];

    let accumulatedBenefit2064 = 0;
    let accumulatedBenefit2025 = 0;

    for (let i = 0; i < ages.length; i++) {
      const age = ages[i];
      const year = years[i];
      const salary = salaryData[age] || 0;

      // Get RRQ parameters for this year
      const mga = this.getMGA(year);
      const exemption = this.getBasicExemption(year);

      // Calculate contribution
      const contribution = this.calculateContribution(salary, mga, exemption);

      // Calculate TRI (simplified version - you'll need to implement the full logic)
      const tri = this.calculateTRIForYear(age, year, salary, contribution, retirementAge);

      // Calculate benefits (placeholder - implement your benefit calculation logic)
      const additionalBenefit2064 = this.calculateAdditionalBenefit(contribution, year, 2064);
      const additionalBenefit2025 = this.calculateAdditionalBenefit(contribution, year, 2025);
      
      accumulatedBenefit2064 += additionalBenefit2064;
      accumulatedBenefit2025 += additionalBenefit2025;

      // Years until retirement
      const yearsToRetirement = Math.max(0, retirementAge - age);

      results.push({
        age,
        year,
        tri: tri.toFixed(2) + '%',
        salary,
        mga,
        exemption,
        contribution: Math.round(contribution),
        accumulatedBenefit2064: Math.round(accumulatedBenefit2064),
        additionalBenefit2064: Math.round(additionalBenefit2064),
        accumulatedBenefit2025: Math.round(accumulatedBenefit2025),
        additionalBenefit2025: Math.round(additionalBenefit2025),
        yearsToRetirement
      });
    }

    return results;
  }

  /**
   * Calculate TRI for a specific year (placeholder - implement your TRI calculation logic)
   * @param {number} age 
   * @param {number} year 
   * @param {number} salary 
   * @param {number} contribution 
   * @param {number} retirementAge 
   * @returns {number} TRI percentage
   */
  calculateTRIForYear(age, year, salary, contribution, retirementAge) {
    // This is a placeholder - implement your actual TRI calculation logic here
    // Based on your simulation.py file
    const yearsToRetirement = retirementAge - age;
    const baseTRI = 6.0; // Base TRI rate
    const ageAdjustment = (age - 30) * 0.01; // Adjust based on age
    return Math.max(0, baseTRI + ageAdjustment);
  }

  /**
   * Calculate additional benefit for a specific year
   * @param {number} contribution 
   * @param {number} contributionYear 
   * @param {number} targetYear 
   * @returns {number} Additional benefit amount
   */
  calculateAdditionalBenefit(contribution, contributionYear, targetYear) {
    // This is a placeholder - implement your actual benefit calculation logic
    const yearsToTarget = targetYear - contributionYear;
    const growthRate = this.data.assumptions.investmentReturn;
    return contribution * Math.pow(1 + growthRate, yearsToTarget) * 0.1; // Simplified calculation
  }

  /**
   * Collect all form data and format for calculation
   * @returns {Object} Formatted user inputs
   */
  collectFormData() {
    // Birth date
    const birthInput = document.getElementById('inputBirth').value;
    const birthDate = new Date(birthInput);
    const birthdate = {
      year: birthDate.getFullYear(),
      month: birthDate.getMonth() + 1,
      day: birthDate.getDate()
    };

    // Other inputs
    const currentYear = parseInt(document.getElementById('inputCurrentYear').value);
    const retirementAge = parseInt(document.getElementById('RetAge').value);
    const benefitAge = parseInt(document.getElementById('BenAge').value);
    const lifeExpectancy = parseInt(document.getElementById('AgeExp').value);
    const salaryGrowthBefore = parseFloat(document.getElementById('BeforeCurrentYear').value) / 100;
    const salaryGrowthAfter = parseFloat(document.getElementById('AfterCurrentYear').value) / 100;

    // Collect salary data from the grid
    const salaryData = {};
    for (let age = 17; age <= 72; age++) {
      const salaryInput = document.getElementById(`salary_${age}`);
      if (salaryInput && !salaryInput.disabled) {
        salaryData[age] = parseFloat(salaryInput.value) || 0;
      }
    }

    return {
      birthdate,
      currentYear,
      retirementAge,
      benefitAge,
      lifeExpectancy,
      salaryData,
      salaryGrowthBefore,
      salaryGrowthAfter
    };
  }

  /**
   * Update the results table with calculated data
   * @param {Array} results - Calculation results
   */
  updateResultsTable(results) {
    const tableContainer = document.querySelector('.results-table');
    
    // Clear existing data rows (keep headers)
    const existingDataCells = tableContainer.querySelectorAll('.results-cell');
    existingDataCells.forEach(cell => cell.remove());

    // Add new data rows
    results.forEach(result => {
      // Create cells for each column
      const cells = [
        result.age,
        result.year,
        result.tri,
        result.salary.toLocaleString(),
        result.mga.toLocaleString(),
        result.exemption.toLocaleString(),
        result.contribution.toLocaleString(),
        result.accumulatedBenefit2064.toLocaleString(),
        result.additionalBenefit2064.toLocaleString(),
        result.accumulatedBenefit2025.toLocaleString(),
        result.additionalBenefit2025.toLocaleString(),
        result.yearsToRetirement
      ];

      cells.forEach(cellData => {
        const cell = document.createElement('div');
        cell.className = 'results-cell';
        cell.textContent = cellData;
        tableContainer.appendChild(cell);
      });
    });
  }

  /**
   * Main function to run the complete TRI calculation
   */
  runSimulation() {
    try {
      // Collect form data
      const userInputs = this.collectFormData();
      
      // Validate inputs
      if (!this.validateInputs(userInputs)) {
        throw new Error('Please fill in all required fields correctly.');
      }

      // Calculate TRI
      const results = this.calculateTRI(userInputs);
      
      // Update results table
      this.updateResultsTable(results);
      
      console.log('TRI Simulation completed successfully', results);
      return results;
      
    } catch (error) {
      console.error('Error running TRI simulation:', error);
      alert('Error running simulation: ' + error.message);
      return null;
    }
  }

  /**
   * Validate user inputs
   * @param {Object} inputs 
   * @returns {boolean} True if valid
   */
  validateInputs(inputs) {
    // Add validation logic here
    if (!inputs.birthdate.year || inputs.birthdate.year < 1900 || inputs.birthdate.year > 2100) {
      return false;
    }
    
    if (!inputs.currentYear || inputs.currentYear < 1900 || inputs.currentYear > 2100) {
      return false;
    }
    
    // Add more validation as needed
    return true;
  }
}

// Export for use in other files
window.TRICalculator = TRICalculator;
