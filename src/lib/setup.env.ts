import * as dotenv from 'dotenv';

class Env {
  static set(path = './.env') {
    return dotenv.config({ path });
  }
}

export default Env;
