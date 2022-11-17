<script lang="ts">
	import { browser } from "$app/environment";
	import Color from "$lib/color.svelte";
	import Info from "$lib/info.svelte";
	import NotReady from "$lib/notReady.svelte";
	import { API_BASE, checkUser } from "$lib/store";
	import { onMount } from "svelte";

    let ready = false

    let currentImg = ""
    let throwAwayImg = ""

    let ownID = (browser ? localStorage.getItem("id") : "") as string

    async function fetchPoll() {
        const respRaw = await fetch(API_BASE + "/api/poll", {
            headers: {
                Authorization: ownID
            },
            method: "GET",
        })
        const resp = await respRaw.text()
        if (resp[0] == "{") return ""
        return resp
    }

    async function updatePoll() {
        throwAwayImg = currentImg
        setTimeout(() => {
            throwAwayImg = ""
        }, 1010)
        currentImg = await fetchPoll()
        resetTransform()
    }

    onMount(async () => {
        await checkUser()
        ownID = (browser ? localStorage.getItem("id") : "") as string
        await updatePoll()
        ready = true
    })
    let initX = 0

    async function vote(inp:boolean) {
        if (throwAwayImg) return

        await fetch(API_BASE + "/api/vote", {
            body: JSON.stringify({pictureID: currentImg, vote: inp}),
            headers: {
                "Authorization": ownID,
                "Content-Type": "application/json",
            },
            method: "POST",
        })
        throwRight = inp
       await updatePoll()
    }

    function resetTransform() {
        initX = 0
        transform = "none"
        totPerc = 0
    }

    let throwRight = false
    let transform = "none"
    let totPerc = 0
    let lastX = 0

    const glowPerc = 0.15
    const exitPerc = 0.7

    function onDown(x:number) {
        if (initX != 0) {return}
        if (currentImg == "" || throwAwayImg) return
        initX = x
        lastX = x
    }
    async function onUp() {
        if (initX == 0) return
        if (currentImg == "" || throwAwayImg) return
        const perc = (lastX-initX)/(window.innerWidth*0.35)

        if (Math.abs(perc) > glowPerc * 2.25) {
            await vote(perc > 0)
        } else {
            resetTransform()
        }
    }
    async function onMove(x:number) {
        if (initX == 0) return
        if (currentImg == "" || throwAwayImg) return
        lastX = x
        let perc = (x-initX)/(window.innerWidth*0.35)
        
        if (perc > 1) {
            perc = 1
        } else if (perc < -1) {
            perc = -1
        }
    
        totPerc = perc
    
        if (Math.abs(perc) > exitPerc) {
            await vote(x > initX)
        } else {
            let rot = 20 * perc
            let scale = 1 - Math.abs(perc)/1.75
            let tX = innerHeight * 0.6 * perc
            let tY = innerHeight * 0.85 * Math.abs(perc)
            transform = `rotate(${rot}deg) scale(${scale}) translate(${tX}px, -${tY}px)`
        }
    }

    let innerHeight = 0
</script>

<svelte:window bind:innerHeight on:touchstart={function (e) {
    e.stopPropagation()
    const touch = e.touches.item(0)
    if (!touch) return
    onDown(touch.clientX)
}} on:mousedown={function (e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.buttons != 1) return
    onDown(e.clientX)
}} on:touchend={async function (e) {
    await onUp()
}} on:touchcancel={async function () {
    await onUp()
}} on:mouseup={async function (e) {
    e.preventDefault()
    await onUp()
}} on:touchmove={async function (e) {
    e.stopPropagation()
    const touch = e.touches.item(0)
    if (!touch) return
    await onMove(touch.clientX)
}} on:mousemove={async function (e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.buttons != 1) return
    await onMove(e.clientX)
}} />

<style>
    .wrapper {
        width: 100vw;
        max-width: 900px;
        margin: 2vh auto;
        padding: 2vh 2vw;
        height: 94vh;
    }
    .container {
        width: 100vw;
        overflow: hidden;
    }
    .done {
        text-align: center;
        margin-top: 41vh;
        font-size: 3rem;
        font-weight: 900;
    }
</style>

<div class="container" style="height: {innerHeight}px">
    {#if ready}
        {#if !currentImg}
            <h1 class="done">You have done them all!</h1>
        {:else}
            <Color color="red" left={true} perc={totPerc < -glowPerc ? (Math.abs(totPerc)-glowPerc)/(1-glowPerc) : 0} />
            <Color color="green" left={false} perc={totPerc > glowPerc ? (Math.abs(totPerc)-glowPerc)/(1-glowPerc) : 0}  />
            <div class="wrapper">
                {#if throwAwayImg}
                    <Info throwAway={true} throwRight={throwRight} id={throwAwayImg}></Info>
                {:else}
                    <Info transform={transform} id={currentImg}></Info>
                {/if}
            </div>
        {/if}
    {:else}
        <NotReady />
    {/if}
</div>