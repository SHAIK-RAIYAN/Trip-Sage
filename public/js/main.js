document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  const startInput = document.getElementById("startDate");
  const endInput = document.getElementById("endDate");

  if (startInput) startInput.min = today;
  if (endInput) endInput.min = today;

  const form = document.getElementById("trip-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      const startDate = startInput.value;
      const endDate = endInput.value;

      const startError = document.getElementById("error-startDate");
      const endError = document.getElementById("error-endDate");

      let hasError = false;
      startError.classList.add("hidden");
      endError.classList.add("hidden");

      const budgetInput = document.getElementById("budget");
      const travelersInput = document.getElementById("travelers");

      const budgetError = document.getElementById("error-budget");
      const travelersError = document.getElementById("error-travelers");

      // Reset
      budgetError.classList.add("hidden");
      travelersError.classList.add("hidden");

      if (budgetInput.value <= 0) {
        budgetError.textContent = "Budget must be greater than 0.";
        budgetError.classList.remove("hidden");
        hasError = true;
      }

      if (travelersInput.value <= 0) {
        travelersError.textContent = "Number of travelers must be at least 1.";
        travelersError.classList.remove("hidden");
        hasError = true;
      }

      if (hasError) {
        e.preventDefault();
      }

      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
        new Date(startDate) < new Date(today)
      ) {
        startError.textContent = "Start Date must be today or later.";
        startError.classList.remove("hidden");
        hasError = true;
      }

      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(endDate) ||
        new Date(endDate) < new Date(startDate)
      ) {
        endError.textContent = "End Date must be after Start Date.";
        endError.classList.remove("hidden");
        hasError = true;
      }

      if (hasError) {
        e.preventDefault();
      }
    });
  }

  const interests = new Set();
  const selector = document.getElementById("interest-selector");
  const addBtn = document.getElementById("add-interest");
  const selectedWrapper = document.getElementById("selected-interests");
  const hiddenInput = document.getElementById("interests-hidden");

  function renderInterests() {
    selectedWrapper.innerHTML = "";
    interests.forEach((interest) => {
      const tag = document.createElement("span");
      tag.className =
        "bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2";
      tag.innerHTML = `${interest} <button type="button" class="ml-2 text-red-500 font-bold" onclick="removeInterest('${interest}')">×</button>`;
      selectedWrapper.appendChild(tag);
    });
    hiddenInput.value = Array.from(interests).join(",");
  }

  window.removeInterest = function (item) {
    interests.delete(item);
    renderInterests();
  };

  addBtn.addEventListener("click", () => {
    const selected = selector.value;
    if (selected && !interests.has(selected)) {
      interests.add(selected);
      renderInterests();
    }
  });
});
