/**
 * TRI Calculator - Calculation Logic
 * Handles TRI (Taux de Rendement Interne) calculations and results generation
 */

/**
 * TRI Calculator Class
 * This will contain the actual calculation logic for the TRI simulation
 */
class TRICalculator {
  constructor() {
    this.salaryData = {};
    this.parameters = {};
    this.results = null;
  }
  
  /**
   * Initialize calculator with form data
   */
  initialize(formData) {
    this.parameters = {
      birthDate: formData.birthDate,
      currentYear: formData.currentYear,
      retirementAge: formData.retirementAge,
      benefitAge: formData.benefitAge,
      lifeExpectancy: formData.lifeExpectancy,
      isSelfEmployed: formData.isSelfEmployed,
      inflationRate: formData.inflationRate,
      salaryGrowthRate: formData.salaryGrowthRate,
      beforeCurrentYearPercentage: formData.beforeCurrentYearPercentage,
      afterCurrentYearPercentage: formData.afterCurrentYearPercentage,
      isPercentageInput: formData.isPercentageInput
    };
    
    this.collectSalaryData();
  }
  
  /**
   * Collect salary data from the form
   */
  collectSalaryData() {
    this.salaryData = {};
    
    // Collect salary inputs for ages 17-72
    for (let age = 17; age <= 72; age++) {
      const salaryInput = document.getElementById(`salary_${age}`);
      if (salaryInput && !salaryInput.disabled) {
        const value = parseFloat(salaryInput.value) || 0;
        this.salaryData[age] = value;
      }
    }
    
    console.log('Salary data collected:', this.salaryData);
  }
  
  /**
   * Calculate TRI based on current parameters and salary data
   * @returns {Object} Calculation results
   */
  calculate() {
    // TODO: Implement actual TRI calculation logic
    // This is a placeholder that returns sample data
    
    console.log('Starting TRI calculation with parameters:', this.parameters);
    console.log('Using salary data:', this.salaryData);
    
    // Placeholder calculation - replace with actual logic
    this.results = this.generateSampleResults();
    
    return this.results;
  }
  
  /**
   * Generate sample results for demonstration
   * TODO: Replace with actual calculation logic
   */
  generateSampleResults() {
    const sampleResults = {
      summary: {
        annualBenefit2025: 17898,
        annualBenefit2030: 21027,
        baseRegime2025: 16645,
        baseRegime2030: 19555,
        supplementary1_2025: 1252,
        supplementary1_2030: 1471,
        supplementary2_2025: 0,
        supplementary2_2030: 0
      },
      detailed: []
    };
    
    // Generate sample detailed results
    let accumulatedBenefit = 0;
    for (let age = 28; age <= 85; age++) {
      const year = 2025 + (age - 28);
      const tri = 6.0 + (age - 28) * 0.05; // Sample TRI calculation
      const contribution = age < 65 ? -1056 : 0; // Sample contribution
      const additionalBenefit = age >= 65 ? 180 + Math.random() * 20 : 0;
      
      accumulatedBenefit += additionalBenefit;
      
      sampleResults.detailed.push({
        age: age,
        year: year,
        tri: tri.toFixed(2),
        contribution: contribution,
        accumulatedBenefit: Math.round(accumulatedBenefit),
        additionalBenefit: Math.round(additionalBenefit)
      });
    }
    
    return sampleResults;
  }
  
  /**
   * Update the results tables with calculated data
   */
  updateResultsTable(results) {
    if (!results) {
      console.error('No results to display');
      return;
    }
    
    // Update summary table
    this.updateSummaryTable(results.summary);
    
    // Update detailed results table
    this.updateDetailedTable(results.detailed);
  }
  
  /**
   * Update the summary results table
   */
  updateSummaryTable(summary) {
    // TODO: Update summary table cells with actual data
    console.log('Updating summary table with:', summary);
    
    // This is where you would update the summary table cells
    // Example:
    // const annualBenefit2025Cell = document.querySelector('.summary-table .results-cell:nth-child(2)');
    // if (annualBenefit2025Cell) {
    //   annualBenefit2025Cell.textContent = summary.annualBenefit2025.toLocaleString() + ' $';
    // }
  }
  
  /**
   * Update the detailed results table
   */
  updateDetailedTable(detailedResults) {
    // TODO: Update detailed results table with calculated data
    console.log('Updating detailed table with:', detailedResults);
    
    // This is where you would update the detailed results table
    // You might need to clear existing rows and create new ones
    // or update existing cells with the calculated values
  }
  
  /**
   * Validate input data before calculation
   */
  validateInputs() {
    const errors = [];
    
    // Check required parameters
    if (!this.parameters.birthDate) {
      errors.push('Date de naissance requise');
    }
    
    if (!this.parameters.currentYear || this.parameters.currentYear < 1900 || this.parameters.currentYear > 2100) {
      errors.push('Année courante invalide');
    }
    
    if (!this.parameters.lifeExpectancy || this.parameters.lifeExpectancy < 60 || this.parameters.lifeExpectancy > 120) {
      errors.push('Espérance de vie invalide');
    }
    
    // Check if at least some salary data is provided
    const salaryValues = Object.values(this.salaryData);
    const hasSalaryData = salaryValues.some(value => value > 0);
    
    if (!hasSalaryData) {
      errors.push('Au moins un salaire doit être spécifié');
    }
    
    return errors;
  }
  
  /**
   * Get form data from the HTML form
   */
  static getFormData() {
    return {
      birthDate: document.getElementById('inputBirth').value,
      currentYear: parseInt(document.getElementById('inputCurrentYear').value),
      retirementAge: parseInt(document.getElementById('RetAge').value),
      benefitAge: parseInt(document.getElementById('BenAge').value),
      lifeExpectancy: parseInt(document.getElementById('AgeExp').value),
      isSelfEmployed: document.getElementById('SelfEmployed').checked,
      inflationRate: parseFloat(document.getElementById('InflationRate').value),
      salaryGrowthRate: parseFloat(document.getElementById('SalaryIncrease').value),
      beforeCurrentYearPercentage: parseFloat(document.getElementById('BeforeCurrentYear').value),
      afterCurrentYearPercentage: parseFloat(document.getElementById('AfterCurrentYear').value),
      isPercentageInput: document.getElementById('InPercent').checked
    };
  }
}

// Make TRICalculator globally available
window.TRICalculator = TRICalculator;

/**
 * Integration function to run calculation from the simulation button
 * This function will be called from the animations.js when the simulation starts
 */
window.runTRICalculation = function() {
  const calculator = new TRICalculator();
  const formData = TRICalculator.getFormData();
  
  // Initialize calculator with form data
  calculator.initialize(formData);
  
  // Validate inputs
  const errors = calculator.validateInputs();
  if (errors.length > 0) {
    console.error('Validation errors:', errors);
    alert('Erreurs de validation:\n' + errors.join('\n'));
    return null;
  }
  
  // Perform calculation
  const results = calculator.calculate();
  
  // Update results tables
  calculator.updateResultsTable(results);
  
  return results;
};
