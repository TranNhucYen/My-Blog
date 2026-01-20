const { supabase, bucketName } = require('../config/supabase.js');

/**
 * Upload file to Supabase Storage
 * @param {Buffer} fileBuffer - The file data as a buffer (from multer memory storage)
 * @param {string} mimetype - The MIME type of the file (e.g., 'image/jpeg', 'image/png', 'image/webp')
 * @returns {Promise<string>} The file path in Supabase storage (e.g., '1737123456.png')
 * @throws {Error} If upload fails
 */
async function uploadFile(fileBuffer, mimetype) {
    const ext = mimetype.split('/').pop();
    const fileName = `${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
            contentType: mimetype || 'image/png',
            upsert: true,
        });

    if (error) {
        console.error('Upload error:', error);
        throw new Error('Failed to upload file');
    }
    return data.path;
}

function getPublicUrl(filePath) {
    // Kiểm tra nếu không có đường dẫn file
    if (!filePath) {
        return null; 
    }
    try {
        const { data } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        // Kiểm tra nếu không tìm thấy Public URL
        if (!data || !data.publicUrl) {
            console.error(`Không tìm thấy Public URL cho file: ${filePath}`);
            return null;
        }

        return data.publicUrl;
    } catch (error) {
        //Bắt lỗi nếu Supabase client cấu hình sai hoặc gặp sự cố
        console.error('Lỗi khi lấy Public URL:', error.message);
        return null;
    }
}
module.exports = {
    uploadFile,
    getPublicUrl
};
