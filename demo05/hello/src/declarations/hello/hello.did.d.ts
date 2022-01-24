import type { Principal } from '@dfinity/principal';
export interface Follower { 'id' : string, 'author' : [] | [string] }
export interface Message {
  'time' : Time,
  'author' : [] | [string],
  'message' : string,
}
export type Time = bigint;
export interface _SERVICE {
  'follow' : (arg_0: Principal) => Promise<undefined>,
  'follows' : () => Promise<Array<Follower>>,
  'get_name' : () => Promise<[] | [string]>,
  'get_passwd' : () => Promise<string>,
  'post' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'posts' : (arg_0: Time) => Promise<Array<Message>>,
  'set_name' : (arg_0: [] | [string]) => Promise<undefined>,
  'set_passwd' : (arg_0: string, arg_1: string) => Promise<undefined>,
  'timeline' : (arg_0: string, arg_1: Time) => Promise<Array<Message>>,
}
