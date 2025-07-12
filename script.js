
let transactions = [];
let filter = 'monthly';

document.getElementById("transaction-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const desc = document.getElementById("desc").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;
  if (!desc || isNaN(amount) || !date) return;
  transactions.push({ desc, amount, type, date });
  updateDisplay();
  this.reset();
});

function updateDisplay() {
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";
  const today = new Date();
  const filtered = transactions.filter(t => {
    const d = new Date(t.date);
    if (filter === 'daily') return d.toDateString() === today.toDateString();
    if (filter === 'monthly') return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    if (filter === 'yearly') return d.getFullYear() === today.getFullYear();
    return true;
  });

  filtered.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.type === "income" ? "+" : "-"} ₹${t.amount.toLocaleString('en-IN')} - ${t.desc} (${t.date})`;
    li.style.color = t.type === "income" ? "green" : "red";
    list.appendChild(li);
  });

  const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  document.getElementById("balance-amount").textContent = `₹${(income - expense).toLocaleString('en-IN')}`;
  updateChart(income, expense);
}

const ctx = document.getElementById("financeChart").getContext("2d");
let chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expenses"],
    datasets: [{
      data: [0, 0],
      backgroundColor: ["#4caf50", "#f44336"]
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  }
});

function updateChart(income, expense) {
  chart.data.datasets[0].data = [income, expense];
  chart.update();
}

function setFilter(f) {
  filter = f;
  updateDisplay();
}

function addGoal() {
  const name = document.getElementById("goal-name").value;
  const amount = document.getElementById("goal-amount").value;
  if (!name || !amount) return;
  const li = document.createElement("li");
  li.textContent = `${name} - ₹${parseFloat(amount).toLocaleString('en-IN')}`;
  document.getElementById("goals-list").appendChild(li);
}

function getAISuggestions() {
  const tips = [
    "Track every rupee you spend 🧾",
    "Save before you spend 💡",
    "Avoid impulse purchases 🛑",
    "Use cashback/rewards wisely 🎁",
    "Stick to a weekly budget 📊"
  ];
  document.getElementById("ai-output").textContent = tips[Math.floor(Math.random() * tips.length)];
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}


function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;
  doc.text("FinWise Transaction History", 10, y);
  y += 10;
  transactions.forEach(t => {
    doc.text(`${t.date} - ${t.desc} - ${t.type} - ₹${t.amount.toLocaleString('en-IN')}`, 10, y);
    y += 10;
  });
  doc.save("FinWise_Transactions.pdf");
}

function exportCSV() {
  const csv = Papa.unparse(transactions);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "FinWise_Transactions.csv";
  link.click();
}

AOS.init();
