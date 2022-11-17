<script lang="ts">
    export let color = ""
    export let perc = 0
    export let left = false
</script>

<style>
    .glower {
        box-shadow: 0 0 calc(50vw * var(--perc)) calc(15vw * var(--perc)) var(--color);
        height: 100vh;
        width: 1vw;
        position: fixed;
    }
</style>

<div class="glower" style="--color: {color}; --perc: {perc}; {left ? "left: -10vw" : "right: -10vw"}">

</div>