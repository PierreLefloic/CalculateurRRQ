/**
 * TRI Calculator - Internationalization (i18n)
 * Handles French/English translations
 */

// Translation object
const translations = {
  fr: {
    // Meta
    pageTitle: "Simulateur RRQ",
    logoAlt: "Logo CFFP",
    yearPlaceholder: "AAAA",
    datePlaceholder: "aaaa-mm-jj",
    
    // Header
    title: "Simulateur de la prestation du RRQ",
    description: "Le but du simulateur est de permettre à un utilisateur d'évaluer l'impact de ses cotisations au Régime de rentes du Québec (RRQ) sur sa future prestation de retraite.",
    instructionsTitle: "Mode d'emploi du simulateur",
    instructionsList: `<li><strong>Saisir vos informations de base</strong> : indiquez votre date de naissance ainsi que l'année courante (ou l'année de votre relevé RRQ).</li>
        <li><strong>Entrer vos revenus</strong> : pour chaque année disponible dans votre relevé, saisissez votre salaire (en dollars ou en pourcentage). Vous pouvez également utiliser la boîte Salaire pour estimer rapidement vos revenus.</li>
        <li><strong>Définir vos paramètres personnels</strong> : précisez l'âge prévu de la retraite (arrêt complet du travail), l'âge de demande de prestation, votre espérance de vie ainsi que votre statut (travailleur autonome ou salarié).</li>
        <li><strong>Vérifier les paramètres économiques</strong> : assurez-vous que les hypothèses économiques correspondent à votre situation ou à vos besoins d'analyse.</li>
        <li><strong>Exécuter la simulation</strong> : lancez la simulation pour obtenir vos résultats personnalisés.</li>`,
    resultsTitle: "Résultats présentés",
    resultsDescription: "Pour chacune des années de cotisation, le simulateur affiche les informations suivantes :",
    resultsList: `<li><strong>Taux de rendement interne (TRI)</strong> : indicateur financier qui mesure la rentabilité d'une série de flux monétaires associés aux cotisations et aux prestations.</li>
        <li><strong>Cotisation annuelle</strong> : montant versé au Régime de rentes du Québec (RRQ) pour l'année concernée.</li>
        <li><strong>Prestation annuelle accumulée</strong> : valeur des prestations additionnelles déjà accumulées grâce aux cotisations des années précédentes.</li>
        <li><strong>Prestation annuelle additionnelle</strong> : montant de prestation qui découle directement de la cotisation versée pour l'année en cours.</li>`,
    
    // Form labels
    birthDate: "Date de naissance :",
    currentYear: "Année courante :",
    salary: "Salaire",
    beforeCurrentYear: "Avant année courante (%) :",
    afterCurrentYear: "Après année courante (%) :",
    inPercent: "Saisie en pourcentage :",
    rrqParams: "Paramètres RRQ",
    retirementAge: "Âge de retraite :",
    benefitAge: "Âge de la demande de la prestation\u00A0:",
    lifeExpectancy: "Espérance de vie :",
    selfEmployed: "Travailleur autonome :",
    economicParams: "Paramètres économiques",
    inflationRate: "Taux d'inflation (%) :",
    salaryIncrease: "Croissance des salaires (%) :",
    
    // Salary grid
    salaryGridTitle: "Saisie du salaire pour chaque année",
    age: "Âge",
    year: "Année",
    salary_input: "Saisie ($)",
    percentage: "Pourcentage",
    salary_computed: "Salaire",
    
    // Buttons
    launchSimulation: "Lancer la simulation",
    simulationInProgress: "Simulation en cours...",
    backToTop: "Retour en haut",
    
    // Results
    summaryTitle: "Résumé des prestations",
    detailedResultsTitle: "Résultats détaillés de la simulation",
    dollarsOf2025: "En dollars de<br>{year}",
    dollarsOf2030: "En dollars de<br>{benefitYear}",
    annualRRQBenefit: "Prestation annuelle du RRQ",
    basicRegime: "Régime de base",
    supplementaryRegime1: "Régime supplémentaire - volet 1",
    supplementaryRegime2: "Régime supplémentaire - volet 2",
    annualBenefit: "Prestation annuelle",
    internalReturnRate: "Taux de rendement interne",
    annualContribution: "Cotisation annuelle<br><small>En dollars de {year}</small>",
    accumulatedBenefit: "Accumulée<br><small>En dollars de {year}</small>",
    additionalBenefit: "Additionnelle<br><small>En dollars de {year}</small>",
    
    // Footer
    footerText1: "Travail collectif auquel ont participé <strong>Frédérick Hallé-Rochon</strong>, <strong>Daniel Laverdière</strong> et <strong>Luc Godbout</strong>.",
    footerText2: "Les auteurs collaborent aux travaux de la <a href=\"https://cffp.recherche.usherbrooke.ca/\" target=\"_blank\">Chaire de recherche en fiscalité et en finances publiques</a>, qu'ils remercient pour l'appui financier qui a rendu possible la réalisation de cet outil.",
    footerText3: "Outil interactif conçu et réalisé par <strong>Pierre Lefloïc</strong>.",
    footerText4: "Pour plus d'information, voir l'étude <a href=\"https://cffp.recherche.usherbrooke.ca/projeter-ses-prestations-futures-du-rrq-quel-rendement-procure-chaque-annee-de-cotisations-additionnelles-a-lapproche-de-la-retraite/\" target=\"_blank\">Projeter ses prestations futures du RRQ</a>.",
    
    // Loading
    loadingText: "Simulation en cours...",
    
    // Tooltips
    tooltipAge: "Âge de la personne pour cette année de calcul",
    tooltipYear: "Année civile correspondant à cet âge", 
    tooltipRate: "Taux de rendement interne calculé pour cette année, exprimé en pourcentage",
    tooltipContribution: "Montant de la cotisation annuelle au RRQ en dollars de {year}",
    tooltipAccumulated: "Montant accumulé des prestations RRQ en dollars constants de {year}",
    tooltipAdditional: "Montant additionnel des prestations RRQ pour cette année en dollars constants de {year}",
    tooltipAnnualTotal: "Montant total des prestations annuelles",
    tooltipDollars2025: "Montants en dollars constants de {year}",
    tooltipDollars2030: "Montants en dollars constants de {benefitYear}",
    tooltipAnnualRRQ: "Prestation annuelle totale du Régime de rentes du Québec",
    tooltipBasicRegime: "Montant de la prestation de base du régime",
    tooltipSupp1: "Montant du régime supplémentaire - volet 1",
    tooltipSupp2: "Montant du régime supplémentaire - volet 2",
    
    // Input field tooltips
    tooltipBirthDate: "Entrez votre date de naissance pour calculer votre âge et les années de cotisation",
    tooltipCurrentYear: "Année de référence pour les calculs de la simulation",
    tooltipBeforeCurrentYear: "Pourcentage du salaire à utiliser pour les années avant l'année courante (par défaut 100%)",
    tooltipAfterCurrentYear: "Pourcentage du salaire à utiliser pour les années après l'année courante (par défaut 100%)",
    tooltipInPercent: "Cochez cette case si vous voulez saisir les salaires en pourcentage du MGA plutôt qu'en montants absolus",
    tooltipRetirementAge: "Âge auquel vous prévoyez arrêter de travailler et de cotiser au RRQ",
    tooltipBenefitAge: "Âge auquel vous prévoyez commencer à recevoir votre prestation du RRQ",
    tooltipLifeExpectancy: "Âge jusqu'auquel vous prévoyez recevoir votre prestation du RRQ",
    tooltipSelfEmployed: "Cochez cette case si vous êtes travailleur autonome (cotisations différentes)",
    tooltipInflationRate: "Taux d'inflation annuel prévu pour ajuster les montants futurs",
    tooltipSalaryIncrease: "Taux de croissance annuel prévu des salaires",
    
    // JavaScript dynamic text
    simulationInProgress: "Simulation en cours...",
    validationErrors: "Erreurs de validation",
    inputPercent: "Saisie (%)",
    inputDollar: "Saisie ($)",
    
    // Form validation messages
    yearValidation: "Veuillez entrer une année valide entre 1900 et 2100",
    ageValidation: "Veuillez entrer un âge valide entre 60 et 120",
    
    // Calculator error messages
    currentYearInvalid: "Année courante invalide",
    lifeExpectancyInvalid: "Espérance de vie invalide",
    salaryRequired: "Au moins un salaire doit être spécifié"
  },
  
  en: {
    // Meta
    pageTitle: "QPP Simulator",
    logoAlt: "CFFP Logo",
    yearPlaceholder: "YYYY",
    datePlaceholder: "yyyy-mm-dd",
    
    // Header
    title: "QPP Benefit Simulator",
    description: "The purpose of this simulator is to allow users to evaluate the impact of their contributions to the Quebec Pension Plan (QPP) on their future retirement benefit.",
    instructionsTitle: "How to use the simulator",
    instructionsList: `<li><strong>Enter your basic information</strong>: indicate your date of birth and the current year (or the year of your QPP statement).</li>
        <li><strong>Enter your income</strong>: for each year available in your statement, enter your salary (in dollars or as a percentage). You can also use the Salary box to quickly estimate your income.</li>
        <li><strong>Define your personal parameters</strong>: specify your expected retirement age (complete work stoppage), benefit application age, life expectancy, and status (self-employed or employee).</li>
        <li><strong>Check economic parameters</strong>: ensure that the economic assumptions match your situation or analysis needs.</li>
        <li><strong>Run the simulation</strong>: launch the simulation to get your personalized results.</li>`,
    resultsTitle: "Results presented",
    resultsDescription: "For each contribution year, the simulator displays the following information:",
    resultsList: `<li><strong>Internal Rate of Return (IRR)</strong>: financial indicator that measures the profitability of a series of cash flows associated with contributions and benefits.</li>
        <li><strong>Annual contribution</strong>: amount paid to the Quebec Pension Plan (QPP) for the year in question.</li>
        <li><strong>Accumulated annual benefit</strong>: value of additional benefits already accumulated through contributions from previous years.</li>
        <li><strong>Additional annual benefit</strong>: benefit amount that results directly from the contribution paid for the current year.</li>`,
    
    // Form labels
    birthDate: "Date of birth:",
    currentYear: "Current year:",
    salary: "Salary",
    beforeCurrentYear: "Before current year (%):",
    afterCurrentYear: "After current year (%):",
    inPercent: "Enter as percentage:",
    rrqParams: "QPP Parameters",
    retirementAge: "Retirement age:",
    benefitAge: "Benefit application age:",
    lifeExpectancy: "Life expectancy:",
    selfEmployed: "Self-employed:",
    economicParams: "Economic Parameters",
    inflationRate: "Inflation rate (%):",
    salaryIncrease: "Salary growth (%):",
    
    // Salary grid
    salaryGridTitle: "Salary input for each year",
    age: "Age",
    year: "Year",
    salary_input: "Input ($)",
    percentage: "Percentage",
    salary_computed: "Salary",
    
    // Buttons
    launchSimulation: "Launch simulation",
    simulationInProgress: "Simulation in progress...",
    backToTop: "Back to top",
    
    // Results
    summaryTitle: "Benefit Summary",
    detailedResultsTitle: "Detailed Simulation Results",
    dollarsOf2025: "In {year}<br>dollars",
    dollarsOf2030: "In {benefitYear}<br>dollars",
    annualRRQBenefit: "Annual QPP benefit",
    basicRegime: "Basic plan",
    supplementaryRegime1: "Supplementary plan - component 1",
    supplementaryRegime2: "Supplementary plan - component 2",
    annualBenefit: "Annual benefit",
    internalReturnRate: "Internal rate of return",
    annualContribution: "Annual contribution<br><small>In {year} dollars</small>",
    accumulatedBenefit: "Accumulated<br><small>In {year} dollars</small>",
    additionalBenefit: "Additional<br><small>In {year} dollars</small>",
    
    // Footer
    footerText1: "Collective work involving <strong>Frédérick Hallé-Rochon</strong>, <strong>Daniel Laverdière</strong> and <strong>Luc Godbout</strong>.",
    footerText2: "The authors collaborate with the <a href=\"https://cffp.recherche.usherbrooke.ca/\" target=\"_blank\">Chaire de recherche en fiscalité et en finances publiques</a>, which they thank for the financial support that made this tool possible.",
    footerText3: "Interactive tool designed and developed by <strong>Pierre Lefloïc</strong>.",
    footerText4: "For more information, see the study <a href=\"https://cffp.recherche.usherbrooke.ca/projeter-ses-prestations-futures-du-rrq-quel-rendement-procure-chaque-annee-de-cotisations-additionnelles-a-lapproche-de-la-retraite/\" target=\"_blank\">Projeter ses prestations futures du RRQ</a>.",
    
    // Loading
    loadingText: "Simulation in progress...",
    
    // Tooltips
    tooltipAge: "Person's age for this calculation year",
    tooltipYear: "Calendar year corresponding to this age",
    tooltipRate: "Internal rate of return calculated for this year, expressed as a percentage",
    tooltipContribution: "Annual QPP contribution amount in {year} dollars",
    tooltipAccumulated: "Accumulated QPP benefits amount in constant {year} dollars",
    tooltipAdditional: "Additional QPP benefits amount for this year in constant {year} dollars",
    tooltipAnnualTotal: "Total annual benefits amount",
    tooltipDollars2025: "Amounts in constant {year} dollars",
    tooltipDollars2030: "Amounts in constant {benefitYear} dollars",
    tooltipAnnualRRQ: "Total annual Quebec Pension Plan benefit",
    tooltipBasicRegime: "Basic plan benefit amount",
    tooltipSupp1: "Supplementary plan amount - component 1",
    tooltipSupp2: "Supplementary plan amount - component 2",
    
    // Input field tooltips
    tooltipBirthDate: "Enter your date of birth to calculate your age and contribution years",
    tooltipCurrentYear: "Reference year for simulation calculations",
    tooltipBeforeCurrentYear: "Salary percentage to use for years before the current year (default 100%)",
    tooltipAfterCurrentYear: "Salary percentage to use for years after the current year (default 100%)",
    tooltipInPercent: "Check this box if you want to enter salaries as percentage of YMPE rather than absolute amounts",
    tooltipRetirementAge: "Age at which you plan to stop working and contributing to QPP",
    tooltipBenefitAge: "Age at which you plan to start receiving your QPP benefit",
    tooltipLifeExpectancy: "Age until which you expect to receive your QPP benefit",
    tooltipSelfEmployed: "Check this box if you are self-employed (different contribution rates)",
    tooltipInflationRate: "Expected annual inflation rate to adjust future amounts",
    tooltipSalaryIncrease: "Expected annual salary growth rate",
    
    // JavaScript dynamic text
    simulationInProgress: "Simulation in progress...",
    validationErrors: "Validation errors",
    inputPercent: "Input (%)",
    inputDollar: "Input ($)",
    
    // Form validation messages
    yearValidation: "Please enter a valid year between 1900 and 2100",
    ageValidation: "Please enter a valid age between 60 and 120",
    
    // Calculator error messages
    currentYearInvalid: "Invalid current year",
    lifeExpectancyInvalid: "Invalid life expectancy",
    salaryRequired: "At least one salary must be specified"
  }
};

// Current language state
let currentLanguage = 'fr'; // Default to French

// Initialize i18n system
function initializeI18n() {
  // Check localStorage for saved language preference
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage = savedLanguage;
  } else {
    // Try to detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) {
      currentLanguage = 'en';
    }
  }
  
  // Add event listeners to existing language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      if (lang) {
        setLanguage(lang);
      }
    });
  });
  
  // Apply initial language
  setLanguage(currentLanguage);
}

// Set language and update all text
function setLanguage(lang) {
  if (!translations[lang]) return;
  
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  
  // Update language switcher buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Find button with the matching data-lang attribute
  document.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');
  
  // Update all translatable elements
  updateTranslations();
  
  // Update dynamic JavaScript content
  updateDynamicContent();
}

// Update dynamic content that's set by JavaScript
function updateDynamicContent() {
  // Update salary grid header if it exists
  const saisieHeader = document.querySelector('#saisieHeader strong') || 
                       document.querySelector('[id*="saisie"] strong');
  if (saisieHeader) {
    const inPercentRadio = document.querySelector('#inPercent');
    if (inPercentRadio && inPercentRadio.checked) {
      saisieHeader.parentElement.innerHTML = '<strong>' + translations[currentLanguage].inputPercent + '</strong>';
    } else {
      saisieHeader.parentElement.innerHTML = '<strong>' + translations[currentLanguage].inputDollar + '</strong>';
    }
  }
  
  // Update launch button text if simulation is not in progress
  const launchButton = document.getElementById('launchButton');
  const launchButtonMobile = document.getElementById('launchButtonMobile');
  
  if (launchButton && !launchButton.disabled) {
    launchButton.textContent = translations[currentLanguage].launchSimulation;
  }
  
  if (launchButtonMobile && !launchButtonMobile.disabled) {
    launchButtonMobile.textContent = translations[currentLanguage].launchSimulation;
  }
  
  // Update form validation messages
  const yearInput = document.getElementById('currentYear');
  const ageExpInput = document.getElementById('lifeExpectancy');
  
  if (yearInput) {
    // Re-validate if there was a previous validation error
    const yearValue = parseInt(yearInput.value);
    if (yearValue && (yearValue < 1900 || yearValue > 2100)) {
      yearInput.setCustomValidity(translations[currentLanguage].yearValidation);
    }
  }
  
  if (ageExpInput) {
    // Re-validate if there was a previous validation error  
    const ageValue = parseInt(ageExpInput.value);
    if (ageValue && (ageValue < 60 || ageValue > 120)) {
      ageExpInput.setCustomValidity(translations[currentLanguage].ageValidation);
    }
  }
  
  // Update dynamic result headers if results are visible
  updateDynamicResultHeaders();
}

// Update all text content based on current language
function updateTranslations() {
  const t = translations[currentLanguage];
  
  // Update page title
  const titleElement = document.querySelector('title[data-i18n]');
  if (titleElement) {
    const key = titleElement.getAttribute('data-i18n');
    if (t[key]) {
      titleElement.textContent = t[key];
    }
  }
  
  // Update elements with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (t[key]) {
      if (element.tagName === 'TITLE') {
        element.textContent = t[key];
      } else if (element.innerHTML.includes('<')) {
        element.innerHTML = t[key];
      } else {
        element.textContent = t[key];
      }
    }
  });
  
  // Update alt attributes
  document.querySelectorAll('[data-i18n-alt]').forEach(element => {
    const key = element.getAttribute('data-i18n-alt');
    if (t[key]) {
      element.setAttribute('alt', t[key]);
    }
  });
  
  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    if (t[key]) {
      element.setAttribute('placeholder', t[key]);
    }
  });
  
  // Update tooltips (legacy)
  document.querySelectorAll('[data-tooltip-key]').forEach(element => {
    const key = element.getAttribute('data-tooltip-key');
    if (t[key]) {
      element.setAttribute('data-tooltip', t[key]);
      element.setAttribute('title', t[key]);
    }
  });
  
  // Update title attributes 
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    const key = element.getAttribute('data-i18n-title');
    if (t[key]) {
      element.setAttribute('title', t[key]);
    }
  });
  
  // Update tooltip attributes for custom tooltips
  document.querySelectorAll('[data-i18n-tooltip]').forEach(element => {
    const key = element.getAttribute('data-i18n-tooltip');
    if (t[key]) {
      element.setAttribute('data-tooltip', t[key]);
    }
  });
  
  // Update placeholders
  document.querySelectorAll('[data-placeholder-key]').forEach(element => {
    const key = element.getAttribute('data-placeholder-key');
    if (t[key]) {
      element.setAttribute('placeholder', t[key]);
    }
  });
}

// Update dynamic result headers when language changes
function updateDynamicResultHeaders() {
  // Check if results are visible
  const resultsSection = document.querySelector('.results-section');
  if (!resultsSection || !resultsSection.classList.contains('visible')) {
    return; // No results to update
  }
  
  // Get current year from the current year input
  const currentYearInput = document.getElementById('inputCurrentYear');
  const currentYear = currentYearInput ? parseInt(currentYearInput.value) : 2025;
  
  // Try to get benefit start year from existing header (if available)
  let benefitStartYear = null;
  const secondHeaderElement = document.querySelector('.summary-table .summary-header[data-i18n="dollarsOf2030"]');
  if (secondHeaderElement) {
    // Try to extract year from existing content - works for both languages
    const yearMatch = secondHeaderElement.textContent.match(/\d{4}/);
    if (yearMatch) {
      benefitStartYear = parseInt(yearMatch[0]);
    } else {
      // Fallback: if no year found, check if there's a data attribute or use a reasonable default
      // Try to get it from a global variable if available from the pension calculator
      if (window.lastSimulationResults && window.lastSimulationResults.benefitStartYear) {
        benefitStartYear = window.lastSimulationResults.benefitStartYear;
      } else {
        // Last resort: use current year + 40 as an estimate (typical retirement age)
        benefitStartYear = currentYear + 40;
      }
    }
  }
  
  // Update summary table headers
  const firstHeaderElement = document.querySelector('.summary-table .summary-header[data-i18n="dollarsOf2025"]');
  if (firstHeaderElement) {
    const firstHeaderText = t('dollarsOf2025', { year: currentYear });
    const firstTooltip = t('tooltipDollars2025', { year: currentYear });
    firstHeaderElement.innerHTML = firstHeaderText;
    firstHeaderElement.setAttribute('data-tooltip', firstTooltip);
  }
  
  if (secondHeaderElement && benefitStartYear) {
    const secondHeaderText = t('dollarsOf2030', { benefitYear: benefitStartYear });
    const secondTooltip = t('tooltipDollars2030', { benefitYear: benefitStartYear });
    secondHeaderElement.innerHTML = secondHeaderText;
    secondHeaderElement.setAttribute('data-tooltip', secondTooltip);
  }
  
  // Update detailed results headers
  const contributionHeader = document.querySelector('.results-header[data-i18n="annualContribution"]');
  if (contributionHeader) {
    const contributionText = t('annualContribution', { year: currentYear });
    const contributionTooltip = t('tooltipContribution', { year: currentYear });
    contributionHeader.innerHTML = contributionText;
    contributionHeader.setAttribute('data-tooltip', contributionTooltip);
  }
  
  const accumulatedHeader = document.querySelector('.results-header[data-i18n="accumulatedBenefit"]');
  if (accumulatedHeader) {
    const accumulatedText = t('accumulatedBenefit', { year: currentYear });
    const accumulatedTooltip = t('tooltipAccumulated', { year: currentYear });
    accumulatedHeader.innerHTML = accumulatedText;
    accumulatedHeader.setAttribute('data-tooltip', accumulatedTooltip);
  }
  
  const additionalHeader = document.querySelector('.results-header[data-i18n="additionalBenefit"]');
  if (additionalHeader) {
    const additionalText = t('additionalBenefit', { year: currentYear });
    const additionalTooltip = t('tooltipAdditional', { year: currentYear });
    additionalHeader.innerHTML = additionalText;
    additionalHeader.setAttribute('data-tooltip', additionalTooltip);
  }
}

// Get translated text with placeholder replacement
function t(key, replacements = {}) {
  let text = translations[currentLanguage][key] || key;
  
  // Replace placeholders in the format {placeholder}
  if (replacements && typeof replacements === 'object') {
    Object.keys(replacements).forEach(placeholder => {
      const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
      text = text.replace(regex, replacements[placeholder]);
    });
  }
  
  return text;
}

// Get current language
function getCurrentLanguage() {
  return currentLanguage;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeI18n();
});

// Make functions globally available
window.setLanguage = setLanguage;
window.t = t;
window.getCurrentLanguage = getCurrentLanguage;
