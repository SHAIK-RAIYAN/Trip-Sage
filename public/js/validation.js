document.getElementById("trip-form").addEventListener("submit", function (e) {
  // Map field names to human labels
  const fields = [
    { name: "source", label: "Source" },
    { name: "destination", label: "Destination" },
    { name: "startDate", label: "Start date" },
    { name: "endDate", label: "End date" },
    { name: "budget", label: "Budget" },
    { name: "travelers", label: "Number of travelers" },
  ];

  let hasError = false;

  // Clear old errors
  fields.forEach((f) => {
    const errEl = document.getElementById(`error-${f.name}`);
    errEl.textContent = "";
    errEl.classList.add("hidden");
  });

  // Validate
  fields.forEach((f) => {
    const input = document.getElementById(f.name);
    if (!input.value.trim()) {
      const errEl = document.getElementById(`error-${f.name}`);
      errEl.textContent = `${f.label} is required.`;
      errEl.classList.remove("hidden");
      hasError = true;
    }
  });

  if (hasError) {
    e.preventDefault(); // stop form submission
    // Scroll to first error
    const firstError = document.querySelector("p.text-red-500:not(.hidden)");
    if (firstError)
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
