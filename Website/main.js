const API_URL = "https://1ahekz6nga.execute-api.us-east-1.amazonaws.com/prod/";

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    document.getElementById("visitor-count").textContent = data.visit_count;
  })
  .catch(error => {
    console.error("Error fetching visitor count:", error);
    document.getElementById("visitor-count").textContent = "Unavailable";
  });