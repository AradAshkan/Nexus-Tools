(function() {
  // DOM Elements
  const sections = {
    timestamp: document.getElementById('timestamp-section'),
    length: document.getElementById('length-section'),
    weight: document.getElementById('weight-section'),
    temperature: document.getElementById('temperature-section'),
    dateDiff: document.getElementById('date-diff-section')
  };
  
  const categoryBtns = document.querySelectorAll('.cat-btn');
  
  // --- Category Switching ---
  function switchCategory(categoryId) {
    // Deactivate all sections
    Object.values(sections).forEach(section => {
      if (section) section.classList.remove('active-section');
    });
    // Activate selected
    const activeSection = document.getElementById(`${categoryId}-section`);
    if (activeSection) activeSection.classList.add('active-section');
    
    // Update button active styles
    categoryBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-category') === categoryId) {
        btn.classList.add('active');
      }
    });
  }
  
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = btn.getAttribute('data-category');
      if (cat) switchCategory(cat);
    });
  });
  
  // ----- TIMESTAMP & REVERSE (Unix <-> Human) -----
  const unixInput = document.getElementById('unix-input');
  const convertUnixBtn = document.getElementById('convert-unix-btn');
  const unixResult = document.getElementById('unix-result');
  const datetimeLocalInput = document.getElementById('datetime-local-input');
  const convertDateBtn = document.getElementById('convert-date-btn');
  const dateResult = document.getElementById('date-result');
  const currentTsBtn = document.getElementById('current-ts-btn');
  const liveMsSpan = document.getElementById('live-ms-timestamp');
  
  function updateLiveMs() {
    const now = Date.now();
    if (liveMsSpan) liveMsSpan.innerText = `ms: ${now}`;
  }
  setInterval(updateLiveMs, 1000);
  updateLiveMs();
  
  // unix (seconds) -> human readable
  function unixToHuman(unixSeconds) {
    if (isNaN(unixSeconds) || unixSeconds === '') return 'Invalid timestamp';
    const date = new Date(unixSeconds * 1000);
    if (isNaN(date.getTime())) return 'Invalid epoch';
    return date.toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  }
  
  // human date (from datetime-local) -> unix seconds
  function dateToUnix(dateTimeLocalValue) {
    if (!dateTimeLocalValue) return null;
    const dateObj = new Date(dateTimeLocalValue);
    if (isNaN(dateObj.getTime())) return null;
    return Math.floor(dateObj.getTime() / 1000);
  }
  
  convertUnixBtn.addEventListener('click', () => {
    let val = parseFloat(unixInput.value);
    if (isNaN(val)) {
      unixResult.innerText = '⚠️ Please enter a valid number';
      return;
    }
    const human = unixToHuman(val);
    unixResult.innerText = human;
  });
  
  convertDateBtn.addEventListener('click', () => {
    const dtValue = datetimeLocalInput.value;
    if (!dtValue) {
      dateResult.innerText = '⚠️ Select a date & time';
      return;
    }
    const ts = dateToUnix(dtValue);
    if (ts === null) {
      dateResult.innerText = '⚠️ Invalid datetime';
    } else {
      dateResult.innerText = `Unix timestamp: ${ts} seconds`;
    }
  });
  
  currentTsBtn.addEventListener('click', () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    unixInput.value = nowSeconds;
    unixResult.innerText = unixToHuman(nowSeconds);
    // also show in datetime-local
    const nowDate = new Date();
    const isoLocal = nowDate.toISOString().slice(0, 16);
    datetimeLocalInput.value = isoLocal;
    dateResult.innerText = `Unix timestamp: ${nowSeconds} seconds`;
  });
  
  // preset initial current datetime for convenience
  const initNow = new Date();
  datetimeLocalInput.value = initNow.toISOString().slice(0, 16);
  unixInput.value = Math.floor(initNow.getTime() / 1000);
  unixResult.innerText = unixToHuman(unixInput.value);
  
  // ----- LENGTH CONVERTER (cm <-> m <-> mm <-> km) -----
  const lengthValue = document.getElementById('length-value');
  const lengthFrom = document.getElementById('length-from');
  const lengthTo = document.getElementById('length-to');
  const convertLengthBtn = document.getElementById('convert-length-btn');
  const lengthResultSpan = document.getElementById('length-result');
  
  const lengthUnits = {
    cm: 0.01,
    m: 1,
    mm: 0.001,
    km: 1000
  };
  
  function convertLength(value, fromUnit, toUnit) {
    if (isNaN(value)) return 0;
    const meters = value * lengthUnits[fromUnit];
    return meters / lengthUnits[toUnit];
  }
  
  function updateLength() {
    let val = parseFloat(lengthValue.value);
    if (isNaN(val)) val = 0;
    const from = lengthFrom.value;
    const to = lengthTo.value;
    const result = convertLength(val, from, to);
    lengthResultSpan.innerText = `${val} ${from} = ${result.toFixed(4)} ${to}`;
  }
  
  convertLengthBtn.addEventListener('click', updateLength);
  [lengthValue, lengthFrom, lengthTo].forEach(el => el.addEventListener('change', updateLength));
  updateLength();
  
  // ----- WEIGHT CONVERTER (kg, g, lb, oz) -----
  const weightValue = document.getElementById('weight-value');
  const weightFrom = document.getElementById('weight-from');
  const weightTo = document.getElementById('weight-to');
  const convertWeightBtn = document.getElementById('convert-weight-btn');
  const weightResultSpan = document.getElementById('weight-result');
  
  const weightBaseKg = {
    kg: 1,
    g: 0.001,
    lb: 0.45359237,
    oz: 0.028349523125
  };
  
  function convertWeight(value, fromUnit, toUnit) {
    if (isNaN(value)) return 0;
    const kgVal = value * weightBaseKg[fromUnit];
    return kgVal / weightBaseKg[toUnit];
  }
  
  function updateWeight() {
    let val = parseFloat(weightValue.value);
    if (isNaN(val)) val = 0;
    const from = weightFrom.value;
    const to = weightTo.value;
    const result = convertWeight(val, from, to);
    weightResultSpan.innerText = `${val} ${from} = ${result.toFixed(4)} ${to}`;
  }
  
  convertWeightBtn.addEventListener('click', updateWeight);
  [weightValue, weightFrom, weightTo].forEach(el => el.addEventListener('change', updateWeight));
  updateWeight();
  
  // ----- TEMPERATURE CONVERTER -----
  const tempValue = document.getElementById('temp-value');
  const tempFrom = document.getElementById('temp-from');
  const tempTo = document.getElementById('temp-to');
  const convertTempBtn = document.getElementById('convert-temp-btn');
  const tempResultSpan = document.getElementById('temp-result');
  
  function convertTemperature(value, from, to) {
    let celsius = 0;
    if (from === 'c') celsius = value;
    else if (from === 'f') celsius = (value - 32) * 5/9;
    else if (from === 'k') celsius = value - 273.15;
    
    if (to === 'c') return celsius;
    if (to === 'f') return (celsius * 9/5) + 32;
    if (to === 'k') return celsius + 273.15;
    return value;
  }
  
  function updateTemp() {
    let val = parseFloat(tempValue.value);
    if (isNaN(val)) val = 0;
    const from = tempFrom.value;
    const to = tempTo.value;
    let result = convertTemperature(val, from, to);
    let symbol = '';
    if (to === 'c') symbol = '°C';
    else if (to === 'f') symbol = '°F';
    else symbol = 'K';
    tempResultSpan.innerText = `${val} ${from.toUpperCase()} = ${result.toFixed(2)} ${symbol}`;
  }
  
  convertTempBtn.addEventListener('click', updateTemp);
  [tempValue, tempFrom, tempTo].forEach(el => el.addEventListener('change', updateTemp));
  updateTemp();
  
  // ----- DATE DIFFERENCE (days & details) -----
  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  const computeDiffBtn = document.getElementById('compute-diff-btn');
  const diffResultSpan = document.getElementById('diff-result');
  const diffPreciseSpan = document.getElementById('diff-precise');
  
  function computeDateDifference() {
    const startRaw = startDateInput.value;
    const endRaw = endDateInput.value;
    if (!startRaw || !endRaw) {
      diffResultSpan.innerText = 'Please select both dates';
      diffPreciseSpan.innerText = '';
      return;
    }
    const startDate = new Date(startRaw);
    const endDate = new Date(endRaw);
    if (isNaN(startDate) || isNaN(endDate)) {
      diffResultSpan.innerText = 'Invalid date';
      return;
    }
    const diffMs = endDate - startDate;
    const diffDays = Math.floor(diffMs / (1000 * 3600 * 24));
    const diffYears = diffDays / 365.25;
    const absDays = Math.abs(diffDays);
    const sign = diffDays < 0 ? ' (negative: end before start)' : '';
    diffResultSpan.innerText = `📅 Difference: ${diffDays} day(s)${sign} | ~${diffYears.toFixed(2)} years`;
    const hours = Math.floor((diffMs % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((diffMs % (1000 * 3600)) / (1000 * 60));
    diffPreciseSpan.innerText = `Precise: ${absDays} days, ${Math.abs(hours)} hours, ${Math.abs(minutes)} minutes`;
  }
  
  computeDiffBtn.addEventListener('click', computeDateDifference);
  // set some example values
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + 30);
  startDateInput.value = today.toISOString().slice(0,10);
  endDateInput.value = future.toISOString().slice(0,10);
  computeDateDifference();
  
  // additional: dynamic for inputs
  startDateInput.addEventListener('change', computeDateDifference);
  endDateInput.addEventListener('change', computeDateDifference);
  
})();
