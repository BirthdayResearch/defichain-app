declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare module "*.gif" {
  const content: any;
  export = content;
}
