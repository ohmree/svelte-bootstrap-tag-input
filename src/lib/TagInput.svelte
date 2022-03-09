<script lang="ts" context="module">
  import { derived, writable } from 'svelte/store';

  const tagsLeft = writable(0);
  const tagsLeftReadonly = derived(tagsLeft, ($tagsLeft) => $tagsLeft);
  export { tagsLeftReadonly as tagsLeft };
</script>

<script lang="ts" strictEvents>
  import { createEventDispatcher } from 'svelte';
  import { scale, type ScaleParams } from 'svelte/transition';
  import type {
    TagColor,
    Size,
    KeyboardEventKey,
    TagInputProps as Props,
    TagInputEventMap as EventMap,
    TagInputEvents as Events,
  } from './types';

  const dispatch = createEventDispatcher<EventMap>();

  let tagInput: HTMLInputElement | undefined;
  let tag = '';
  let tagRemoveButtonSize: Size;
  let duplicateIndices = new Set<number>();

  type $$Props = Props;
  type $$Events = Events;

  let tagsArray: string[] = [];
  export { tagsArray as tags };
  export let splitWith = ' ';
  export let addKeys = <KeyboardEventKey[]>[splitWith];
  export let removeKeys = <KeyboardEventKey[]>['Backspace'];
  export let maxTags: number | undefined = undefined;
  export let allowDuplicates = false;
  export let allowPaste = false;
  export let allowDrop = false;
  export let disabled = false;
  export let tagBackground: TagColor = 'secondary';
  export let tagForeground: TagColor = 'light';
  export let hasError = false;
  export let placeholder: string | undefined = undefined;
  export let inputSize: Size | undefined = undefined;
  export let label: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let transform: ((value: string) => string) | undefined = undefined;
  export let scaleParams: ScaleParams | undefined = { opacity: 1.0, start: 0.5, duration: 150 };

  const tags = writable(
    transform
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tagsArray.map((text) => ({ key: Symbol(), text: transform!(text) }))
      : tagsArray.map((text) => ({ key: Symbol(), text })),
  );

  function pushTag(text: string) {
    tags.update((v) => {
      v.push({ key: Symbol(), text });
      return v;
    });
  }

  function popTag() {
    let returnValue: typeof $tags[0] | undefined;
    tags.update((v) => {
      returnValue = v.pop();
      return v;
    });

    return returnValue;
  }

  $: shouldDisable =
    disabled || (typeof maxTags !== 'undefined' && maxTags > 0 && $tags.length >= maxTags);
  $: $tagsLeft = maxTags ? maxTags - $tags.length : 0;
  $: tagsArray = $tags.map((t) => t.text);

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
        if (!maxTags || $tags.length < maxTags) {
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
        if (!maxTags || $tags.length < maxTags) {
          addTag(chunk);
        }
      }
    }
  }

  function removeByKey(e: KeyboardEvent) {
    if ($tags.length > 0 && removeKeys?.indexOf(e.key) !== -1 && tag.length <= 0) {
      popTag();

      dispatch('change', tagsArray);
    }
  }

  function removeByClick(i: number) {
    if (disabled) return;

    tags.update((v) => {
      v.splice(i, 1);
      return v;
    });

    dispatch('change', tagsArray);

    setTimeout(() => {
      tagInput?.focus();
    }, 10);
  }

  function addTag(newTag?: string) {
    newTag ??= tag;
    newTag = (transform ? transform(newTag) : newTag).trim();

    const newTagIndex = $tags.findIndex(({ text }) => text === newTag);

    if (!allowDuplicates) {
      duplicateIndices.add(newTagIndex);
      duplicateIndices = duplicateIndices;
      tag = '';
    }

    if (!newTag || shouldDisable || (!allowDuplicates && newTagIndex !== -1)) {
      return;
    }

    pushTag(newTag);
    tag = '';

    dispatch('change', tagsArray);
  }

  function removeDuplicateIndex(index: number) {
    duplicateIndices.delete(index);
    duplicateIndices = duplicateIndices;
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
    {#each $tags as { key, text }, i (key)}
      {@const isDuplicate = !allowDuplicates && duplicateIndices.has(i)}
      {@const transitionHandler = !allowDuplicates ? () => removeDuplicateIndex(i) : undefined}
      <span
        class="tag d-inline-flex align-items-center badge bg-{tagBackground} text-{tagForeground}"
        style:transform={isDuplicate ? 'scale(1.09)' : ''}
        transition:scale={scaleParams}
        on:transitionend={transitionHandler}
        on:transitioncancel={transitionHandler}
      >
        <span class="tag-text d-inline text-truncate">{text}</span>
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
      class="d-inline flex-fill w-auto form-control"
      type="text"
      size={placeholder?.length}
      {placeholder}
      {disabled}
      bind:value={tag}
      bind:this={tagInput}
      on:keydown={createByKey}
      on:keydown={removeByKey}
      on:keydown={(event) => {
        if (maxTags && $tagsLeft <= 0) {
          event.preventDefault();
        }
      }}
      on:paste={createByPaste}
      on:drop={createByDrop}
    />
  </div>
</div>

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
        box-shadow: none;
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
      transition: all 0.15s ease-in-out;
    }

    .tag-text {
      max-width: 6rem;
    }
  }
</style>
