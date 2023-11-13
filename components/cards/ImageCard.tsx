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
      // @ts-ignore
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
        <div className="w-full  grid">
          {photos?.length === 1 ? (
            <div className='w-[100%] relative overflow-hidden  h-32 sm:h-48 md:h-64'>
              <Image
                loading='lazy'
                src={photos[0]}
                onClick={()=>openImageViewer(photos[0])}
                alt="photo"
                sizes="(min-width: 980px) 684px, (min-width: 780px) calc(78.33vw - 68px), (min-width: 640px) calc(100vw - 164px), calc(100vw - 100px)"
                fill={true}
                className="object-cover absolute cursor-pointer rounded-sm"
              />
            </div>
          ) : photos?.length === 2 ? (
            <div className="w-[100%]  grid grid-cols-2">
              {photos?.map((photo, index) => (
                <div
                  key={index}
                  className='relative h-48 overflow-hidden'
                >
                  <Image
                    onClick={()=>openImageViewer(photo)}
                    loading='lazy'
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
            <div className="grid grid-cols-2 w-[100%] ">
              <div className="w-full relative h-48 md:h-64 overflow-hidden">
                <Image
                  loading='lazy'
                  src={photos[0]}
                  onClick={()=>openImageViewer(photos[0])}
                  sizes="(min-width: 980px) 342px, (min-width: 780px) calc(38.89vw - 31px), (min-width: 640px) calc(50vw - 82px), calc(50vw - 50px)"
                  alt="photo"
                  fill={true}
                  quality={100}
                  className="object-cover cursor-pointer absolute rounded-sm"
                />
              </div>
              <div className="w-full  grid grid-rows-2">
                {photos?.slice(1).map((photo, index) => (
                  <div
                    key={index}
                    className='relative overflow-hidden'
                  >
                    <Image
                      onClick={()=>openImageViewer(photo)}
                      loading='lazy'
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
              <div className="w-[100%]  grid grid-cols-2">
                {photos?.map((photo, index) => (
                  <div
                    key={index}
                    className="relative h-32 overflow-hidden"
                  >
                    <Image
                      onClick={() => openImageViewer(photo)}
                      sizes="(min-width: 980px) 342px, (min-width: 780px) calc(38.89vw - 31px), (min-width: 640px) calc(50vw - 82px), calc(50vw - 50px)"
                      loading='lazy'
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
      
      {/* {photos?.length > 4 && (photos?.slice(0, 4).map((photo, index) => (
                <div key={index} className='relative h-48 overflow-hidden'>
                  <Image
                    onClick={() => openImageViewer(photo)}
                    loading='lazy'
                    src={photo}
                    sizes="(min-width: 980px) 342px, (min-width: 780px) calc(38.89vw - 31px), (min-width: 640px) calc(50vw - 82px), calc(50vw - 50px)"
                    alt="photo"
                    fill={true}
                    quality={100}
                    className="object-cover cursor-pointer absolute rounded-sm"
                  />
                  {index === 3 && photos?.length > 4 && (
                    <div
                      onClick={() => setShowAllPhotos(true)}
                      className='plus-icon cursor-pointer absolute w-12 h-12 bg-gray-700 bg-opacity-90 text-white flex justify-center items-center rounded-full'
                    >
                      +{photos?.length - 4}
                    </div>
                  )}
                </div>

      ))
      )} */}
      {selectedImage && (
        // <ImageViewer imageUrl={selectedImage} onClose={closeImageViewer} />
        <div className="image-viewer">
          <div className="image-container">
            <img src={selectedImage} alt="Full Screen" />
          </div>
          <button className="close-button text-2xl p-5" onClick={closeImageViewer}>
            X
          </button>
      </div>
      )}
    </div>
  );
}

export default ImageCard;