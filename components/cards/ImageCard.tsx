"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface Props {
  photos?: string[] | [];
  isComment?: boolean | undefined;
}

function ImageCard({ photos, isComment }: Props) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const displayedPhotos = showAllPhotos ? photos : (photos && photos?.slice(0, 4));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImageViewer = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };
  // Add an event listener to close the viewer when clicking outside the image container
  useEffect(() => {
    const handleClickOutside = (event : any) => {
      if (selectedImage && !document.querySelector('.image-container').contains(event.target)) {
        closeImageViewer();
      }
    };
    if (selectedImage) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedImage]);

  return (
    <div className='w-full mt-2'>
      {!isComment && photos && photos?.length > 0 && (
        <div className="w-full bg-red-900 grid">
          {photos?.length === 1 ? (
            <div className='w-[100%] relative overflow-hidden bg-red-300 h-32 sm:h-48 md:h-64'>
              <Image
                src={photos[0]}
                onClick={()=>openImageViewer(photos[0])}
                alt="photo"
                sizes="(min-width: 980px) 684px, (min-width: 780px) calc(78.33vw - 68px), (min-width: 640px) calc(100vw - 164px), calc(100vw - 100px)"
                fill={true}
                className="object-cover absolute cursor-pointer rounded-sm"
              />
            </div>
          ) : photos?.length === 2 ? (
            <div className="w-[100%] bg-red-500 grid grid-cols-2">
              {photos?.map((photo, index) => (
                <div
                  key={index}
                  className='bg-black relative h-32 sm:h-48 md:h-64 overflow-hidden'
                >
                  <Image
                    onClick={()=>openImageViewer(photo)}
                    src={photo}
                    sizes="(min-width: 980px) 342px, (min-width: 780px) calc(38.89vw - 31px), (min-width: 640px) calc(50vw - 82px), calc(50vw - 50px)"
                    alt="photo"
                    fill={true}
                    quality={100}
                    className="object-cover cursor-pointer absolute rounded-sm"
                  />
                </div>
              ))}
            </div>
          ) :photos?.length === 3 ? (
            <div className="grid grid-cols-2 w-[100%] bg-red-500">
              <div className="w-full bg-black relative h-32 sm:h-48 md:h-64 overflow-hidden">
                <Image
                  src={photos[0]}
                  onClick={()=>openImageViewer(photos[0])}
                  sizes="(min-width: 980px) 342px, (min-width: 780px) calc(38.89vw - 31px), (min-width: 640px) calc(50vw - 82px), calc(50vw - 50px)"
                  alt="photo"
                  fill={true}
                  quality={100}
                  className="object-cover cursor-pointer absolute rounded-sm"
                />
              </div>
              <div className="w-full bg-red-500 grid grid-rows-2">
                {photos?.slice(1).map((photo, index) => (
                  <div
                    key={index}
                    className='bg-black relative overflow-hidden'
                  >
                    <Image
                      onClick={()=>openImageViewer(photo)}
                      src={photo}
                      sizes="(min-width: 980px) 342px, (min-width: 780px) calc(38.89vw - 31px), (min-width: 640px) calc(50vw - 82px), calc(50vw - 50px)"
                      alt="photo"
                      fill={true}
                      quality={100}
                      className="object-cover cursor-pointer absolute rounded-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) :( photos?.length === 4 && (
              <div className="w-[100%] bg-red-500 grid grid-cols-2">
                {photos?.map((photo, index) => (
                  <div
                    key={index}
                    className="bg-black relative h-[130px] sm:h-48 md:h-64 overflow-hidden"
                  >
                    <Image
                      onClick={() => openImageViewer(photo)}
                      sizes="(min-width: 980px) 342px, (min-width: 780px) calc(38.89vw - 31px), (min-width: 640px) calc(50vw - 82px), calc(50vw - 50px)"
                      src={photo}
                      alt="photo"
                      fill={true}
                      quality={100}
                      className="object-cover cursor-pointer absolute rounded-sm"
                    />
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}
      {photos?.length > 4 && (
        <button
          onClick={() => setShowAllPhotos(!showAllPhotos)}
          className="cursor-pointer my-1 rounded-sm text-blue-500"
        >
          {showAllPhotos ? 'Show Less' : 'Show More'}
        </button>
      )}
      {selectedImage && (
        // <ImageViewer imageUrl={selectedImage} onClose={closeImageViewer} />
        <div className="image-viewer">
          <div className="image-container">
            <img src={selectedImage} alt="Full Screen" />
          </div>
          <button className="close-button" onClick={closeImageViewer}>
            Close
          </button>
      </div>
      )}
    </div>
  );
}

export default ImageCard;