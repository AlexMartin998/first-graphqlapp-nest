import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],

      isGlobal: true,
    }),

    // proteger el GraphQLModule
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,

      imports: [AuthModule],
      inject: [JwtService],

      useFactory: async (jwtService: JwtService) => ({
        debug: false,
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault],
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

        context({ req }) {
          // // // Solo si tenemos el  auth  tercializado
          // const token = req.headers.authorization?.replace('Bearer ', '');
          // if (!token) throw new Error('Token needed');
          // const payload = jwtService.decode(token);
          // if (!payload) throw new Error('Invalid token');
        },
      }),
    }),

    /* Sync config
      GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,

      debug: false,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault],

      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }), */

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,

      autoLoadEntities: true,
      synchronize: true,
      // logging: true
    }),

    ItemsModule,

    UsersModule,

    AuthModule,

    SeedModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
