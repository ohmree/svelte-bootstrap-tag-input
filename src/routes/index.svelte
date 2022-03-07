<script lang="ts" strictEvents>
  import TagInput, { tagsLeft } from '$lib';

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
    maxTags={5}
  />
  <p>{$tagsLeft === 0 ? 'No' : $tagsLeft} more tags are allowed.</p>
</div>
