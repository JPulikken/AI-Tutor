let faceApiPromise;
let modelLoadPromise;

const loadFaceApi = () => {
  if (!faceApiPromise) {
    faceApiPromise = import("face-api.js");
  }

  return faceApiPromise;
};

export const loadFaceModels = () => {
  if (!modelLoadPromise) {
    const modelUrl = "/models";

    modelLoadPromise = loadFaceApi().then(async (faceapi) => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
        faceapi.nets.faceExpressionNet.loadFromUri(modelUrl),
      ]);

      return faceapi;
    });
  }

  return modelLoadPromise;
};
