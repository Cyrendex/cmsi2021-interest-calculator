// Cache DOM
const form        = document.getElementById("calcForm");
const rateEl      = document.getElementById("rate");
const rateOut     = document.getElementById("rateOut");
const resultEl    = document.getElementById("result");
const breakdownEl = document.getElementById("breakdown");
const nanBlock    = document.getElementById("nanBlock");

// Slider live output
if (rateEl && rateOut) {
  rateOut.textContent = `${Number(rateEl.value).toFixed(1)}%`;
  rateEl.addEventListener("input", () => {
    rateOut.textContent = `${Number(rateEl.value).toFixed(1)}%`;
  });
}

function roundingPlaces() {
  const picked = document.querySelector('input[name="round"]:checked');
  return picked ? parseInt(picked.value, 10) : 2;
}

function showNaN() {
  resultEl.innerHTML = "";
  if (breakdownEl) {
    breakdownEl.innerHTML = "";
    breakdownEl.hidden = true;
  }
  nanBlock.hidden = false;
}

function hideNaN() {
  nanBlock.hidden = true;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const P = parseFloat(document.getElementById("principal").value);
  const r = parseFloat(document.getElementById("rate").value) / 100;
  const n = parseFloat(document.getElementById("frequency").value);
  const t = parseFloat(document.getElementById("time").value);
  const places = roundingPlaces();
  const showBreakdown = document.getElementById("showBreakdown").checked;

  const invalid = [P, r, n, t].some(Number.isNaN) || P < 0 || n <= 0 || t < 0;
  if (invalid) {
    showNaN();
    return;
  }

  const A = P * Math.pow(1 + r / n, n * t);
  const interest = A - P;

  hideNaN();
  resultEl.innerHTML = `
    <div class="kv">
      <div><strong>Future Value:</strong> $${A.toFixed(places)}</div>
      <div><strong>Total Interest:</strong> $${interest.toFixed(places)}</div>
    </div>
  `;

  if (!breakdownEl) return;

  if (showBreakdown) {
    let rows = "";
    let balance = P;
    const years = Math.floor(t);
    for (let year = 1; year <= years; year++) {
      balance *= Math.pow(1 + r / n, n);
      rows += `<tr><td>${year}</td><td>$${balance.toFixed(places)}</td></tr>`;
    }
    breakdownEl.hidden = false;
    breakdownEl.innerHTML = `
      <h3>Yearly Breakdown</h3>
      <table class="table">
        <thead><tr><th>Year</th><th>End Balance</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="2">No whole years to show.</td></tr>`}</tbody>
      </table>
    `;
  } else {
    breakdownEl.hidden = true;
    breakdownEl.innerHTML = "";
  }
});