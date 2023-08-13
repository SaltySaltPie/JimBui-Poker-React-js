export const jsPlaySound = async (sound: HTMLAudioElement) => {
   try {
      if (!sound) throw Error("NO SOUND");
      sound.pause();
      sound.currentTime = 0;
      await sound.play();
   } catch (error) {
      console.log({ error, src: "jsPlaySound" });
   }
};
