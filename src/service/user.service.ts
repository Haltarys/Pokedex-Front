import { AxiosResponse } from 'axios';
import Api, { handleError } from '../backend/axios';
import { IApiResponse } from '../models/api.model';
import {
  IUser, IUserLogin, IToken, IRegisterUser,
} from '../models/user.model';

const getToken = async (params: IUserLogin): Promise<IApiResponse<IToken>> => Api()
  .post('auth/login', { ...params }, { headers: { 'Content-Type': 'application/json' } })
  .then(
    (response: AxiosResponse<IToken>) => ({
      status: 'success',
      data: response.data,
    } as IApiResponse<IToken>),
  )
  .catch(handleError)
  .catch((error: Error) => ({ status: 'error', data: error.message }));

const getProfile = async (token: string): Promise<IApiResponse<IUser>> => Api()
  .get('auth/profile', { headers: { Authorization: `Bearer ${token}` } })
  .then(
    (response: AxiosResponse<IUser>) => ({
      status: 'success',
      data: response.data,
    } as IApiResponse<IUser>),
  )
  .catch(handleError)
  .catch((error: Error) => ({ status: 'error', data: error.message }));

const fetchUser = async (params: IUserLogin): Promise<IApiResponse<IUser>> => {
  const res: IApiResponse<IToken> = await getToken(params);

  if (res.status === 'error') throw new Error(res.data as string);
  const token: string = (res.data as IToken).jwt;
  return getProfile(token);
};

const registerUser = async (body: IRegisterUser): Promise<IApiResponse<IUser>> => Api().post('user', { ...body }, { headers: { 'Content-Type': 'application/json' } })
  .then((response: AxiosResponse<IUser>) => ({
    status: 'success',
    data: response.data,
  }) as IApiResponse<IUser>).catch(handleError)
  .catch((err: Error) => ({ status: 'error', data: err.message }));

const UserService = {
  fetchUser,
  registerUser,
};

export default UserService;
