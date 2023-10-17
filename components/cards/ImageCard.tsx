"use client"
import Image from 'next/image';
import React, { useState } from 'react';

interface Props {
  photos?: string[] | [];
  isComment?: boolean | undefined;
}

function ImageCard({ photos, isComment }: Props) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const displayedPhotos = showAllPhotos ? photos : (photos && photos.slice(0, 4));

  return (
    <div>
      {!isComment && photos && photos.length > 0 && (
        <div className="w-full grid grid-cols-2 gap-1">
          {displayedPhotos?.map((photo, index) => (
            <div className='w-full overflow-hidden h-[150px]'>
                <Image
                    key={index}
                    src={photo}
                    alt="photo"
                    width={100} // Set the width to the desired size
                    height={100} // Set the height to the desired size
                    layout="responsive" // Use a responsive layout
                    quality={100}
                    objectFit='cover'
                    className="cursor-pointer my-1 rounded-sm"
                />
            </div>
          ))}
          {photos.length > 4 && (
            <button
              onClick={() => setShowAllPhotos(!showAllPhotos)}
              className="cursor-pointer my-1 rounded-sm text-blue-500"
            >
              {showAllPhotos ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageCard;
