export const idlFactory = ({ IDL }) => {
  const Follower = IDL.Record({
    'id' : IDL.Text,
    'author' : IDL.Opt(IDL.Text),
  });
  const Time = IDL.Int;
  const Message = IDL.Record({
    'time' : Time,
    'author' : IDL.Opt(IDL.Text),
    'message' : IDL.Text,
  });
  return IDL.Service({
    'follow' : IDL.Func([IDL.Principal], [], []),
    'follows' : IDL.Func([], [IDL.Vec(Follower)], ['query']),
    'get_name' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'get_passwd' : IDL.Func([], [IDL.Text], ['query']),
    'post' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'posts' : IDL.Func([Time], [IDL.Vec(Message)], ['query']),
    'set_name' : IDL.Func([IDL.Opt(IDL.Text)], [], []),
    'set_passwd' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'timeline' : IDL.Func([IDL.Text, Time], [IDL.Vec(Message)], []),
  });
};
export const init = ({ IDL }) => { return []; };
