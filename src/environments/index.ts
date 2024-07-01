// Interfaces configuration environments importing
import { IEnvironmentsRoot } from './environments.interface';

// Enum environments importing
import { NODE_ENV_STAGES } from './environments.enum';

/**
 * @param token the namespace pointing specific one
 * @return {IEnvironmentsRoot}
 */
export default (): IEnvironmentsRoot => ({
  PORT: parseInt(<string>process.env.PORT, 10),
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(<string>process.env.DB_PORT, 10),
  DB_USERNAME: process.env.DB_USERNAME,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_PASSWORD: process.env.DB_PASSWORD,
});
