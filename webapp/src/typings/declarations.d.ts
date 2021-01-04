declare module '*.scss' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.gif' {
  const content: any;
  export = content;
}

declare module '*.mp3' {
  const content: any;
  export = content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare namespace React {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    disabled?: any;
  }
}
