// Authentication configuration
export const authConfig = {
    // JWT Configuration
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    
    // Password requirements
    passwordMinLength: 6,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumber: true,
    
    // Username requirements
    usernameMinLength: 3,
    usernameMaxLength: 20,
    usernamePattern: /^[a-zA-Z0-9_]+$/,
    
    // Other settings
    maxLoginAttempts: 5,
    lockoutTime: 15 * 60 * 1000, // 15 minutes
    
    // Session settings
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    
    // Default permissions
    defaultUserRole: 'user',
    defaultDocumentPermission: 'write'
};

// Environment check
export const isProduction = process.env.NODE_ENV === 'production';

// Security warnings for development
if (!isProduction && authConfig.jwtSecret === 'your-super-secret-jwt-key-change-in-production') {
    console.warn('⚠️  WARNING: Using default JWT secret! Please set JWT_SECRET environment variable in production.');
}
