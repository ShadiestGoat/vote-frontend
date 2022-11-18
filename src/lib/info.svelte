<script lang="ts">
	import { API_BASE } from "./store";
	import { cubicInOut } from 'svelte/easing';

    export let id = ""
    export let transform = ""
    export let throwAway = false
    export let throwRight = false

    function animate(node:any, {
        delay = 0,
        duration = 400
    }) {
        return {
            delay,
            duration,
            css: (t:number) => {
                const eased = cubicInOut(t)
                if (throwAway)
                    return `transform: scale(${1-0.85*eased}) translate(${throwRight ? "" : "-"}${200*eased}vw, -${75*eased}vh) rotate(${throwRight ? "" : "-"}${360*eased}deg); opacity: ${(1.1-eased)};`
                else return `transform: scale(${eased}) translate(0, -${75*(1-t)}vh); opacity: ${eased}`
            }
        };
    }

    function idToName(inp: string): string {
        return inp.split(' & ').map(v => v.split(' ')[0]).join(' & ')
    }
</script>

<style>
    .img {
        z-index: 0;
        max-width: 95%;
        max-height: 100%;
        border-radius: 16px;
        position: absolute;
        top: 2vh;
        max-height: 86vh;
    }
    .name {
        z-index: 2;
        position: absolute;
        font-size: 2.25rem;
        background: #3b4252f3;
        padding: 2vh 2vw;
        border-radius: 8px;
        bottom: 5vh;
        width: 100%;
        text-align: center;
        word-break: break-all;
    }
    .wrapper {
        margin: 0 auto;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        position: relative;
        top: 0;
        left: 0;
        padding: 2vh 2vw;
        transform-origin: bottom center;
        background: var(--accent-2);
        border-radius: 25px;
    }
    .throw-away {
        transform-origin: center center;
    }
</style>

<div in:animate={{delay: 0, duration: 1020}} class="wrapper {throwAway ? "throw-away" : ""}" style={!throwAway ? `transform: ${transform}; transition: all ${transform == "none" ? '0.75' : ""}s;` : ""}>
    <h1 class="name">{idToName(id)}</h1>
    <img src={API_BASE + "/cdn/" + id + ".webp"} class="img" alt="Img1">    
</div>
