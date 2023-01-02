import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from './auth/auth.module';
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule } from "@nestjs/config";
import { MovieshowModule } from './movieshow/movieshow.module';
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";


@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: './config/.env',
  }),MongooseModule.forRoot(process.env.mongoURI), AuthModule,MailerModule.forRoot({
    transport:{
      service:"gmail",
      host:"smtp.gmail.com",
      secure:false,
      auth:{
        user:process.env.GMAIL_ACC,
        pass:process.env.GMAIL_PASS
      }
    }
  }), MovieshowModule , ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'client'),
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
