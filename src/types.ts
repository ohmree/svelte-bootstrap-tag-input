import type { KeyboardEventKey } from 'keyboard-event-key-type';
import type { SvelteComponentTyped } from 'svelte';

export type TagsColor =
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

export type TagsSize = 'lg' | 'sm' | (string & Record<string, never>) | undefined;

export interface TagsEvents {
  change: CustomEvent<string[]>;
}

export interface Inaccessible {
  id?: never;
  label?: never;
}

export interface Accessible {
  id: string;
  label: string;
}

export type Accessibility = Inaccessible | Accessible;

export type TagsProps = Accessibility & {
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
};

export type { KeyboardEventKey };

declare class Tags extends SvelteComponentTyped<TagsProps, TagsEvents> {}
export default Tags;
