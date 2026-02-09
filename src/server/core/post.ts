import { reddit } from '@devvit/web/server';

export const createPost = async () => {
  return await reddit.submitCustomPost({
    title: 'Hide N\' Snoo - Find the Hidden Snoo!',
  });
};
