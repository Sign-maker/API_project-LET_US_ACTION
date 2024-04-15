export const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const dateRegexp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

export const genderList = ["male", "female"];

export const ALLOWED_AVATAR_EXTENSIONS = [
  "jpg",
  "jpeg",
  "gif",
  "png",
  "tiff",
  "bmp",
];

export const AVATAR_IMG_SIZES = {
  small: {
    height: 250,
    width: 250,
  },
};
