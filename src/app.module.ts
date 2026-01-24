import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { AuditSubscriber } from 'database/subscribers/Audit.subscriber';
import { ProductsModule } from './modules/products/products.module';
import { StockModule } from './modules/stock/stock.module';
import { HeadquartersModule } from './modules/headquarters/headquarters.module';
import { CatalogsModule } from './modules/catalogs/catalogs.module';
import { InventoryMovementsModule } from './modules/inventory-movements/inventory-movements.module';
import { SalesModule } from './modules/sales/sales.module';
import { PurchasesModule } from './modules/purchases/purchases.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    UsersModule,
    CompaniesModule,
    WarehousesModule,
    ProductsModule,
    StockModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        subscribers: [AuditSubscriber],
      }),
    }),
    HeadquartersModule,
    CatalogsModule,
    InventoryMovementsModule,
    SalesModule,
    PurchasesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
