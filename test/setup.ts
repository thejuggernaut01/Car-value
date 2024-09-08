//This function is going to be executed before every single test
// across all of our different spec files
import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {
    console.log(error);
  }
});
