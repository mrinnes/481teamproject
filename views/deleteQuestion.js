app.delete("/questions", function(req, res) {
  Question.delete("questions").findOneAndDelete({question: req.body.question},
  function(err, result){
    if(err) {
      res.send(500, err);
    }
    res.send("Question deleted.")
  })
});

fetch({ /* request */}) {
  .then(res {
    if(res.ok) {
      return res.json;
    }
  })
  .then(data {
    console.log(data);
    window.location.reload(true);
  })
}

<button class="btn btn-danger" type="Submit" data-toggle="button" aria-pressed="false">
  Delete
</button>
