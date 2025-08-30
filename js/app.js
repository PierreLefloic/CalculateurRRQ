/**
 * TRI Calculator - Main Application Logic
 * Handles form validation, input management, and salary grid updates
 */

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Get DOM elements
  const yearInput = document.getElementById('inputCurrentYear');
  const ageExpInput = document.getElementById('AgeExp');
  const beforeCurrentYearInput = document.getElementById('BeforeCurrentYear');
  const afterCurrentYearInput = document.getElementById('AfterCurrentYear');
  const birthInput = document.getElementById('inputBirth');
  const inPercentCheckbox = document.getElementById('InPercent');
  const saisieHeader = document.getElementById('saisie-header');
  const currentYear = new Date().getFullYear();
  
  // Set current year as default
  yearInput.value = currentYear;
  
  // Initialize event listeners
  setupEventListeners();
  
  // Initialize page state
  updateSalaryGridYears();
  setTimeout(() => {
    updatePercentageValues();
  }, 100);
  
  /**
   * Set up all event listeners for form inputs
   */
  function setupEventListeners() {
    // Birth date changes
    birthInput.addEventListener('change', handleBirthDateChange);
    birthInput.addEventListener('input', handleBirthDateChange);
    
    // Current year changes
    yearInput.addEventListener('input', updatePercentageValues);
    yearInput.addEventListener('change', updatePercentageValues);
    
    // Year input validation
    yearInput.addEventListener('input', validateYearInput);
    yearInput.addEventListener('blur', validateYearBlur);
    
    // Age expectancy validation
    ageExpInput.addEventListener('blur', validateAgeExpectancy);
    
    // Percentage input changes
    beforeCurrentYearInput.addEventListener('input', updatePercentageValues);
    beforeCurrentYearInput.addEventListener('change', updatePercentageValues);
    
    if (afterCurrentYearInput) {
      afterCurrentYearInput.addEventListener('input', updatePercentageValues);
      afterCurrentYearInput.addEventListener('change', updatePercentageValues);
    }
    
    // InPercent checkbox functionality
    if (inPercentCheckbox && saisieHeader) {
      inPercentCheckbox.addEventListener('change', handlePercentCheckboxChange);
    }
    
    // Auto-select input content functionality
    setupAutoSelectInputs();
    
    // Debug logging for BeforeCurrentYear field
    setupDebugLogging();
  }
  
  /**
   * Handle birth date changes
   */
  function handleBirthDateChange() {
    updateSalaryGridYears();
    setTimeout(() => {
      updatePercentageValues();
    }, 100);
  }
  
  /**
   * Update salary grid years based on birth date
   */
  function updateSalaryGridYears() {
    const birthDateValue = birthInput.value;
    if (birthDateValue) {
      // Parse the date more reliably by splitting the string
      const dateParts = birthDateValue.split('-');
      if (dateParts.length === 3) {
        const birthYear = parseInt(dateParts[0]);
        const birthMonth = parseInt(dateParts[1]); // Already 1-12 format
        const birthDay = parseInt(dateParts[2]);
        
        console.log('Birth date parsed:', { birthYear, birthMonth, birthDay }); // Debug log
        
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
  
  /**
   * Update percentage values in salary grid
   */
  function updatePercentageValues() {
    const currentYear = parseInt(yearInput.value);
    const beforeCurrentYearValue = beforeCurrentYearInput.value;
    const afterCurrentYearValue = afterCurrentYearInput ? afterCurrentYearInput.value : '';
    
    if (!isNaN(currentYear) && beforeCurrentYearValue && afterCurrentYearValue) {
      // Update percentage values for ages 17 to 72
      for (let age = 17; age <= 72; age++) {
        const yearElement = document.getElementById(`year_${age}`);
        const percentageElement = document.getElementById(`percentage_${age}`);
        
        if (yearElement && percentageElement) {
          const rowYear = parseInt(yearElement.textContent);
          
          if (!isNaN(rowYear)) {
            if (rowYear < currentYear) {
              // Years before current year
              percentageElement.textContent = beforeCurrentYearValue + '%';
            } else {
              // Current year and years after (including current year)
              percentageElement.textContent = afterCurrentYearValue + '%';
            }
          }
        }
      }
    }
  }
  
  /**
   * Validate year input (remove non-numeric characters, limit length)
   */
  function validateYearInput() {
    // Remove invalid characters (keep only numbers)
    yearInput.value = yearInput.value.replace(/[^0-9]/g, '');
    
    // Limit to 4 digits
    if (yearInput.value.length > 4) {
      yearInput.value = yearInput.value.slice(0, 4);
    }
  }
  
  /**
   * Validate year input on blur (check range)
   */
  function validateYearBlur() {
    const value = parseInt(yearInput.value);
    
    if (isNaN(value) || value < 1900 || value > 2100) {
      yearInput.setCustomValidity('Veuillez entrer une année valide entre 1900 et 2100');
      yearInput.reportValidity(); // Shows the tooltip
      yearInput.value = currentYear; // Reset to current year
    } else {
      yearInput.setCustomValidity(''); // Clear any previous custom validity
    }
  }
  
  /**
   * Validate age expectancy input
   */
  function validateAgeExpectancy() {
    const value = parseInt(ageExpInput.value);
    const defaultValue = 85;
    
    if (!Number.isInteger(Number(ageExpInput.value)) || value < 60 || value > 120) {
      ageExpInput.setCustomValidity('Veuillez entrer un âge valide entre 60 et 120');
      ageExpInput.reportValidity(); // Shows the tooltip
      ageExpInput.value = defaultValue; // Reset to default value (85)
    } else {
      ageExpInput.setCustomValidity(''); // Clear any previous custom validity
    }
  }
  
  /**
   * Handle percentage checkbox change
   */
  function handlePercentCheckboxChange() {
    if (inPercentCheckbox.checked) {
      saisieHeader.innerHTML = '<strong>Saisie (%)</strong>';
    } else {
      saisieHeader.innerHTML = '<strong>Saisie ($)</strong>';
    }
  }
  
  /**
   * Set up auto-select functionality for all inputs
   */
  function setupAutoSelectInputs() {
    // Select all input fields (both in input-grid and salary-grid)
    const allInputs = document.querySelectorAll('input[type="number"], input[type="date"], .salary-grid input');
    
    allInputs.forEach(input => {
      // Auto-select all content when clicking on the input
      input.addEventListener('click', function() {
        // Only auto-select if the input is not disabled
        if (!this.disabled) {
          this.select();
        }
      });
      
      // Also auto-select when focusing via keyboard (Tab key)
      input.addEventListener('focus', function(e) {
        // Only auto-select if focus came from keyboard (not mouse click)
        // We use a small delay to ensure the click event has been processed
        if (!this.disabled) {
          setTimeout(() => {
            this.select();
          }, 10);
        }
      });
    });
  }
  
  /**
   * Set up debug logging for development
   */
  function setupDebugLogging() {
    beforeCurrentYearInput.addEventListener('input', function() {
      console.log('BeforeCurrentYear input changed to:', this.value);
    });
    
    beforeCurrentYearInput.addEventListener('change', function() {
      console.log('BeforeCurrentYear change event, value:', this.value);
    });
    
    beforeCurrentYearInput.addEventListener('blur', function() {
      console.log('BeforeCurrentYear blur event, value:', this.value);
    });
  }
}
