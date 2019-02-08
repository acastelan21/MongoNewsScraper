$(".btn").on("click", function () {
    let articleId = $(this).data("id");

        
    $.post("/update/:id",function(response){
        console.log(response)
    })
      });

      




      


  