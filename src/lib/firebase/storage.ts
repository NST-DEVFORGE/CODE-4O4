// Simple avatar upload without Firebase Storage
// Converts image to base64 and stores directly in Firestore
export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
  try {
    console.log("🔧 Converting image to base64...");
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64String = reader.result as string;
        console.log("✅ Image converted to base64");
        console.log("   Size:", (base64String.length / 1024).toFixed(2), "KB");
        resolve(base64String);
      };
      
      reader.onerror = () => {
        console.error("❌ Error reading file");
        reject(new Error("Failed to read image file"));
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error("❌ Error converting image:", error);
    if (error instanceof Error) {
      throw new Error(`Image conversion failed: ${error.message}`);
    }
    throw new Error("Image conversion failed: Unknown error");
  }
};

// Note: deleteAvatar is not needed with base64 approach
// Old avatar is simply overwritten when new one is uploaded
export const deleteAvatar = async (userId: string, fileExtension: string): Promise<void> => {
  // No-op for base64 approach
  console.log("ℹ️ Delete not needed for base64 avatars");
};

