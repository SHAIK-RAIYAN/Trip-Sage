document.addEventListener("DOMContentLoaded", () => {
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
