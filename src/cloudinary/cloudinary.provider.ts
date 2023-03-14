import { v2 } from "cloudinary";
import { CLOUDINARY } from "./constants";
import { configVar } from "src/config";


export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: ()  => {
    return v2.config({
      cloud_name: configVar.CLOUD_NAME,
      api_key: configVar.CLOUD_APIKEY,
      api_secret: configVar.CLOUD_APISECRET,
    });
  },
};