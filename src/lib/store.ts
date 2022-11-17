import { browser } from "$app/environment";

export const API_HOST = "stuco.online"
export const SECURITY_S = "s"
export const API_BASE = "http" + SECURITY_S + "://" + API_HOST

export async function checkUser() {
    if (!browser) return
    const id = localStorage.getItem("id")
    if (!id) {
        const respRaw = await fetch(API_BASE + "/api/login", {
            method: "POST"
        })
        const resp = await respRaw.text()
        localStorage.setItem("id", resp)
    }
    return
}

export type stat = {
    pictureID: number,
    likes: number
}

export type stats = {
    top10: stat[],
    total: number,
}
