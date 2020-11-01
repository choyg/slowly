export const resolvePath = (controller: string, method: string) => {
  let path = controller;
  if (!controller.endsWith("/") && !method.startsWith("/") && method !== "") {
    path = path.concat("/");
  } else if (controller.endsWith("/") && method.startsWith("/")) {
    path = path.slice(0, path.length - 1);
  }
  path = path.concat(method);

  return path;
};
