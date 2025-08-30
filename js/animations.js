/**
 * TRI Calculator - Animation and UI Effects
 * Handles simulation animations, tooltips, table highlighting, and back-to-top functionality
 */

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeAnimations();
});

function initializeAnimations() {
  setupSimulationButton();
  setupTooltips();
  setupTableHighlighting();
  setupBackToTop();
}

/**
 * Set up simulation button and loading animations
 */
function setupSimulationButton() {
  const launchButton = document.getElementById('launchSimulation');
  const resultsSection = document.querySelector('.results-section');
  const resultsTable = document.querySelector('.results-table');
  const summaryTable = document.querySelector('.summary-table');
  
  if (!launchButton || !resultsSection) return;
  
  launchButton.addEventListener('click', function() {
    startSimulationFlow();
  });
  
  function startSimulationFlow() {
    // Show results section immediately but hide all content
    resultsSection.classList.add('visible');
    
    // Hide all content in results section immediately
    const resultContainers = resultsSection.querySelectorAll('.results-container');
    resultContainers.forEach(container => {
      container.style.display = 'none';
    });
    
    // Create and show blue loading curtain immediately to avoid white flash
    const existingLoader = resultsSection.querySelector('.blue-loading-curtain');
    if (existingLoader) {
      existingLoader.remove();
    }
    
    const blueCurtain = document.createElement('div');
    blueCurtain.className = 'blue-loading-curtain';
    blueCurtain.innerHTML = `
      <div class="loading-spinner"></div>
      <p class="loading-text">Simulation en cours...</p>
    `;
    resultsSection.appendChild(blueCurtain);
    
    // Disable button during simulation
    launchButton.disabled = true;
    launchButton.textContent = 'Simulation en cours...';
    
    // Start scroll animation
    animateScrollToResults(resultsSection, () => {
      startSimulation(blueCurtain, resultContainers);
    });
  }
  
  function animateScrollToResults(targetSection, callback) {
    const startPosition = window.pageYOffset;
    const targetPosition = targetSection.offsetTop;
    const distance = targetPosition - startPosition;
    const duration = 1000; // 1 second
    let start = null;
    
    function smoothScroll(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation
      const ease = percentage < 0.5 
        ? 2 * percentage * percentage 
        : 1 - Math.pow(-2 * percentage + 2, 2) / 2;
      
      window.scrollTo(0, startPosition + (distance * ease));
      
      if (progress < duration) {
        requestAnimationFrame(smoothScroll);
      } else {
        callback();
      }
    }
    
    requestAnimationFrame(smoothScroll);
  }
  
  function startSimulation(blueCurtain, resultContainers) {
    // Start simulation after scrolling completes
    setTimeout(function() {
      // First, fade out the spinner and text immediately
      blueCurtain.classList.add('fade-spinner');
      
      // After spinner fades out, THEN make the layout changes
      setTimeout(function() {
        // Now show content containers and prepare tables (this causes the shift)
        resultContainers.forEach(container => {
          container.style.display = 'block';
        });
        
        // Populate results
        // TODO: Replace this with actual simulation results
        console.log('Simulation completed - results would be populated here');
        
        // Prepare tables for animation
        if (resultsTable) {
          resultsTable.classList.add('fade-in');
          resultsTable.classList.remove('show');
        }
        
        if (summaryTable) {
          summaryTable.classList.add('fade-in');
          summaryTable.classList.remove('show');
        }
        
        // Small delay to ensure DOM changes are complete, then start curtain animation
        setTimeout(function() {
          blueCurtain.classList.add('wipe-down');
          
          // Start smooth scroll at the same time as curtain animation
          setTimeout(function() {
            animateScrollToCenter();
          }, 100); // Small delay to let curtain start moving
          
          // After curtain animation, show the results
          setTimeout(function() {
            if (resultsTable) {
              resultsTable.classList.remove('fade-in');
              resultsTable.classList.add('show');
            }
            
            if (summaryTable) {
              summaryTable.classList.remove('fade-in');
              summaryTable.classList.add('show');
            }
            
            // Remove the blue curtain after animation completes
            setTimeout(function() {
              blueCurtain.remove();
            }, 500);
          }, 800); // Wait for curtain animation
        }, 100); // Small delay for DOM updates
      }, 500); // Wait for spinner fade-out
      
      // Re-enable button
      launchButton.disabled = false;
      launchButton.textContent = 'Lancer la simulation';
    }, 3000); // 3 second delay to demonstrate loading
  }
  
  function animateScrollToCenter() {
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
      const rect = resultsSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = rect.height;
      
      // Calculate scroll to center the results section
      const startPosition = window.scrollY;
      const targetScroll = startPosition + rect.top - (viewportHeight - sectionHeight) / 2;
      const finalTarget = Math.max(0, targetScroll - 200); // Offset by 200px for better positioning
      const distance = finalTarget - startPosition;
      
      // Only scroll if there's a significant distance
      if (Math.abs(distance) > 50) {
        const duration = 800; // 0.8 seconds
        let start = null;
        
        function smoothScrollToResults(timestamp) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          const percentage = Math.min(progress / duration, 1);
          
          // Easing function for smooth animation
          const ease = percentage < 0.5 
            ? 2 * percentage * percentage 
            : 1 - Math.pow(-2 * percentage + 2, 2) / 2;
          
          window.scrollTo(0, startPosition + (distance * ease));
          
          if (progress < duration) {
            requestAnimationFrame(smoothScrollToResults);
          }
        }
        
        requestAnimationFrame(smoothScrollToResults);
      }
    }
  }
}

/**
 * Set up custom tooltip functionality
 */
function setupTooltips() {
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'custom-tooltip';
  document.body.appendChild(tooltip);
  
  // Add event listeners to all results headers with title attributes
  const headersWithTooltips = document.querySelectorAll('.results-header[title]');
  
  headersWithTooltips.forEach(header => {
    // Store the title content and remove the title attribute to prevent default tooltip
    const titleContent = header.getAttribute('title');
    header.removeAttribute('title');
    header.setAttribute('data-tooltip', titleContent);
    
    header.addEventListener('mouseenter', function(e) {
      showTooltip(this, tooltip);
    });
    
    header.addEventListener('mouseleave', function() {
      hideTooltip(tooltip);
    });
  });
  
  function showTooltip(element, tooltip) {
    const title = element.getAttribute('data-tooltip');
    tooltip.textContent = title;
    tooltip.classList.add('show');
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Calculate ideal centered position
    let idealLeft = rect.left + (rect.width / 2) - (280 / 2);
    let top = rect.top - tooltipRect.height - 15;
    
    // Adjust for viewport boundaries
    let actualLeft = idealLeft;
    if (actualLeft < 10) actualLeft = 10;
    if (actualLeft + 280 > window.innerWidth - 10) {
      actualLeft = window.innerWidth - 290;
    }
    
    // Position below if no space above
    let showBelow = false;
    if (top < 10) {
      top = rect.bottom + 15;
      showBelow = true;
    }
    
    tooltip.style.left = actualLeft + 'px';
    tooltip.style.top = top + 'px';
    
    // Calculate arrow position relative to the element center
    const elementCenter = rect.left + (rect.width / 2);
    const tooltipLeft = actualLeft;
    const arrowLeft = elementCenter - tooltipLeft;
    
    // Clamp arrow position to stay within tooltip bounds (with some margin)
    const clampedArrowLeft = Math.max(20, Math.min(260, arrowLeft));
    
    // Update arrow position
    const existingArrow = tooltip.querySelector('.tooltip-arrow');
    if (existingArrow) {
      existingArrow.remove();
    }
    
    const arrow = document.createElement('div');
    arrow.className = 'tooltip-arrow';
    arrow.style.position = 'absolute';
    arrow.style.left = clampedArrowLeft + 'px';
    arrow.style.transform = 'translateX(-50%)';
    arrow.style.border = '8px solid transparent';
    
    if (showBelow) {
      arrow.style.top = '-16px';
      arrow.style.borderBottomColor = '#2c3e50';
    } else {
      arrow.style.bottom = '-16px';
      arrow.style.borderTopColor = '#2c3e50';
    }
    
    tooltip.appendChild(arrow);
  }
  
  function hideTooltip(tooltip) {
    tooltip.classList.remove('show');
  }
}

/**
 * Set up table row/column highlighting
 */
function setupTableHighlighting() {
  function addTableHoverEffects() {
    const resultsTable = document.querySelector('.results-table');
    if (!resultsTable) return;
    
    // Add mousemove listener to the entire table container
    resultsTable.addEventListener('mousemove', function(e) {
      handleTableHover(e);
    });
    
    resultsTable.addEventListener('mouseleave', function() {
      clearHighlights();
    });
  }
  
  function handleTableHover(e) {
    const resultsTable = e.currentTarget;
    const rect = resultsTable.getBoundingClientRect();
    const allCells = Array.from(resultsTable.children);
    
    // Calculate mouse position relative to table
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Find the closest cell based on mouse position
    let closestCell = null;
    let closestDistance = Infinity;
    let closestIndex = -1;
    
    allCells.forEach((cell, index) => {
      const cellRect = cell.getBoundingClientRect();
      const cellX = cellRect.left - rect.left + cellRect.width / 2;
      const cellY = cellRect.top - rect.top + cellRect.height / 2;
      
      const distance = Math.sqrt(Math.pow(mouseX - cellX, 2) + Math.pow(mouseY - cellY, 2));
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestCell = cell;
        closestIndex = index;
      }
    });
    
    if (closestCell) {
      highlightRowAndColumn(closestIndex, allCells);
    }
  }
  
  function highlightRowAndColumn(cellIndex, allCells) {
    const totalColumns = 6;
    
    // Find the actual data start (skip the spanning header row)
    let dataStartIndex = 0;
    
    // Look for the main header row (starts with "Âge")
    for (let i = 0; i < allCells.length; i++) {
      if (allCells[i].textContent.trim() === 'Âge') {
        dataStartIndex = i;
        break;
      }
    }
    
    // If we're in the spanning header area, use different logic
    if (cellIndex < dataStartIndex) {
      // Just highlight the current cell for spanning headers
      clearHighlights();
      allCells[cellIndex].classList.add('highlight-intersection');
      return;
    }
    
    // Calculate row and column relative to the main data area
    const relativeIndex = cellIndex - dataStartIndex;
    const currentRow = Math.floor(relativeIndex / totalColumns);
    const currentCol = relativeIndex % totalColumns;
    const isHeaderRow = currentRow === 0; // Check if we're on the header row
    
    clearHighlights();
    
    // Highlight cells in the main data area
    for (let i = dataStartIndex; i < allCells.length; i++) {
      const relIdx = i - dataStartIndex;
      const cellRow = Math.floor(relIdx / totalColumns);
      const cellCol = relIdx % totalColumns;
      
      // Highlight current row (but skip if hovering over header)
      if (cellRow === currentRow && !isHeaderRow) {
        allCells[i].classList.add('highlight-row');
      }
      
      // Highlight current column (always show column highlight)
      if (cellCol === currentCol) {
        allCells[i].classList.add('highlight-col');
      }
      
      // Highlight intersection (current cell)
      if (cellRow === currentRow && cellCol === currentCol) {
        allCells[i].classList.add('highlight-intersection');
      }
    }
    
    // Always highlight the column header when hovering anywhere in that column
    const headerIndex = dataStartIndex + currentCol;
    if (headerIndex < allCells.length) {
      allCells[headerIndex].classList.add('highlight-col');
    }
  }
  
  function clearHighlights() {
    const allCells = document.querySelectorAll('.results-cell, .results-header');
    allCells.forEach(cell => {
      cell.classList.remove('highlight-row', 'highlight-col', 'highlight-intersection');
    });
  }
  
  // Initialize hover effects
  addTableHoverEffects();
  
  // Re-add hover effects after table is updated
  const originalUpdateTable = window.TRICalculator?.prototype?.updateResultsTable;
  if (originalUpdateTable) {
    window.TRICalculator.prototype.updateResultsTable = function(results) {
      originalUpdateTable.call(this, results);
      setTimeout(addTableHoverEffects, 100); // Small delay to ensure DOM is updated
    };
  }
}

/**
 * Set up back-to-top button functionality
 */
function setupBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.remove('hidden');
    } else {
      backToTopBtn.classList.add('hidden');
    }
  });
  
  // Smooth scroll to top when clicked
  backToTopBtn.addEventListener('click', function() {
    animateScrollToTop();
  });
  
  function animateScrollToTop() {
    const startPosition = window.pageYOffset;
    const duration = 800; // 0.8 seconds
    let start = null;
    
    function smoothScrollToTop(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function for smooth animation
      const ease = percentage < 0.5 
        ? 2 * percentage * percentage 
        : 1 - Math.pow(-2 * percentage + 2, 2) / 2;
      
      window.scrollTo(0, startPosition * (1 - ease));
      
      if (progress < duration) {
        requestAnimationFrame(smoothScrollToTop);
      }
    }
    
    requestAnimationFrame(smoothScrollToTop);
  }
}
