import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { MovieShowModule } from "./movieshow/movieshow.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { configVar } from "./config";
import { BookingModule } from "./booking/booking.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { MulterModule } from "@nestjs/platform-express";
import { PaymentModule } from "./payment/payment.module";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(configVar.mongoURI),
    AuthModule,
    MailerModule.forRoot({
      transport: {
        service: "gmail",
        host: "smtp.gmail.com",
        secure: false,
        auth: {
          user: configVar.GMAIL_ACC,
          pass: configVar.GMAIL_PASS,
        },
      },
    }),
    BookingModule,
    MovieShowModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client"),
    }),
    CloudinaryModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
