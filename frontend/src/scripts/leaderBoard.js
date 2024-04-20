import { getLeaderboard } from "./api.js";

function drawLeaderboard() {
    const table = document.getElementById('table-body');
    table.innerHTML = "";

    getLeaderboard().then((data) => {
        data.forEach((user, index) => {
            const row = table.insertRow();
            const rank = row.insertCell(0);
            const username = row.insertCell(1);
            const score = row.insertCell(2);
            const distance = row.insertCell(3);

            rank.innerHTML = index + 1;
            username.innerHTML = user.username;
            score.innerHTML = user.maxScore;
            distance.innerHTML = user.maxDistance;
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    drawLeaderboard();
});
