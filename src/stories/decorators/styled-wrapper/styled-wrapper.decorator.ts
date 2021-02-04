export const styledWrapperDecorator = (style: string) => (storyFunc: Function) => {
  const story = storyFunc();
  return {
    ...story,
    template: `<div style="${style}">${story.template}</div>`,
  };
};
