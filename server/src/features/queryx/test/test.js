// test.js
import { handleUserQuestion } from './features/query/handleQuery.js';

(async () => {
  const result = await handleUserQuestion("Which students scored highest in E1 SEM1?");
  console.log("Response:", result);
})();
