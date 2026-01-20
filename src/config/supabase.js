const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

const supabaseUrl = (isProd ? process.env.PROD_SUPABASE_URL : null) || process.env.SUPABASE_URL;
const supabaseKey = (isProd ? process.env.PROD_SUPABASE_SECRET_KEY : null) || process.env.SUPABASE_SECRET_KEY;
const bucketName = (isProd ? process.env.PROD_SUPABASE_BUCKET_NAME : null) || process.env.SUPABASE_BUCKET_NAME;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = {
    supabase,
    bucketName
};
