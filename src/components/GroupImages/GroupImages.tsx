import React, { FC } from 'react';
import Image from '../Image/Image';
import { ImageType } from '../../types/types';
import './GroupImages.scss';

type PropsType = {
  groupTag: string;
  images: Array<ImageType>;
  randomString: string;
};

// eslint-disable-next-line react/prop-types
const GroupImages: FC<PropsType> = ({ groupTag, images, randomString }) => {
  return (
    <div className="group">
      <h2 className="group__title">{groupTag}</h2>
      <div className="group__images">
        {/* eslint-disable-next-line react/prop-types */}
        {images.map((image: ImageType) =>
          image.imageTag === groupTag ? (
            <Image
              imageUrl={image.imageUrl}
              imageTag={image.imageTag}
              key={image.imageUrl[0] + randomString}
              randomString={randomString}
            />
          ) : (
            ''
          ),
        )}
      </div>
    </div>
  );
};

export default GroupImages;
