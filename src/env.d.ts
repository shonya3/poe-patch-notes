declare module "*.css?url" {
  const url: string;
  export default url;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
