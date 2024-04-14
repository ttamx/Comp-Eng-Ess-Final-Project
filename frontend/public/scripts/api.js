import { BACKEND_URL } from "./config.js";
async function fetchAmountFromAPI() {
    const response = await fetch('link najaaaa');
    if (response.ok) {
        const data = await response.json();
        return data.amount; // Assume the API returns the amount in JSON format
    } else {
        console.error('Failed to fetch amount from API:', response.statusText);
        return 0; // Return a default value in case of failure
    }
}

fetchAmountFromAPI().then(amount => {
    // Update the game state with the fetched amount
    this.tableAmount = amount;
});

async function updateAmountToAPI(newAmount) {
    const response = await fetch('link najaaaa', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: newAmount })
    });
    
    if (!response.ok) {
        console.error('Failed to update amount to API:', response.statusText);
    }
}