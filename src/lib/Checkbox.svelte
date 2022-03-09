<script lang="ts" context="module">
  let idCounter = 0;
</script>

<script lang="ts">
  export let label: string;
  export let checked: boolean;

  const id = `checkbox_${++idCounter}`;
</script>

<div class="form-check">
  <input class="form-check-input" type="checkbox" {id} bind:checked />
  <label class="form-check-label" for={id}>
    {label}
  </label>
</div>
