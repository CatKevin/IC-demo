import { hello } from "../../declarations/hello";

function formatDate (time) {//时间戳转日期
  let date = new Date(time);
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? ('0' + MM) : MM;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
  // return y + '-' + MM + '-' + d;
}


async function post() {
  let post_button = document.getElementById("post");
  let error = document.getElementById("error");
  error.innerText = ""
  post_button.disabled = true;
  let textarea = document.getElementById("message");
  let otp = document.getElementById("otp").value;
  let text = textarea.value;
  if(text==""||text==null||text==undefined){
    alert("请输入您需要发布的内容!");
    post_button.disabled = false;
    return;
  }
  if(otp==""||otp==null||otp==undefined){
    alert("请输入密码!");
    post_button.disabled = false;
    return;
  }
  try {
    await hello.post(otp,text);
    textarea.value = "";
  } catch (err) {
    console.log(err)
    error.innerText = "Post failed!";
    alert("Post failed!");
  }
  post_button.disabled = false;
}

var num_posts = 0;
async function load_posts() {
  let post_session = document.getElementById("myPosts");
  try {
    let posts = await hello.posts(0);
    // console.log(posts)
    if (num_posts == posts.length) return;
    post_session.replaceChildren([]);
    num_posts = posts.length;
    // for(var i=0; i < posts.length; i++) {
    //   let post = document.createElement("p");
    //   post.innerText = posts[i].message;
    //   post_session.appendChild(post);
    // }

    let tr = ""
    for(let i=0;i<posts.length;i++){
      tr = tr + `<tr>
      <td style="border: 0px;"> No.  `+ i +` - PostTime ：`+ formatDate(Number(posts[i].time / 1000000n))+` </td>
      <td style="border: 0px;">Author：`+ posts[i].author +`</td>
      </tr>
      <tr>
      <td colspan="2" style="border: 0px;">`+ posts[i].message +`</td>
      </tr>
      `
    }
    let htmlCode= `<table border="0">
    <tbody>
    `+tr+`
    </tbody>
    </table>`
    post_session.innerHTML = htmlCode
  } catch (e) {
    console.warn("load_posts: " + e);
  }
}

async function load_author() {
  let author = document.getElementById("author");
  var name = "71-Kevin";
  try {
    name = await hello.get_name();
    // console.log(name)
  } catch (e) {
    console.warn("load_author_name: " + e);
  }
  author.innerText = name;
}

var num_follows = 0;
async function load_follows() {
  let follows = null;
  try {
    follows = await hello.follows();
    console.log(follows)
    if (follows == null || num_follows == follows.length) return; 
    showFollowsList(follows)
    num_follows = follows.length;
  } catch (e) {
    console.warn("load_follows: " + e);
  }
}


async function load_timeline(id) {
  let timelines = null;
  try {
    timelines = await hello.timeline(id,0);
    console.log(timelines)
    let tr = ""
    for(let i=0;i<timelines.length;i++){
      tr = tr + `<tr>
      <td style="border: 0px;"> No.  `+ i +` - PostTime ：`+ formatDate(Number(timelines[i].time / 1000000n))+` </td>
      <td style="border: 0px;">Author：`+ timelines[i].author +`</td>
      </tr>
      <tr>
      <td colspan="2" style="border: 0px;">`+ timelines[i].message +`</td>
      </tr>
      `
    }
    // if (load_timeline_obj.id != null || load_canisterId == timelines.length) return; 
    let theTimeline = document.getElementById("theTimeline");
    let timeline_name = document.getElementById("timeline-name");
    let htmlCode= `<table border="0">
    <tbody>
    `+tr+`
    </tbody>
    </table>`
    theTimeline.innerHTML = htmlCode
    timeline_name.innerHTML = timelines[0].author + `'s blogs`

  } catch (e) {
    console.warn("load_timeline: " + e);
  }
}

async function showFollowsList(follows){
  let myFollows = document.getElementById("myFollows");
  myFollows.replaceChildren([]);
  for(let i=0; i < follows.length; i++) {
    let tr = document.createElement("tr");
    // div.style.display="table-column";
    let td1 = document.createElement("td");
    let follow = document.createElement("p");
    td1.style = "border: 0px;"
    td1.appendChild(follow)

    let td2 = document.createElement("td");
    let btn = document.createElement("button");
    td2.style = "border: 0px;"
    td2.appendChild(btn)

    follow.innerText = "CanisterID ：" + follows[i].id;
    btn.innerText = "查看 " + follows[i].author + " 的blog";
    btn.id = "btn-" + follows[i].id
    btn.setAttribute("pid",follows[i].id); 
    btn.setAttribute("author",follows[i].author); 
    btn.addEventListener("click", async (e) => {
      let pid = e.target.getAttribute("pid");
      let author = e.target.getAttribute("author");
      let id = e.target.getAttribute("id");
      let btnTmp = document.getElementById(id);
      btnTmp.innerText = `加载中...`
      await load_timeline(pid)
      let modal = document.getElementById('myModal');
      modal.style.display = "block";
      btnTmp.innerText = "查看 " + author + " 的blog";
    });
    tr.appendChild(td1)
    tr.appendChild(td2)
    myFollows.appendChild(tr);
  }
}

function load() {
  let post_button = document.getElementById("post");
  post_button.onclick = post;
  load_author();
  load_follows();
  load_posts();
  setInterval(load_posts,3000);
}

window.onload = load


function showModal(e){
  console.log(this.canisterId)
  let modal = document.getElementById('myModal');
  modal.style.display = "block";
  alert(canisterId)
}

var modal = document.getElementById('myModal');
var btn = document.getElementById("open");
var span = document.querySelector('.close');
  

 
 span.onclick = function() {
     modal.style.display = "none";
 }
  
 // 在用户点击其他地方时，关闭弹窗
 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
     }
 }
