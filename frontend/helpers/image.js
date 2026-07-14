// helpers/image.js

// ===== Get full image URL =====
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  // If path is relative, add base URL
  if (imagePath.startsWith("/media/")) {
    const baseURL =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:8000";
    return `${baseURL}${imagePath}`;
  }

  return imagePath;
};

// ===== Check if image exists =====
export const hasImage = (car) => {
  return car?.images?.length > 0 && car.images[0]?.image;
};

// ===== Get first image from car =====
export const getFirstImage = (car) => {
  if (!car?.images?.length) return "";
  return getImageUrl(car.images[0].image);
};

// ===== Get image by index =====
export const getImageByIndex = (car, index = 0) => {
  if (!car?.images?.length || index >= car.images.length) return "";
  return getImageUrl(car.images[index].image);
};

// ===== Get all image URLs =====
export const getAllImageUrls = (car) => {
  if (!car?.images?.length) return [];
  return car.images.map((img) => getImageUrl(img.image));
};
