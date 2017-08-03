using System.IO;
using SkiaSharp;

namespace domain
{
    public static class ImageScaler
    {
        /// <summary>
        /// Изменяет размер изображения. Размер меняется только, если его высота или ширина больше параметров height и width соответственно
        /// </summary>
        /// <param name="blob"></param>
        /// <param name="width"></param>
        /// <param name="height"></param>
        /// <param name="mimeType">mime тип</param>
        /// <param name="quality">качество сжатия</param>
        /// <returns></returns>
        public static byte[] ResizeImage(byte[] blob, int width, int height, string mimeType = "", int quality = 75)
        {
            byte[] buff = blob;

            if (blob != null)
            {
                using (MemoryStream dataStream = new MemoryStream(blob))
                {
                    SKManagedStream inputStream = new SKManagedStream(dataStream);
                    using (SKBitmap original = SKBitmap.Decode(inputStream))
                    {
                        if (original.Width > width || original.Height > height)
                        {
                            int w, h;
                            if (original.Width > original.Height)
                            {
                                w = width;
                                h = original.Height * height / original.Width;
                            }
                            else
                            {
                                w = original.Width * width / original.Height;
                                h = height;
                            }

                            using (SKBitmap resized = original.Resize(new SKImageInfo(w, h), SKBitmapResizeMethod.Lanczos3))
                            {
                                if (resized != null)
                                {
                                    using (SKImage image = SKImage.FromBitmap(resized))
                                    {
                                        SKEncodedImageFormat imageFormat = SKEncodedImageFormat.Bmp;

                                        switch (mimeType)
                                        {
                                            case "image/gif":
                                                imageFormat = SKEncodedImageFormat.Gif;
                                                break;

                                            case "image/jpeg":
                                                imageFormat = SKEncodedImageFormat.Jpeg;
                                                break;

                                            case "image/png":
                                                imageFormat = SKEncodedImageFormat.Png;
                                                break;
                                        }

                                        buff = image
                                            .Encode(imageFormat, quality)
                                            .ToArray();
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return buff;
        }
    }
}
