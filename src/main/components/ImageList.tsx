import React from 'react';
import styled from 'styled-components';

interface ImageListProps {
  images: Image[];
  setImages: React.Dispatch<React.SetStateAction<Image[]>>;
}

const ImagesContainer = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-evenly;
  padding: 0;

  li {
    width: 23%;
  }
`;

const ImageItem = styled.img`
  max-width: 100%;
`;

export const ImageList: React.FunctionComponent<ImageListProps> = ({
  images,
  setImages,
}): React.ReactElement => {
  const removeImage = (index: number): void => setImages(images.filter((_, i) => i !== index));

  return (
    <ImagesContainer>
      {
        images.map((image, index) => (
          <li key={ index }>
            <ImageItem src={ image } onClick={ () => removeImage(index) } />
          </li>
        ))
      }
    </ImagesContainer>
  );
};
