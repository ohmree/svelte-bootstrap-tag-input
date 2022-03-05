<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { TagsColor, TagsSize } from './Tags';
  import type { KeyboardEventKey } from 'keyboard-event-key-type';

  const dispatch = createEventDispatcher();

  let tagInput: HTMLInputElement | undefined;
  let tag = '';
  let tagRemoveButtonSize: TagsSize;
  let duplicateIndices = new Set<number>();

  export let tags: string[] = [];
  export let splitWith = ' ';
  export let addKeys = <KeyboardEventKey[]>[splitWith];
  export let removeKeys = <KeyboardEventKey[]>['Backspace'];
  export let maxTags: number | undefined = undefined;
  export let allowDuplicates = false;
  export let allowPaste = false;
  export let allowDrop = false;
  export let disabled = false;
  export let tagColor: TagsColor = 'secondary';
  export let hasError = false;
  export let placeholder: string | undefined = undefined;
  export let inputSize: TagsSize = undefined;
  export let label: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let transform: ((value: string) => string) | undefined = undefined;

  $: shouldDisable =
    disabled || (typeof maxTags !== 'undefined' && maxTags > 0 && tags.length >= maxTags);
  $: tagsLeft = maxTags ? maxTags - tags.length : 0;
  $: console.log(duplicateIndices);

  if (transform) {
    tags = tags.map(transform);
  }

  function createByKey(e: KeyboardEvent) {
    if (addKeys?.indexOf(e.key) !== -1) {
      e.preventDefault();
      addTag();
    }
  }

  function createByPaste(e: ClipboardEvent) {
    if (!allowPaste) return;

    e.preventDefault();

    const data = e.clipboardData?.getData('text/plain');
    if (data) {
      const chunks = data.split(splitWith).map((s) => s.trim());
      for (const chunk of chunks) {
        if (!maxTags || tags.length < maxTags) {
          addTag(chunk);
        }
      }
    }
  }

  function createByDrop(e: DragEvent) {
    if (!allowDrop) return;

    e.preventDefault();

    const data = e.dataTransfer?.getData('Text');
    if (data) {
      const chunks = data.split(splitWith).map((s) => s.trim());
      for (const chunk of chunks) {
        if (!maxTags || tags.length < maxTags) {
          addTag(chunk);
        }
      }
    }
  }

  function removeByKey(e: KeyboardEvent) {
    if (tags.length > 0 && removeKeys?.indexOf(e.key) !== -1 && tag.length <= 0) {
      tags.pop();
      tags = tags;

      dispatch('change', tags);
    }
  }

  function removeByClick(i: number) {
    if (disabled) return;

    tags.splice(i, 1);
    tags = tags;

    dispatch('change', tags);

    setTimeout(() => {
      tagInput?.focus();
    }, 10);
  }

  function addTag(newTag?: string) {
    if (!newTag) {
      newTag = (transform ? transform(tag) : tag).trim();
    } else {
      newTag = (transform ? transform(newTag) : newTag).trim();
    }

    const newTagIndex = tags.indexOf(newTag);

    if (!allowDuplicates) {
      duplicateIndices.add(newTagIndex);
      duplicateIndices = duplicateIndices;
      setTimeout(() => {
        duplicateIndices.delete(newTagIndex);
        duplicateIndices = duplicateIndices;
      }, 150);
      tag = '';
    }

    // if (!newTag || shouldDisable || (!allowDuplicates && tags.includes(newTag))) return;
    if (!newTag || shouldDisable || (!allowDuplicates && newTagIndex !== -1)) return;

    tags.push(transform ? transform(newTag) : newTag);
    tags = tags;
    tag = '';

    dispatch('change', tags);
  }
</script>

<!-- TODO: figure out how to forward common events from the wrapper to the inner input, if we even should. -->
<div
  class="form-control {inputSize ? `form-control-${inputSize}` : ''} tag-selector"
  class:is-invalid={hasError}
  on:click={() => tagInput?.focus()}
  disabled={disabled ? true : undefined}
>
  <div class="d-flex flex-wrap">
    {#each tags as tag, i}
      <span
        class="tag d-inline-flex align-items-center badge bg-{tagColor}"
        style:transform={duplicateIndices.has(i) ? 'scale(1.09)' : ''}
      >
        <span class="tag-text d-inline text-truncate">{tag}</span>
        {#if !disabled}
          <button
            type="button"
            class="tag-delete bg-light rounded-circle p-1 ms-1 btn-close {tagRemoveButtonSize
              ? `btn-${tagRemoveButtonSize}`
              : ''} float-end"
            on:click={() => removeByClick(i)}
          />
        {/if}
      </span>
    {/each}
    {#if typeof label !== 'undefined' && typeof id !== 'undefined'}
      <label class="visually-hidden" for={id}>{label}</label>
    {/if}
    <input
      {id}
      class="d-inline flex-fill w-auto"
      type="text"
      size={placeholder?.length}
      {placeholder}
      {disabled}
      bind:value={tag}
      bind:this={tagInput}
      on:keydown={createByKey}
      on:keydown={removeByKey}
      on:keydown={(event) => {
        if (maxTags && tagsLeft <= 0) {
          event.preventDefault();
        }
      }}
      on:paste={createByPaste}
      on:drop={createByDrop}
    />
  </div>
</div>

{#if maxTags}
  <p>{tags.length}/{maxTags}</p>
{/if}

<style lang="scss">
  @import 'bootstrap/scss/functions';
  @import 'bootstrap/scss/variables';
  @import 'bootstrap/scss/mixins';

  .tag-selector {
    min-height: $input-height;
    height: auto !important;
    display: inherit !important;

    & {
      input {
        font-size: $input-font-size;
        color: $input-color;
        height: 28px;
        outline: 0;
        padding: 0 2px 0 0;
        margin-left: 2px;
        border-color: transparent;
        border-width: 1px 0;
        min-width: 1em;
      }
    }

    &-sm {
      input {
        font-size: $input-font-size-sm;
      }
    }
    &-lg {
      input {
        font-size: $input-font-size-lg;
      }
    }
    &:focus-within {
      border-color: $input-focus-border-color;
      @include box-shadow($input-focus-box-shadow);
    }
    &[disabled] {
      background-color: $input-disabled-bg;
      border-color: $input-disabled-border-color;
      box-shadow: none;
    }

    .tag-delete {
      @include font-size(0.65rem);
    }

    .tag {
      margin: 0px 2px;
    }

    .tag-text {
      max-width: 6rem;
    }
  }
</style>
