import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Configure multer for file uploads
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Only video and image files are allowed'), false);
        }
      }
    });
  }

  // Upload video to Cloudinary
  async uploadVideo(buffer, options = {}) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: 'career-ai/videos',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' },
              { width: 1280, height: 720, crop: 'limit' }
            ],
            ...options
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
    } catch (error) {
      console.error('Video upload error:', error);
      throw new Error('Failed to upload video');
    }
  }

  // Upload image to Cloudinary
  async uploadImage(buffer, options = {}) {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'career-ai/images',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' },
              { width: 800, height: 600, crop: 'limit' }
            ],
            ...options
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  // Generate video thumbnail
  async generateThumbnail(videoPublicId) {
    try {
      const thumbnailUrl = cloudinary.url(videoPublicId, {
        resource_type: 'video',
        format: 'jpg',
        transformation: [
          { width: 400, height: 300, crop: 'fill' },
          { start_offset: '10%' } // Take thumbnail at 10% of video
        ]
      });

      return thumbnailUrl;
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      throw new Error('Failed to generate thumbnail');
    }
  }

  // Process video resume
  async processVideoResume(buffer, userId) {
    try {
      // Upload original video
      const uploadResult = await this.uploadVideo(buffer, {
        public_id: `video-resume-${userId}-${Date.now()}`,
        eager: [
          { width: 640, height: 480, crop: 'limit', quality: 'auto' },
          { width: 1280, height: 720, crop: 'limit', quality: 'auto' }
        ]
      });

      // Generate thumbnail
      const thumbnailUrl = await this.generateThumbnail(uploadResult.public_id);

      return {
        videoId: uploadResult.public_id,
        videoUrl: uploadResult.secure_url,
        thumbnailUrl,
        duration: uploadResult.duration,
        format: uploadResult.format,
        size: uploadResult.bytes,
        versions: {
          sd: uploadResult.eager?.[0]?.secure_url,
          hd: uploadResult.eager?.[1]?.secure_url
        }
      };
    } catch (error) {
      console.error('Video resume processing error:', error);
      throw new Error('Failed to process video resume');
    }
  }

  // Delete video/image
  async deleteMedia(publicId, resourceType = 'video') {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });

      return result.result === 'ok';
    } catch (error) {
      console.error('Media deletion error:', error);
      throw new Error('Failed to delete media');
    }
  }

  // Get video analytics
  async getVideoAnalytics(publicId) {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'video'
      });

      return {
        views: result.derived?.length || 0,
        duration: result.duration,
        format: result.format,
        size: result.bytes,
        createdAt: result.created_at,
        url: result.secure_url
      };
    } catch (error) {
      console.error('Video analytics error:', error);
      return null;
    }
  }

  // Generate signed upload URL for direct uploads
  generateSignedUploadUrl(options = {}) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const params = {
        timestamp,
        folder: 'career-ai/uploads',
        ...options
      };

      const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);

      return {
        url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`,
        params: {
          ...params,
          signature,
          api_key: process.env.CLOUDINARY_API_KEY
        }
      };
    } catch (error) {
      console.error('Signed URL generation error:', error);
      throw new Error('Failed to generate upload URL');
    }
  }

  // Transform video for different qualities
  getVideoVariations(publicId) {
    return {
      original: cloudinary.url(publicId, { resource_type: 'video' }),
      hd: cloudinary.url(publicId, {
        resource_type: 'video',
        transformation: [{ width: 1280, height: 720, crop: 'limit', quality: 'auto' }]
      }),
      sd: cloudinary.url(publicId, {
        resource_type: 'video',
        transformation: [{ width: 640, height: 480, crop: 'limit', quality: 'auto' }]
      }),
      mobile: cloudinary.url(publicId, {
        resource_type: 'video',
        transformation: [{ width: 480, height: 360, crop: 'limit', quality: 'auto' }]
      })
    };
  }
}

export default CloudinaryService;