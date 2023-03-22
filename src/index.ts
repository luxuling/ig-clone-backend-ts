import 'module-alias/register';

import app from '@config/app';
import createServer from '@lib/createServer';

const server = createServer();

server.listen(app.PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`Server listening on port:${app.PORT}`));
