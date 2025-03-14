'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { primaryBtnStyles } from '@/app/commonStyles';
import { createClient } from '@/utils/supabase/client';
import { toast } from './ui/use-toast';
import { PostgrestError } from '@supabase/supabase-js'; // Import the Supabase error type

interface ProfilePhotoUploaderProps {
  currentPhotoUrl?: string;
  userProvider?: 'email' | 'google' | 'github';
  onPhotoUploaded?: (url: string) => Promise<void>;
  className?: string;
}

const STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;
const BUCKET_NAME = 'profile_photos';

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  currentPhotoUrl,
  userProvider = 'email',
  onPhotoUploaded,
  className,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Log current photo URL for debugging
  React.useEffect(() => {
    console.log('Current Photo URL:', currentPhotoUrl);
  }, [currentPhotoUrl]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Log the selected file for debugging
    console.log('Selected file:', file);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please select an image file.',
      });
      return;
    }

    try {
      setIsUploading(true);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Log the generated file name and path for debugging
      console.log('Generated file name:', fileName);
      console.log('File path for upload:', filePath);

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (error) throw error;

      // Construct the full URL
      const fullUrl = `${STORAGE_URL}/${BUCKET_NAME}/${data.path}`;

      // Log the uploaded file URL for debugging
      console.log('Uploaded file URL:', fullUrl);

      await onPhotoUploaded?.(fullUrl);

      toast({
        title: 'Success',
        description: 'Profile photo updated successfully.',
      });
    } catch (error: PostgrestError | unknown) {
      console.error('Error uploading file:', error);
      toast({
        variant: 'destructive',
        title: 'Error uploading file',
        description: (error as PostgrestError).message || 'Unknown error occurred',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('w-fit relative', className)}>
      <Avatar className="w-48 h-48">
        <AvatarImage src={currentPhotoUrl ?? '/avatar.png'} alt="Profile Photo" />
        <AvatarFallback>{currentPhotoUrl ? '' : 'CN'}</AvatarFallback>
      </Avatar>

      {/* Only show upload button for email users */}
      {userProvider === 'email' && (
        <>
          <Button
            className={cn(
              primaryBtnStyles,
              'w-8 h-8 p-2 rounded-full absolute right-[-15px] top-[60%]'
            )}
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </>
      )}
      {/* Show provider badge for OAuth users */}
      {userProvider !== 'email' && (
        <div className="absolute bottom-2 right-2 bg-muted/80 px-2 py-1 rounded-md text-xs">
          Via {userProvider}
        </div>
      )}
    </div>
  );
};
