import React from 'react';
import { FC, Dispatch, SetStateAction } from 'react';

interface ImageListProps {
  images: Image[];
  setImages: Dispatch<SetStateAction<Image[]>>;
}

export const ImageList: FC<ImageListProps> = ({
  images,
  setImages,
}) => {
  const removeImage = (index: number): void => setImages(images.filter((_, i) => i !== index));

  return (
    <ul className="flex justify-evenly">
      {
        images.map((image, index) => (
          <li className="w-1/4 border border-gray-300" key={ index }>
            <img src={ image } onClick={ () => removeImage(index) } />
          </li>
        ))
      }
    </ul>
  );
};
