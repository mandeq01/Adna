/* ======================================================
          GLOBAL DATA
====================================================== */
let users = []; // Store users for Login/Signup
let transactions = []; // Store income/expenses
let currentUser = null; // Store currently logged-in user

/* ======================================================
          LOGIN PAGE
====================================================== */
if(document.getElementById("loginBtn")){
    document.getElementById("loginBtn").addEventListener("click", function(){
        let username = document.getElementById("lname").value.trim();
        let password = document.getElementById("lpass").value.trim();
        let loginError = document.getElementById("loginError");

        if(username === "" || password === ""){
            loginError.textContent = "Please fill all fields!";
            return;
        }

        let user = users.find(u => u.username === username && u.password === password);
        if(user){
            currentUser = user;
            loginError.style.color = "green";
            loginError.textContent = "Login successful! Redirecting...";
            setTimeout(() => window.location.href = "home.html", 1000);
        } else {
            loginError.style.color = "red";
            loginError.textContent = "Invalid username or password!";
        }
    });
}

/* ======================================================
          SIGNUP PAGE
====================================================== */
if(document.getElementById("signupForm")){
    document.getElementById("signupForm").addEventListener("submit", function(e){
        e.preventDefault();
        let fullname = document.getElementById("fullname").value.trim();
        let email = document.getElementById("email").value.trim();
        let username = document.getElementById("newUsername").value.trim();
        let password = document.getElementById("newPassword").value.trim();
        let confirmPassword = document.getElementById("confirmPassword").value.trim();
        let signupError = document.getElementById("signupError");

        if(fullname === "" || email === "" || username === "" || password === "" || confirmPassword === ""){
            signupError.style.color = "red";
            signupError.textContent = "All fields are required!";
            return;
        }

        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            signupError.style.color = "red";
            signupError.textContent = "Invalid email format!";
            return;
        }

        if(password !== confirmPassword){
            signupError.style.color = "red";
            signupError.textContent = "Passwords do not match!";
            return;
        }

        if(users.find(u => u.username === username)){
            signupError.style.color = "red";
            signupError.textContent = "Username already exists!";
            return;
        }

        users.push({ username, password, fullname, email });
        signupError.style.color = "green";
        signupError.textContent = "Account created successfully! Redirecting...";
        setTimeout(() => window.location.href = "login.html", 2000);
    });
}

/* ======================================================
          LOGOUT BUTTON (ALL PAGES)
====================================================== */
if(document.getElementById("logoutBtn")){
    document.getElementById("logoutBtn").addEventListener("click", () => {
        currentUser = null;
        alert("Logged out successfully!");
        window.location.href = "login.html";
    });
}

/* ======================================================
          HOME PAGE
====================================================== */
if(document.getElementById("welcomeMsg")){
    document.getElementById("welcomeMsg").textContent = `Welcome, ${currentUser ? currentUser.username : "User"}!`;

    function calculateSummary(){
        let totalIncome = transactions.filter(t => t.type==="income").reduce((sum, t)=>sum+t.amount,0);
        let totalExpense = transactions.filter(t => t.type==="expense").reduce((sum, t)=>sum+t.amount,0);
        let balance = totalIncome - totalExpense;

        if(document.getElementById("totalIncome")) document.getElementById("totalIncome").textContent = `$${totalIncome.toFixed(2)}`;
        if(document.getElementById("totalExpense")) document.getElementById("totalExpense").textContent = `$${totalExpense.toFixed(2)}`;
        if(document.getElementById("currentBalance")) document.getElementById("currentBalance").textContent = `$${balance.toFixed(2)}`;
        if(document.getElementById("reportIncome")) document.getElementById("reportIncome").textContent = `$${totalIncome.toFixed(2)}`;
        if(document.getElementById("reportExpense")) document.getElementById("reportExpense").textContent = `$${totalExpense.toFixed(2)}`;
        if(document.getElementById("reportBalance")) document.getElementById("reportBalance").textContent = `$${balance.toFixed(2)}`;
    }

    function updateTransactionTable(){
        let tbody = document.getElementById("transactionTable") || document.getElementById("allTransactionsTable");
        if(!tbody) return;
        tbody = tbody.getElementsByTagName("tbody")[0];
        tbody.innerHTML = "";

        if(transactions.length === 0){
            tbody.innerHTML = `<tr><td colspan="5">No transactions yet.</td></tr>`;
            return;
        }

        transactions.slice(-5).reverse().forEach(t=>{
            let row = tbody.insertRow();
            row.insertCell(0).textContent = t.date;
            row.insertCell(1).textContent = t.type;
            row.insertCell(2).textContent = t.category || "-";
            row.insertCell(3).textContent = t.description;
            row.insertCell(4).textContent = `$${t.amount.toFixed(2)}`;
        });
    }

    calculateSummary();
    updateTransactionTable();
}

/* ======================================================
          TRACKER PAGE
====================================================== */
if(document.getElementById("incomeForm")){
    document.getElementById("incomeForm").addEventListener("submit", function(e){
        e.preventDefault();
        let source = document.getElementById("incomeSource").value.trim();
        let amount = parseFloat(document.getElementById("incomeAmount").value);
        let incomeError = document.getElementById("incomeError");

        if(source === "" || isNaN(amount) || amount <= 0){
            incomeError.textContent = "Please enter valid source and amount!";
            return;
        }

        incomeError.textContent = "";
        let date = new Date().toLocaleDateString();
        transactions.push({ type: "income", amount, description: source, date, category: source });

        document.getElementById("incomeSource").value = "";
        document.getElementById("incomeAmount").value = "";

        calculateSummary();
        updateTransactionTable();
    });
}

if(document.getElementById("expenseForm")){
    document.getElementById("expenseForm").addEventListener("submit", function(e){
        e.preventDefault();
        let item = document.getElementById("expenseItem").value.trim();
        let category = document.getElementById("expenseCategory").value;
        let amount = parseFloat(document.getElementById("expenseAmount").value);
        let expenseError = document.getElementById("expenseError");

        if(item === "" || category === "" || isNaN(amount) || amount <= 0){
            expenseError.textContent = "Please fill all fields correctly!";
            return;
        }

        expenseError.textContent = "";
        let date = new Date().toLocaleDateString();
        transactions.push({ type: "expense", amount, description: item, date, category });

        document.getElementById("expenseItem").value = "";
        document.getElementById("expenseCategory").value = "";
        document.getElementById("expenseAmount").value = "";

        calculateSummary();
        updateTransactionTable();
    });
}

/* ======================================================
          REPORTS PAGE
====================================================== */
function updateReports(){
    let totalIncome = transactions.filter(t=>t.type==="income").reduce((sum,t)=>sum+t.amount,0);
    let totalExpense = transactions.filter(t=>t.type==="expense").reduce((sum,t)=>sum+t.amount,0);
    let balance = totalIncome - totalExpense;

    if(document.getElementById("reportIncome")) document.getElementById("reportIncome").textContent = `$${totalIncome.toFixed(2)}`;
    if(document.getElementById("reportExpense")) document.getElementById("reportExpense").textContent = `$${totalExpense.toFixed(2)}`;
    if(document.getElementById("reportBalance")) document.getElementById("reportBalance").textContent = `$${balance.toFixed(2)}`;

    // Expenses by category
    let categoryTotals = {};
    transactions.filter(t=>t.type==="expense").forEach(t=>{
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    let tbody = document.getElementById("categoryTable")?.getElementsByTagName("tbody")[0];
    if(tbody){
        tbody.innerHTML = "";
        if(Object.keys(categoryTotals).length === 0){
            tbody.innerHTML = `<tr><td colspan="2">No data available</td></tr>`;
        } else {
            for(let cat in categoryTotals){
                let row = tbody.insertRow();
                row.insertCell(0).textContent = cat;
                row.insertCell(1).textContent = `$${categoryTotals[cat].toFixed(2)}`;
            }
        }
    }

    renderChart(categoryTotals);
}

function renderChart(categoryTotals){
    let canvas = document.getElementById("expenseChart");
    if(!canvas) return;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);

    let total = Object.values(categoryTotals).reduce((sum,val)=>sum+val,0);
    let startAngle = 0;
    let colors = ["#4caf50","#f44336","#2196f3","#ff9800","#9c27b0"];
    let i = 0;

    for(let cat in categoryTotals){
        let sliceAngle = 2 * Math.PI * (categoryTotals[cat]/total);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, canvas.height/2);
        ctx.arc(canvas.width/2, canvas.height/2, 80, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i%colors.length];
        ctx.fill();
        startAngle += sliceAngle;
        i++;
    }

    // Simple legend
    i = 0;
    let legendX = 200, legendY = 10;
    ctx.font = "14px Arial";
    for(let cat in categoryTotals){
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(legendX, legendY + i*25, 20, 20);
        ctx.fillStyle = "#000";
        ctx.fillText(`${cat} ($${categoryTotals[cat].toFixed(2)})`, legendX+30, legendY + 15 + i*25);
        i++;
    }
}

updateReports();

/* ======================================================
          CONTACT PAGE
====================================================== */
if(document.getElementById("contactForm")){
    document.getElementById("contactForm").addEventListener("submit", function(e){
        e.preventDefault();
        let name = document.getElementById("contactName").value.trim();
        let email = document.getElementById("contactEmail").value.trim();
        let message = document.getElementById("contactMessage").value.trim();
        let feedback = document.getElementById("contactFeedback");

        if(name === "" || email === "" || message === ""){
            feedback.style.color = "red";
            feedback.textContent = "All fields are required!";
            return;
        }

        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            feedback.style.color = "red";
            feedback.textContent = "Please enter a valid email!";
            return;
        }

        feedback.style.color = "green";
        feedback.textContent = "Message sent successfully! Thank you.";
        document.getElementById("contactForm").reset();
    });
}
