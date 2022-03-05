<script lang="ts">
  import Tags from '../src';

  let tags: string[] = ['hi'];
  const transform = (value: string) => value.toUpperCase();
</script>

<div class="container" style:margin-top="10rem">
  <Tags bind:tags placeholder="type here" tagColor="dark" {transform} allowDrop allowPaste />
</div>

<style lang="scss" global>
  @charset 'utf-8';
  @use 'bootstrap/scss/bootstrap';
</style>
