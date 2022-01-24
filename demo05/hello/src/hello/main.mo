import List "mo:base/List";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor {
    // public type Message = (Text,Int);

    public type Message = {
        message:Text;
        time:Time.Time;
        author: ?Text;
    };

    public type Follow = {
        id: Text;
        author: ?Text;
    };

    public type Microblog = actor {
        follow: shared(id:Principal, pass: Text) -> async();
        follows: shared query () -> async [Follow];
        post: shared (text: Text, pass: Text) -> async ();
        posts: shared query (since: Time.Time) -> async [Message];
        timeline: shared (pid: Text,since: Time.Time) -> async [Message];
        set_name: shared (name: Text) -> async();
        get_name: shared query () -> async ?Text;
    };

    stable var author : ?Text = ?"@71-Kevin";
    
    public shared(msg) func set_name(name: ?Text) : async () {
        author := name;
    };

    public shared query func get_name() : async ?Text {
        author;
    };

    stable var password : Text = "123456";
    public shared func set_passwd(oldPasswd: Text, passwd: Text) : async () {
        assert(oldPasswd == password);
        password := passwd;
    };
    public shared query func get_passwd() : async Text {
        password;
    };

    var followed : List.List<Follow> = List.nil();

    public shared func follow(id: Principal) : async () {
        let canister : Microblog = actor(Principal.toText(id));
        let author_name : ?Text = await canister.get_name();
        let follower = {
            id = Principal.toText(id);
            author = author_name;
        };
        followed := List.push(follower,followed);
    };

    public shared query func follows() : async [Follow] {
        List.toArray(followed)
    };

    stable var messages : List.List<Message> = List.nil();

    public shared (msg) func post(otp: Text,text: Text) : async () {
        assert(otp == password);
        let newMessage = {
            message = text;
            time = Time.now();
            author = author;
        };
        messages := List.push(newMessage, messages);
    };

    public shared query func posts(since : Time.Time) : async [Message] {
        var all : List.List<Message> = List.nil();
        for(msg in Iter.fromList(messages)){
            if (msg.time > since){
                all := List.push(msg,all);
            };
        };
        List.toArray(all)
    };

    public shared func timeline(id: Text,since : Time.Time) : async [Message] {
        var all : List.List<Message> = List.nil();
        let canister : Microblog = actor(id);
        let msgs = await canister.posts(since);
        for(msg in Iter.fromArray(msgs)){
            all := List.push(msg,all);
        };
        List.toArray(all);
    };
};