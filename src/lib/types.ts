import type { KeyboardEventKey } from 'keyboard-event-key-type';
import type { SvelteComponentTyped } from 'svelte';
import type { ScaleParams } from 'svelte/transition';

export type TagColor =
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

export type Size = 'lg' | 'sm' | (string & Record<string, never>) | undefined;

export interface TagInputEventMap {
  change: string[];
}

export type TagInputEvents = {
  [Name in keyof TagInputEventMap]: CustomEvent<TagInputEventMap[Name]>;
};

export interface Inaccessible {
  id?: never;
  label?: never;
}

export interface Accessible {
  id: string;
  label: string;
}

export type Accessibility = Inaccessible | Accessible;

export type TagInputProps = Accessibility & {
  tags?: string[];
  addKeys?: KeyboardEventKey[];
  removeKeys?: KeyboardEventKey[];
  maxTags?: number;
  splitWith?: string;
  allowDuplicates?: boolean;
  allowPaste?: boolean;
  allowDrop?: boolean;
  disabled?: boolean;
  tagColor?: TagColor;
  hasError?: boolean;
  placeholder?: string;
  inputSize?: Size;
  transform?: (value: string) => string;
  scaleParams?: ScaleParams;
};

export type { KeyboardEventKey };

declare class TagInput extends SvelteComponentTyped<TagInputProps, TagInputEvents> {}
export default TagInput;
