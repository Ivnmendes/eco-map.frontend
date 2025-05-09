import 'dotenv/config';

export default {
  expo: {
    name: "EcoPontoApp",
    slug: "eco-ponto-app",
    version: "1.0.0",
    sdkVersion: "50.0.0",
    extra: {
      apiUrl: process.env.API_URL
    }
  }
}
