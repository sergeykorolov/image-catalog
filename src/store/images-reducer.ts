import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
// eslint-disable-next-line import/extensions
import { imageAPI } from '../api/api';
import { ImageType } from '../types/types';
import { AppStateType } from './store';

const SET_IMAGE = 'SET_IMAGE';
const CLEAR_PAGE = 'CLEAR_PAGE';
const TOGGLE_IS_LOADING = 'TOGGLE_IS_LOADING';
const CHANGE_ERROR_TEXT = 'CHANGE_RESPONSE_ERROR';
const SET_TAGS = 'SET_TAGS';
const SET_INPUT_TEXT = 'SET_INPUT_TEXT';

const initialState = {
  images: [] as Array<ImageType>,
  tags: [] as Array<string>,
  isLoading: false,
  isImageUrl: true,
  errorText: '',
  inputText: '',
};

type InitialStateType = typeof initialState;

const imagesReducer = (
  state = initialState,
  action: ActionTypes,
): InitialStateType => {
  switch (action.type) {
    case SET_IMAGE:
      return {
        ...state,
        images: [
          ...state.images,
          { imageTag: action.tag, imageUrl: action.imageUrl },
        ],
      };
    case SET_TAGS:
      return {
        ...state,
        tags: [...state.images.map((image) => image.imageTag)],
      };
    case CLEAR_PAGE:
      return {
        ...state,
        images: [],
        tags: [],
      };
    case TOGGLE_IS_LOADING:
      return { ...state, isLoading: action.isLoading };
    case CHANGE_ERROR_TEXT:
      return { ...state, errorText: action.errorText };
    case SET_INPUT_TEXT:
      return { ...state, inputText: action.inputText };
    default:
      return state;
  }
};

type ActionTypes =
  | AddImageType
  | ClearPageType
  | ToggleIsLoadingType
  | ChangeErrorTextType
  | SetTagsType
  | SetInputTextType;

type AddImageType = {
  type: typeof SET_IMAGE;
  tag: string;
  imageUrl: Array<string>;
};
export const addImage = (
  tag: string,
  imageUrl: Array<string>,
): AddImageType => ({
  type: SET_IMAGE,
  tag,
  imageUrl,
});

type ClearPageType = {
  type: typeof CLEAR_PAGE;
};
export const clearPage = () => ({ type: CLEAR_PAGE });

type ToggleIsLoadingType = {
  type: typeof TOGGLE_IS_LOADING;
  isLoading: boolean;
};
export const toggleIsLoading = (isLoading: boolean): ToggleIsLoadingType => ({
  type: TOGGLE_IS_LOADING,
  isLoading,
});

type ChangeErrorTextType = {
  type: typeof CHANGE_ERROR_TEXT;
  errorText: string;
};
export const changeErrorText = (errorText: string): ChangeErrorTextType => ({
  type: CHANGE_ERROR_TEXT,
  errorText,
});

type SetTagsType = {
  type: typeof SET_TAGS;
};
export const setTags = (): SetTagsType => ({
  type: SET_TAGS,
});

type SetInputTextType = {
  type: typeof SET_INPUT_TEXT;
  inputText: string;
};
export const setInputText = (inputText: string): SetInputTextType => ({
  type: SET_INPUT_TEXT,
  inputText,
});

type DispatchType = Dispatch<ActionTypes>;
type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionTypes>;

export const getComposedImage = (reqTags: Array<string>): ThunkType => {
  return async (dispatch: DispatchType) => {
    dispatch(toggleIsLoading(true));
    const requests = reqTags.map((tag) => {
      return imageAPI.getImage(tag);
    });
    const results = await Promise.all(requests);
    const imageUrls = [] as Array<string>;
    let isHttpError = false;
    results.forEach((item) => {
      if (item.status !== 200) {
        isHttpError = true;
      } else if (item.data.data.image_url) {
        imageUrls.push(item.data.data.image_url);
      }
    });
    if (isHttpError) {
      dispatch(changeErrorText('Произошла http ошибка'));
    } else if (results.length !== imageUrls.length) {
      dispatch(changeErrorText('По тегу ничего не найдено'));
    } else {
      const tag = reqTags.join(',');
      dispatch(addImage(tag, imageUrls));
      dispatch(changeErrorText(''));
      dispatch(setTags());
    }
    dispatch(toggleIsLoading(false));
  };
};

export default imagesReducer;
