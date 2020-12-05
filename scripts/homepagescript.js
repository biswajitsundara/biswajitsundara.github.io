document.addEventListener("submit", (e) => {

    let messages =[];

    const name = document.getElementById('name')
    if(name.value === '' || name.value == null){
       messages.push('Name is required<br>')
    }

    const email= document.getElementById('email');
    if(email.value === '' || email.value == null){
       messages.push('Email is required<br>')
    }

     const comment = document.getElementById('comment')
     if(comment.value === '' || comment.value == null){
       messages.push('Comment is required<br>')
    }

    if (messages.length >0 ){
      e.preventDefault();
      document.getElementById('error').innerHTML = messages;
    }

  });



function openBlog()
{
    window.open("gh-pages/blog/bloghome.html")
}