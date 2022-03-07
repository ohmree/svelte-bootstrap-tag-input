<script lang="ts" strictEvents>
  import TagInput from '../src';
  import { cubicInOut } from 'svelte/easing';

  let tags: string[] = ['hi'];
  const transform = (value: string) => value.toUpperCase();
</script>

<div class="container" style:margin-top="10rem">
  <TagInput
    bind:tags
    placeholder="type here"
    tagColor="dark"
    {transform}
    allowDrop
    allowPaste
    scaleParams={{ easing: cubicInOut, duration: 150, start: 0.5 }}
  />
</div>
