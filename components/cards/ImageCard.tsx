// "use client"
// import Image from 'next/image';
// import React, { useState } from 'react';

// interface Props {
//   photos?: string[] | [];
//   isComment?: boolean | undefined;
// }

// function ImageCard({ photos, isComment }: Props) {
//   const [showAllPhotos, setShowAllPhotos] = useState(false);
//   const displayedPhotos = showAllPhotos ? photos : (photos && photos?.slice(0, 4));

//   return (
//     <div className='w-full '>
//       {!isComment && photos && photos?.length > 0 && (
//         <div className="w-full grid  grid-cols-2 gap-1">
//           {displayedPhotos?.map((photo, index) => (
//             <div className='min-w-[160px] xs:min-w-[300px] sm:min-w-[400px] md:min-w-[400px]  overflow-hidden h-full'>
//                 <Image
//                     key={index}
//                     src={photo}
//                     alt="photo"
//                     width={400} // Set the width to the desired size
//                     height={100} // Set the height to the desired size
//                     layout="responsive" // Use a responsive layout
//                     quality={100}
//                     objectFit='cover'
//                     className="cursor-pointer my-1 rounded-sm"
//                 />
//             </div>
//           ))}
//           {photos?.length > 4 && (
//             <button
//               onClick={() => setShowAllPhotos(!showAllPhotos)}
//               className="cursor-pointer my-1 rounded-sm text-blue-500"
//             >
//               {showAllPhotos ? 'Show Less' : 'Show More'}
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ImageCard;

"use client"
import Image from 'next/image';
import React, { useState } from 'react';

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
  return (
    <div className='w-full'>
      {!isComment && photos && photos?.length > 0 && (
        <div className="w-full  grid gap-1">
          {photos?.length === 1 ? (
            <div className='min-w-[160px] xs:min-w-[300px] sm:min-w-[400px] md:min-w-[400px] overflow-hidden h-full'>
              <Image
                src={photos[0]}
                alt="photo"
                width={400}
                height={100}
                layout="responsive"
                quality={100}
                objectFit="cover"
                className="cursor-pointer my-1 rounded-sm"
              />
            </div>
          ) : photos?.length === 2 ? (
            <div className="grid self-start justify-self-start grid-cols-2">
              {photos?.map((photo, index) => (
                <div
                  key={index}
                  className='min-w-[160px] sm:min-w-[100px] md:max-w-[250px] overflow-hidden max-h-[130px]'
                >
                  <Image
                    src={photo}
                    alt="photo"
                    width={100}
                    height={100}
                    layout="responsive"
                    quality={100}
                    objectFit="contain"
                    className="cursor-pointer my-1 rounded-sm"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 max-h-[150px]">
              <div className="min-w-[160px] sm:min-w-[400px] md:min-w-[250px] overflow-hidden min-h-full">
                <Image
                  src={photos[0]}
                  alt="photo"
                  width={400}
                  height={100}
                  layout="responsive"
                  quality={100}
                  // objectFit="cover"
                  className="cursor-pointer rounded-sm"
                />
              </div>
              <div className="grid grid-rows-2">
                {photos?.slice(1).map((photo, index) => (
                  <div
                    key={index}
                    className='min-w-[160px] xs:min-w-[300px] sm:min-w-[400px] md:min-w-[250px] overflow-hidden h-[75px]'
                  >
                    <Image
                      src={photo}
                      alt="photo"
                      width={400}
                      height={100}
                      layout="responsive"
                      quality={100}
                      objectFit="cover"
                      className="cursor-pointer rounded-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
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