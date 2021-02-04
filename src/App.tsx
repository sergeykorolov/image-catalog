import React, { useState } from 'react';
import './App.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeErrorText,
  clearPage,
  getComposedImage,
  setInputText,
} from './store/images-reducer';
import GroupImages from './components/GroupImages/GroupImages';
import Image from './components/Image/Image';
import { ImageType } from './types/types';
import { AppStateType } from './store/store';

function App() {
  const dispatch = useDispatch();
  const [isGroup, setGroup] = useState(false);
  const [timerId, setTimerId] = useState(1);
  const [invalidInput, setInvalidInput] = useState(false);
  const [isDelay, setDelay] = useState(false);
  const tag: string = useSelector(
    (state: AppStateType) => state.images.inputText,
  );
  const isLoading: boolean = useSelector(
    (state: AppStateType) => state.images.isLoading,
  );
  const errorText: string = useSelector(
    (state: AppStateType) => state.images.errorText,
  );
  const images: Array<ImageType> = useSelector(
    (state: AppStateType) => state.images.images,
  );
  const AllTags = useSelector((state: AppStateType) => state.images.tags);
  const uniqueTags = new Set(AllTags);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const tags = [...uniqueTags];

  const generateString = () => {
    const possible = 'abcdefghijklmnopqrstuvwxyz';
    const textLength = Math.floor(1 + Math.random() * 10);
    let text = '';

    for (let i = 0; i < textLength; i += 1)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };

  const onSearchImage = () => {
    if (tag) {
      if (tag === 'delay') {
        setDelay(true);
        const intervalId = setInterval(() => {
          const randomTag = [] as Array<string>;
          randomTag.push(generateString());
          dispatch(getComposedImage(randomTag));
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setTimerId(intervalId);
        }, 5000);
      } else {
        clearInterval(timerId);
        setDelay(false);
        const reqTags = tag.split(',');
        if (reqTags.includes('')) {
          dispatch(changeErrorText('По тегу ничего не найдено'));
        } else {
          dispatch(getComposedImage(reqTags));
        }
      }
    } else {
      dispatch(changeErrorText('Заполните поле тег'));
    }
  };

  const onClearImages = () => {
    dispatch(setInputText(''));
    dispatch(clearPage());
  };

  const reTags = /^[A-Za-z,]+$/;
  const onChange = (e: any) => {
    if (!reTags.test(String(e.target.value))) {
      setInvalidInput(true);
    } else {
      setInvalidInput(false);
    }
    setDelay(false);
    dispatch(setInputText(e.target.value));
    dispatch(changeErrorText(''));
  };

  const onGroupImages = () => {
    setGroup(!isGroup);
  };

  return (
    <div className="app-wrapper">
      <div className="menu">
        <input
          className="menu__input"
          onChange={(e) => onChange(e)}
          value={tag}
        />
        <button
          type="button"
          disabled={
            (invalidInput && !!tag) || isLoading || (isDelay && tag === 'delay')
          }
          onClick={() => onSearchImage()}
        >
          {isLoading ? 'Загрузка' : 'Загрузить'}
        </button>
        <button type="button" onClick={() => onClearImages()}>
          Очистить
        </button>
        <button type="button" onClick={() => onGroupImages()}>
          {!isGroup ? 'Группировать' : 'Разгруппировать'}
        </button>
        <div className="menu__error-message">
          {errorText && <span>{errorText}</span>}
        </div>
      </div>
      {isGroup ? (
        tags.map((groupTag) => (
          <GroupImages
            groupTag={groupTag}
            images={images}
            key={groupTag + generateString()}
            randomString={generateString()}
          />
        ))
      ) : (
        <div className="group__images">
          {images.map((image) => (
            <Image
              imageUrl={image.imageUrl}
              imageTag={image.imageTag}
              key={image.imageUrl[0] + generateString()}
              randomString={generateString()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
