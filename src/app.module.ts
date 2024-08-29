import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ProductsModule],
  providers: [],
})
export class AppModule {}
