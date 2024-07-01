import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { GraphModule } from './graphql.module';
// import { ResolversModule } from './resolvers/resolvers.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { RepositoriesModule } from './postgresql/repositories.module';
import rootConfiguration from './environments';
import { GraphModule } from './graphql.module';
import { ResolversModule } from './resolvers/resolvers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(process.cwd(), 'env', `.env.${process.env.NODE_ENV}`)],
      load: [rootConfiguration],
    }),
    GraphModule,
    ResolversModule,
    RepositoriesModule.forRoot({
      database: rootConfiguration().DB_DATABASE,
      host: rootConfiguration().DB_HOST,
      port: rootConfiguration().DB_PORT,
      username: rootConfiguration().DB_USERNAME,
      password: rootConfiguration().DB_PASSWORD,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
