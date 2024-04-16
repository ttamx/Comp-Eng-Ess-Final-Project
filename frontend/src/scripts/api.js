import { BACKEND_URL } from "./config.js";

export async function getRooms() {
    const response = await fetch(`${BACKEND_URL}/rooms`);
    const data = await response.json();
    return data;
}

export async function getRoomById(id) {
    const response = await fetch(`${BACKEND_URL}/rooms/${id}`);
    const data = await response.json();
    return data;
}

export async function createRoom(roomName, ownerId) {
    const response = await fetch(`${BACKEND_URL}/rooms`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ roomName, ownerId })
    });
    const data = await response.json();
    return data;
}

export async function getUsers() {
    const response = await fetch(`${BACKEND_URL}/users`);
    const data = await response.json();
    return data;
}

export async function getUserById(id) {
    const response = await fetch(`${BACKEND_URL}/users/${id}`);
    const data = await response.json();
    return data;
}

export async function createUser(username, password) {
    console.log(username, password);
    const response = await fetch(`${BACKEND_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    return data;
}

export async function addUserToRoom(roomId, userId) {
    const response = await fetch(`${BACKEND_URL}/rooms/addUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ roomId, userId })
    });
    const data = await response.json();
    return data;
}