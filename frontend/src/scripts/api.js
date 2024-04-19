import { BACKEND_URL } from "./config.js";

export async function sendScore(username, score, distance) {
    const response = await fetch(`${BACKEND_URL}/users/sendScore`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, score, distance }),
    });
    return response.json();
}