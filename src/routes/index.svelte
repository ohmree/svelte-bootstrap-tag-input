<script lang="ts" strictEvents>
  import TagInput, { tagsLeft } from '$lib';
  import Checkbox from '$lib/Checkbox.svelte';
  import { tagColors } from '$lib/constants';
  import type { TagColor } from '$lib/types';

  let tags: string[] = ['hi'];
  let maxTags: number | undefined;
  let allowDrop = false;
  let allowPaste = false;
  let allowDuplicates = false;
  let placeholder = 'Type here';
  let tagBackground: TagColor = 'secondary';
  let tagForeground: TagColor = 'light';
  let shouldTransform = false;
  let disabled = false;
  $: transform = shouldTransform ? (value: string) => value.toUpperCase() : undefined;
</script>

<div class="container" style:margin-top="10rem">
  <TagInput
    bind:tags
    {placeholder}
    {tagBackground}
    {tagForeground}
    {transform}
    {allowDrop}
    {allowPaste}
    {maxTags}
    {allowDuplicates}
    {disabled}
  />

  {#if maxTags}
    <p>{$tagsLeft === 0 ? 'No' : $tagsLeft} more tags are allowed.</p>
  {/if}

  <Checkbox label="Allow drag 'n drop" bind:checked={allowDrop} />
  <Checkbox label="Allow pasting" bind:checked={allowPaste} />
  <Checkbox label="Allow duplicate tags" bind:checked={allowDuplicates} />
  <Checkbox label="Transform new tags to uppercase" bind:checked={shouldTransform} />
  <Checkbox label="Disable input" bind:checked={disabled} />

  <label for="bgSelect">Background color</label>
  <select
    id="bgSelect"
    bind:value={tagBackground}
    class="form-select"
    aria-label="Select background color"
  >
    {#each tagColors as color}
      <option value={color}>{color}</option>
    {/each}
  </select>
  <label for="fgSelect">Foreground color</label>
  <select
    id="fgSelect"
    bind:value={tagForeground}
    class="form-select"
    aria-label="Select foreground color"
  >
    {#each tagColors as color}
      <option value={color}>{color}</option>
    {/each}
  </select>
  <label for="placeholderInput">Placeholder text</label>
  <input
    id="placeholderInput"
    class="form-control"
    type="text"
    placeholder="Placeholder"
    bind:value={placeholder}
  />
</div>
