// import "@total-typescript/ts-reset";

export declare global {
   interface Window {
      dataLayer: any;
   }
   namespace NodeJS {
      interface ProcessEnv {
         REACT_APP_API: string;
      }
   }
}
