<script lang="ts">
	import NotReady from "$lib/notReady.svelte";
	import { API_HOST, type stats, SECURITY_S } from "$lib/store";
	import { onMount } from "svelte";
	import { flip } from "svelte/animate";
	import { fly } from "svelte/transition";
	import { browser } from "$app/environment";

    let ready = false
    let data:stats | null = null
    let qrDimensions = 0

    onMount(async () => {
        const ws = new WebSocket("ws" + SECURITY_S + "://" + API_HOST + "/api/ws")
        ws.onopen = () => {
            console.log("AAA")
            ready = true
        }
        ws.onmessage = function (ev) {
            console.log(ev)
            const tmp = JSON.parse(ev.data)
            if (tmp.e == "P") {
                ws.send("P")
            } else {
                data = tmp
            }
        }
        refreshQR(window.innerWidth, window.innerHeight)
        qrText = location.origin
    })

    let innerWidth = 0
    let innerHeight = 0

    function refreshQR(width:number, height:number) {
        if (!browser || width == 0) return
        let boxMidWidth = width * 0.6
        let qrWidth = (width - (boxMidWidth > 750 ? 750 : boxMidWidth < 500 ? 500 : boxMidWidth))/2
        qrDimensions = Math.round(height * 0.25 > qrWidth*0.75 ? qrWidth * 0.75 : height * 0.25)
        console.log(width, height, qrDimensions)
    }

    $: refreshQR(innerWidth, innerHeight)

    let qrText = ""

</script>

<svelte:window bind:innerWidth bind:innerHeight />

<style>
    .box {
        display: grid;
        grid-template-columns: 0.5fr clamp(550px, 65vw, 800px) 0.5fr;
    }
    .container {
        height: 86vh;
        width: 95%;
        grid-row: 1;
        grid-column: 2;
        margin: 7vh auto;
        display: grid;
        grid-template-rows: repeat(11, 0.09fr);
        grid-template-columns: 0.175fr 0.700fr 0.125fr;
        align-content: center;
        justify-content: center;
        align-items: center;

        background: var(--accent-2);
        border-radius: 16px;
    }
    .stat {
        font-size: 1.5rem;
    }
    .delta {
        justify-self: center;
    }
    .rank {
        grid-column-start: 1;
        grid-column-end: 1;
        grid-row: var(--rank);
        justify-self: center;
    }
    .rank-info {
        grid-column-start: 2;
        grid-column-end: 4;
        grid-row: var(--index);
        display: grid;
        grid-template-columns: 0.85fr 0.15fr;
        align-content: center;
        justify-content: center;
    }
    .total-b {
        justify-self: center;
    }
    .total {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row: 11;   
    }
    .total-stat {
        grid-column: 3;
        grid-row: 11;
    }
    .total-border {
        --index: 11;
        --color: var(--ico-1)
    }
    .place-border {
        --index: 4;
        --color: var(--color-success);
    }
    .border {
        grid-row: var(--index);
        grid-column-start: 1;
        grid-column-end: 4;
        border-top: var(--color) solid 3px;
        height: 100%;
    }
</style>

{#if ready && data}
    <div class="box">
        <div class="container">
            {#each data.top10 as v, ind (`rank-${ind+1}`)}
                <h3 class="stat rank" style="--rank: {ind+1}">{ind+1}</h3>
            {/each}
            {#each data.top10 as v, ind (v.pictureID)}
                <div class="rank-info" style="--index: {ind+1}" in:fly|local={{y: 250, duration: 1100}} out:fly|local={{y: 125, duration: 1100}} animate:flip={{duration: 1500}}>
                    <h1 class="stat">{v.pictureID}</h1>
                    <h2 class="stat delta">{v.likes}</h2>
                </div>
            {/each}
            <div class="total-border border"></div>
            <div class="place-border border"></div>
            <div class="total-b total">
                <h1 class="stat">Total</h1>
            </div>
            <div class="total-b total-stat stat">
                <h3 class="stat">{data.total}</h3>
            </div>
        </div>
    </div>
{:else}
    <NotReady />
{/if}