import { sendScore,getLeaderboard } from "./api.js";

function drawLeaderboard(user) {
    const table = document.getElementById('table-body');
    table.innerHTML = "";

    for (const user of users){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.maxScore}</td>
            <td>${user.maxDistance}</td>
        `;
        table.appendChild(row);
    }
}

