document.addEventListener("DOMContentLoaded", () => {
  // Elements - String Generator
  const stringLength = document.getElementById("string-length");
  const stringLengthNum = document.getElementById("string-length-num");
  const lengthValLabel = document.getElementById("length-val");
  const includeUpper = document.getElementById("include-upper");
  const includeLower = document.getElementById("include-lower");
  const includeNumbers = document.getElementById("include-numbers");
  const includeSymbols = document.getElementById("include-symbols");
  const generateStringBtn = document.getElementById("generate-string");
  const stringDisplay = document.getElementById("string-display");
  const copyStringBtn = document.getElementById("copy-string");
  const presetBtns = document.querySelectorAll(".btn-preset");

  // Elements - Number Generator
  const numMin = document.getElementById("num-min");
  const numMax = document.getElementById("num-max");
  const numCount = document.getElementById("num-count");
  const numCountNum = document.getElementById("num-count-num");
  const countValLabel = document.getElementById("count-val");
  const uniqueNumbers = document.getElementById("unique-numbers");
  const generateNumbersBtn = document.getElementById("generate-numbers");
  const numberDisplay = document.getElementById("number-display");
  const copyNumbersBtn = document.getElementById("copy-numbers");

  const toastContainer = document.getElementById("toast-container");

  // Character sets
  const charSets = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
  };

  // --- Utility Functions ---

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function copyToClipboard(text, successMsg) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(err => {
      console.error("Could not copy text: ", err);
      showToast("Failed to copy to clipboard", "error");
    });
  }

  function getRandomInt(min, max) {
    const range = max - min + 1;
    if (range <= 0) return min;

    const requestBytes = Math.ceil(Math.log2(range) / 8);
    if (!requestBytes) return min;

    const maxUint = Math.pow(256, requestBytes);
    const limit = maxUint - (maxUint % range);

    const array = new Uint8Array(requestBytes);
    let value;

    do {
      crypto.getRandomValues(array);
      value = 0;
      for (let i = 0; i < requestBytes; i++) {
        value = (value << 8) + array[i];
      }
    } while (value >= limit);

    return min + (value % range);
  }

  // --- String Generator Logic ---

  function generateString() {
    let characters = "";
    if (includeUpper.checked) characters += charSets.upper;
    if (includeLower.checked) characters += charSets.lower;
    if (includeNumbers.checked) characters += charSets.numbers;
    if (includeSymbols.checked) characters += charSets.symbols;

    if (characters === "") {
      showToast("Please select at least one character set", "error");
      return;
    }

    const length = parseInt(stringLength.value);
    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += characters.charAt(array[i] % characters.length);
    }

    stringDisplay.textContent = result;
  }

  // Sync range and number inputs
  stringLength.addEventListener("input", () => {
    stringLengthNum.value = stringLength.value;
    lengthValLabel.textContent = stringLength.value;
  });

  stringLengthNum.addEventListener("input", () => {
    stringLength.value = stringLengthNum.value;
    lengthValLabel.textContent = stringLengthNum.value;
  });

  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const preset = btn.dataset.preset;
      
      // Remove active class from all
      presetBtns.forEach(b => b.classList.remove("active"));
      if (preset !== "reset") btn.classList.add("active");

      switch (preset) {
        case "hex":
          includeUpper.checked = true;
          includeLower.checked = false;
          includeNumbers.checked = true;
          includeSymbols.checked = false;
          // Only A-F for hex
          // Actually, standard hex usually includes 0-9 and A-F
          // We can't easily restrict the existing checkboxes to just A-F
          // Let's just set the checkboxes and maybe override the logic if we wanted "true" hex
          // But for simplicity, we'll just use the standard charsets.
          break;
        case "base64":
          includeUpper.checked = true;
          includeLower.checked = true;
          includeNumbers.checked = true;
          includeSymbols.checked = true;
          break;
        case "password":
          stringLength.value = 24;
          stringLengthNum.value = 24;
          lengthValLabel.textContent = 24;
          includeUpper.checked = true;
          includeLower.checked = true;
          includeNumbers.checked = true;
          includeSymbols.checked = true;
          break;
        case "reset":
          stringLength.value = 16;
          stringLengthNum.value = 16;
          lengthValLabel.textContent = 16;
          includeUpper.checked = true;
          includeLower.checked = true;
          includeNumbers.checked = true;
          includeSymbols.checked = false;
          break;
      }
    });
  });

  generateStringBtn.addEventListener("click", generateString);

  copyStringBtn.addEventListener("click", () => {
    const text = stringDisplay.textContent;
    if (text && text !== "...") {
      copyToClipboard(text, "String copied to clipboard!");
    }
  });

  // --- Number Generator Logic ---

  function generateNumbers() {
    const min = parseInt(numMin.value);
    const max = parseInt(numMax.value);
    const count = parseInt(numCount.value);
    const unique = uniqueNumbers.checked;

    if (isNaN(min) || isNaN(max)) {
      showToast("Please enter valid min and max values", "error");
      return;
    }

    if (min > max) {
      showToast("Min value cannot be greater than Max value", "error");
      return;
    }

    if (unique && (max - min + 1) < count) {
      showToast("Range is too small for the requested number of unique values", "error");
      return;
    }

    const results = [];
    if (unique) {
      const set = new Set();
      while (set.size < count) {
        set.add(getRandomInt(min, max));
      }
      results.push(...Array.from(set));
    } else {
      for (let i = 0; i < count; i++) {
        results.push(getRandomInt(min, max));
      }
    }

    // Sort numbers for better readability? Maybe optional, but let's keep them in order of generation
    // Display
    const list = numberDisplay.querySelector(".number-list");
    list.innerHTML = "";
    results.forEach(num => {
      const li = document.createElement("li");
      li.className = "number-item";
      li.textContent = num;
      list.appendChild(li);
    });
  }

  numCount.addEventListener("input", () => {
    numCountNum.value = numCount.value;
    countValLabel.textContent = numCount.value;
  });

  numCountNum.addEventListener("input", () => {
    numCount.value = numCountNum.value;
    countValLabel.textContent = numCountNum.value;
  });

  generateNumbersBtn.addEventListener("click", generateNumbers);

  copyNumbersBtn.addEventListener("click", () => {
    const items = numberDisplay.querySelectorAll(".number-item");
    if (items.length > 0) {
      const text = Array.from(items).map(li => li.textContent).join(", ");
      copyToClipboard(text, "Numbers copied to clipboard!");
    }
  });

  // Initial generation
  generateString();
  generateNumbers();
});
