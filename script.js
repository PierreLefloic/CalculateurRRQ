function runCalc() {
  let a = parseFloat(document.getElementById("inputA").value) || 0;
  let b = parseFloat(document.getElementById("inputB").value) || 0;

  // Example: Excel formula = A1 * B1
  let result = a * b;

  document.getElementById("output").textContent = result.toFixed(2);
}
