import React, { FC } from 'react';
import './Image.scss';
import { useDispatch } from 'react-redux';
import { setInputText } from '../../store/images-reducer';

type PropsType = {
  imageTag: string;
  imageUrl: Array<string>;
  randomString: string;
};

// eslint-disable-next-line react/prop-types
const Image: FC<PropsType> = ({ imageTag, imageUrl, randomString }) => {
  const dispatch = useDispatch();

  const onChangeTag = () => {
    dispatch(setInputText(imageTag));
  };

  return (
    <button type="button" className="img_block" onClick={() => onChangeTag()}>
      {imageUrl &&
        // eslint-disable-next-line react/prop-types
        imageUrl.map((image) => (
          <img src={image} alt="" key={image + randomString} />
        ))}
    </button>
  );
};

export default Image;
