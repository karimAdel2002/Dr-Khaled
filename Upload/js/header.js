// Get the modals
var mobileModal = document.getElementById("mobileModal");
var desktopModal = document.getElementById("desktopModal");

// Variable to track whether the modal has been shown
var modalShown = false;

// Function to detect screen size and show the correct modal
function showModal() {
  if (!modalShown) {
    if (window.innerWidth <= 1000) {
      // Show mobile modal, hide desktop modal
      mobileModal.style.display = "block";
      desktopModal.style.display = "none";
    } else {
      // Show desktop modal, hide mobile modal
      mobileModal.style.display = "none";
      desktopModal.style.display = "block";
    }
    // Set the flag to true after the modal is displayed
    modalShown = true;
  }
}

// Close the modal when clicking anywhere outside the modal content
window.onclick = function (event) {
  if (event.target == mobileModal) {
    mobileModal.style.display = "none";
  } else if (event.target == desktopModal) {
    desktopModal.style.display = "none";
  }
};

// Trigger the modal logic when the page loads
window.onload = showModal;
