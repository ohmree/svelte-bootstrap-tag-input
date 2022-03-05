import { SvelteComponentTyped } from 'svelte';
import { KeyboardEventKey } from 'keyboard-event-key-type';

declare type TagsColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link'
  | (string & Record<string, never>)
  | undefined;

declare type TagsSize = 'lg' | 'sm' | (string & Record<string, never>) | undefined;

interface TagsPropsBase extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['input']> {
  tags?: string[];
  addKeys?: KeyboardEventKey[];
  removeKeys?: KeyboardEventKey[];
  maxTags?: number;
  splitWith?: string;
  allowDuplicates?: boolean;
  allowPaste?: boolean;
  allowDrop?: boolean;
  disabled?: boolean;
  tagColor?: TagsColor;
  hasError?: boolean;
  placeholder?: string;
  inputSize?: TagsSize;
  transform?: (value: string) => string;
}

interface TagsPropsInaccessible extends TagsPropsBase {
  label: never;
  id: never;
}

interface TagsPropsAccessible extends TagsPropsBase {
  label: string;
  id: string;
}

export type TagsProps = (TagsPropsInaccessible | TagsPropsAccessible) & Record<string, never>;

export default class Tags extends SvelteComponentTyped<
  TagsProps,
  { change: CustomEvent<string[]> },
  never
> {}
