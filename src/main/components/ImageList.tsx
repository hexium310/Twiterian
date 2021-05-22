import React from 'react';

interface ImageListProps {
  images: Image[];
  setImages: React.Dispatch<React.SetStateAction<Image[]>>;
}

export const ImageList: React.FunctionComponent<ImageListProps> = ({
  images,
  setImages,
}): React.ReactElement => {
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
