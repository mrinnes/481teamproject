


app.delete("/questions", function(req, res) {
  Question.delete("questions").findOneAndDelete({question: req.body.question},
  function(err, result){
    if(err) {
      res.send(500, err);
    }
    res.send("Question deleted.")
  })
});


<button class="btn btn-danger" type="button" data-original-title="Remove question." aria-pressed="false">
  Delete
</button>
