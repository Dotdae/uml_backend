// ormconfig.ts
   import { DataSourceOptions } from 'typeorm';
   import { Empresa } from './src/entities/empresa.entity';
   import { Contacto } from './src/entities/contacto.entity';

   const config: DataSourceOptions = {
     type: 'postgres', // or 'mysql', etc.
     host: 'localhost',
     port: 5432,
     username: 'your_username',
     password: 'your_password',
     database: 'your_database',
     synchronize: true, // ONLY FOR DEVELOPMENT - NEVER IN PRODUCTION
     logging: true,
     entities: [Empresa, Contacto],
     migrations: [],
     subscribers: [],
   };

   export default config;